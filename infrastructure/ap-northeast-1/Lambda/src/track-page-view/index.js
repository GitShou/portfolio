import { randomUUID } from "node:crypto";

const PROJECT_PAGE_PATH_PATTERN = /^\/projects\/[^/?#]+\/?$/;
const DEFAULT_PREFIX = "events/";
let cachedS3Client;
let cachedPutObjectCommandFactory;

function getHeader(headers, key) {
  if (!headers) return undefined;
  return headers[key] ?? headers[key.toLowerCase()] ?? headers[key.toUpperCase()];
}

function normalizePath(path) {
  if (typeof path !== "string") return null;
  const trimmed = path.trim();
  if (trimmed.length === 0 || !trimmed.startsWith("/")) return null;
  return trimmed === "/" ? "/" : trimmed.replace(/\/+$/, "");
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  if (typeof body !== "string") return {};
  return JSON.parse(body);
}

function buildHeaders() {
  return {
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : "",
  };
}

function resolvePath(body, query, keyList) {
  for (const key of keyList) {
    if (body[key]) return normalizePath(body[key]);
    if (query[key]) return normalizePath(query[key]);
  }
  return null;
}

function normalizePrefix(rawPrefix) {
  const prefix = typeof rawPrefix === "string" ? rawPrefix.trim() : "";
  if (prefix.length === 0) return DEFAULT_PREFIX;
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function toDateParts(isoTimestamp) {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return toDateParts(new Date().toISOString());
  }

  return {
    year: String(date.getUTCFullYear()),
    month: String(date.getUTCMonth() + 1).padStart(2, "0"),
    day: String(date.getUTCDate()).padStart(2, "0"),
    hour: String(date.getUTCHours()).padStart(2, "0"),
  };
}

function buildObjectKey({ prefix, timestamp, requestId }) {
  const date = toDateParts(timestamp);
  const safeRequestId = (requestId ?? "req").replace(/[^a-zA-Z0-9-]/g, "_");
  return `${prefix}year=${date.year}/month=${date.month}/day=${date.day}/hour=${date.hour}/${safeRequestId}-${Date.now()}-${randomUUID()}.json`;
}

async function resolvePutObjectCommandFactory(explicitFactory) {
  if (explicitFactory) return explicitFactory;
  if (cachedPutObjectCommandFactory) return cachedPutObjectCommandFactory;

  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  cachedPutObjectCommandFactory = (input) => new PutObjectCommand(input);
  return cachedPutObjectCommandFactory;
}

async function resolveS3Client(explicitClient) {
  if (explicitClient) return explicitClient;
  if (cachedS3Client) return cachedS3Client;

  const { S3Client } = await import("@aws-sdk/client-s3");
  cachedS3Client = new S3Client({
    region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION,
  });
  return cachedS3Client;
}

async function putBeaconLog({
  s3Client,
  putObjectCommandFactory,
  bucketName,
  key,
  payload,
}) {
  const client = await resolveS3Client(s3Client);
  const createPutObjectCommand =
    await resolvePutObjectCommandFactory(putObjectCommandFactory);

  await client.send(
    createPutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(payload),
      ContentType: "application/json",
    })
  );
}

export function createHandler({
  logger = console,
  s3Client,
  putObjectCommandFactory,
} = {}) {
  return async function handler(event) {
    const method = event?.requestContext?.httpMethod ?? event?.httpMethod ?? "POST";
    if (method === "OPTIONS") {
      return buildResponse(204);
    }

    let payload;
    try {
      payload = parseBody(event?.body);
    } catch {
      return buildResponse(400, { message: "invalid JSON body" });
    }

    const query = event?.queryStringParameters ?? {};
    const toPath = resolvePath(payload, query, ["path", "toPath", "to", "to_path"]);
    const fromPath = resolvePath(payload, query, ["fromPath", "from", "from_path"]);

    if (!toPath) {
      return buildResponse(400, { message: "path (or toPath/to) is required" });
    }

    const bucketName = process.env.BEACON_LOG_BUCKET_NAME;
    if (!bucketName) {
      logger.error("BEACON_LOG_BUCKET_NAME is not configured");
      return buildResponse(500, { message: "beacon log bucket is not configured" });
    }

    const tracked = PROJECT_PAGE_PATH_PATTERN.test(toPath);
    const normalizedEvent = {
      eventType: payload.eventType ?? query.ev ?? "page_view",
      toPath,
      fromPath,
      tracked,
      sourceIp: event?.requestContext?.identity?.sourceIp ?? null,
      userAgent:
        payload.userAgent ??
        getHeader(event?.headers, "user-agent") ??
        null,
      referrer:
        payload.referrer ??
        getHeader(event?.headers, "referer") ??
        getHeader(event?.headers, "referrer") ??
        null,
      requestId: event?.requestContext?.requestId ?? randomUUID(),
      timestamp: payload.timestamp ?? new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    };

    const prefix = normalizePrefix(process.env.BEACON_LOG_PREFIX);
    const key = buildObjectKey({
      prefix,
      timestamp: normalizedEvent.timestamp,
      requestId: normalizedEvent.requestId,
    });

    try {
      await putBeaconLog({
        s3Client,
        putObjectCommandFactory,
        bucketName,
        key,
        payload: normalizedEvent,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`failed to persist beacon log: ${message}`);
      return buildResponse(500, { message: "failed to persist beacon log" });
    }

    logger.log(
      JSON.stringify({ message: "page-view-event", bucketName, key, ...normalizedEvent })
    );
    return buildResponse(204);
  };
}

export const handler = createHandler();
