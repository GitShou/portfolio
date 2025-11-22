import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-athena";

const client = new AthenaClient({});

const buildDateString = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1); // 前日分を投入
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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

const tableExists = async () => {
  const query = `SHOW TABLES IN ${process.env.DATABASE} LIKE '${process.env.PARQUET_TABLE}'`;
  const qid = await runQuery(query);
  const res = await client.send(
    new GetQueryResultsCommand({ QueryExecutionId: qid })
  );
  const rows = res.ResultSet?.Rows ?? [];
  return rows.some(
    (row) =>
      row.Data?.[0]?.VarCharValue?.toLowerCase() ===
      process.env.PARQUET_TABLE.toLowerCase()
  );
};

const buildInsertQuery = (dateStr) => `
  INSERT INTO ${process.env.PARQUET_TABLE}
  SELECT
    date, time, x_edge_location, sc_bytes, c_ip, cs_method, cs_host, cs_uri_stem,
    sc_status, cs_referer, cs_user_agent, cs_uri_query, cs_cookie,
    x_edge_result_type, x_edge_request_id, x_host_header, cs_protocol,
    cs_bytes, time_taken, x_forwarded_for, ssl_protocol, ssl_cipher,
    x_edge_response_result_type, cs_protocol_version, fle_status, fle_encrypted_fields,
    c_port, time_to_first_byte, x_edge_detailed_result_type,
    sc_content_type, sc_content_len, sc_range_start, sc_range_end,
    substr(date,1,4) AS year, substr(date,6,2) AS month, substr(date,9,2) AS day, substr(time,1,2) AS hour
  FROM ${process.env.RAW_TABLE}
  WHERE date = '${dateStr}'
`;

const buildCreateQuery = () => `
  CREATE TABLE ${process.env.PARQUET_TABLE}
  WITH (
    format = 'PARQUET',
    external_location = '${process.env.PARQUET_LOCATION}',
    partitioned_by = ARRAY['year','month','day','hour']
  ) AS
  SELECT
    date, time, x_edge_location, sc_bytes, c_ip, cs_method, cs_host, cs_uri_stem,
    sc_status, cs_referer, cs_user_agent, cs_uri_query, cs_cookie,
    x_edge_result_type, x_edge_request_id, x_host_header, cs_protocol,
    cs_bytes, time_taken, x_forwarded_for, ssl_protocol, ssl_cipher,
    x_edge_response_result_type, cs_protocol_version, fle_status, fle_encrypted_fields,
    c_port, time_to_first_byte, x_edge_detailed_result_type,
    sc_content_type, sc_content_len, sc_range_start, sc_range_end,
    substr(date,1,4) AS year, substr(date,6,2) AS month, substr(date,9,2) AS day, substr(time,1,2) AS hour
  FROM ${process.env.RAW_TABLE}
`;

export const handler = async () => {
  const exists = await tableExists();
  if (!exists) {
    await runQuery(buildCreateQuery());
    return { status: "created_full_load" };
  }

  const dateStr = buildDateString();
  await runQuery(buildInsertQuery(dateStr));
  return { status: "inserted", date: dateStr };
};
