import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
} from "@aws-sdk/client-athena";

const client = new AthenaClient({});

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad2 = (value) => String(value).padStart(2, "0");

const formatUtcDate = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
    d.getUTCDate()
  )}`;
};

const formatUtcTime = (ms) => {
  const d = new Date(ms);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(
    d.getUTCSeconds()
  )}`;
};

// 「JSTの前日 00:00〜24:00」を、UTCの日時範囲に変換して返す
const buildJstYesterdayRange = (now = new Date()) => {
  const pseudoJst = new Date(now.getTime() + JST_OFFSET_MS);
  pseudoJst.setUTCHours(0, 0, 0, 0);
  pseudoJst.setUTCDate(pseudoJst.getUTCDate() - 1);

  const yyyy = pseudoJst.getUTCFullYear();
  const monthIndex = pseudoJst.getUTCMonth();
  const dd = pseudoJst.getUTCDate();

  const jstDate = `${yyyy}-${pad2(monthIndex + 1)}-${pad2(dd)}`;
  const startUtcMs = Date.UTC(yyyy, monthIndex, dd, 0, 0, 0) - JST_OFFSET_MS;
  const endUtcMs = startUtcMs + 24 * 60 * 60 * 1000;

  return {
    jstDate,
    startUtcDate: formatUtcDate(startUtcMs),
    startUtcTime: formatUtcTime(startUtcMs),
    endUtcDate: formatUtcDate(endUtcMs),
    endUtcTime: formatUtcTime(endUtcMs),
  };
};

const runQuery = async (query) => {
  const start = new StartQueryExecutionCommand({
    QueryString: query,
    QueryExecutionContext: { Database: process.env.DATABASE },
    WorkGroup: process.env.WORKGROUP,
  });
  const { QueryExecutionId } = await client.send(start);
  for (let i = 0; i < 30; i++) {
    const res = await client.send(
      new GetQueryExecutionCommand({ QueryExecutionId })
    );
    const state = res.QueryExecution?.Status?.State;
    if (state === "SUCCEEDED") return QueryExecutionId;
    if (state === "FAILED" || state === "CANCELLED") {
      throw new Error(`Athena query ${state}: ${QueryExecutionId}`);
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error("Athena query timeout");
};

const buildInsertQuery = (range) => `
  INSERT INTO ${process.env.PARQUET_TABLE}
  SELECT
    *,
    year(date_parse('${range.jstDate}', '%Y-%m-%d')) as year,
    month(date_parse('${range.jstDate}', '%Y-%m-%d')) as month,
    day(date_parse('${range.jstDate}', '%Y-%m-%d')) as day
  FROM ${process.env.RAW_TABLE}
  WHERE
  (
    (date = '${range.startUtcDate}' AND time >= '${range.startUtcTime}')
    OR (date = '${range.endUtcDate}' AND time < '${range.endUtcTime}')
  )
  AND (
    cs_user_agent IS NULL
    OR cs_user_agent NOT LIKE '%Amazon-Route53-Health-Check-Service%'
  )
`;

export const handler = async () => {

  const range = buildJstYesterdayRange();
  await runQuery(buildInsertQuery(range));
  return { status: "inserted", jstDate: range.jstDate, utcRange: range };

};
