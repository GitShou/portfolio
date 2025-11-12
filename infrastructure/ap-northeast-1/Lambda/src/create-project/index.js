
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const buildDocumentClient = () =>
  DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION }),
    {
      marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      },
    }
  );

const buildOrderToken = (order) =>
  `ORDER#${order.toString().padStart(4, '0')}`;

const buildFallbackOrderToken = () =>
  `ORDER#${Date.now().toString().padStart(13, '0')}`;

const sanitizeId = (candidateId, fallbackId) => {
  if (candidateId === undefined || candidateId === null) {
    return fallbackId;
  }
  return typeof candidateId === 'number' ? candidateId : String(candidateId);
};

const RESERVED_DYNAMO_KEYS = new Set([
  'EntityPartitionKey',
  'EntitySortKey',
  'PortfolioIndexPartitionKey',
  'PortfolioIndexSortKey',
  'ProjectTypeIndexPartitionKey',
  'ProjectTypeIndexSortKey',
  'createdAt',
  'updatedAt',
]);

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const assignProjectAttributes = (target, source) => {
  if (!isPlainObject(source)) return;
  for (const [key, value] of Object.entries(source)) {
    if (RESERVED_DYNAMO_KEYS.has(key) || key === 'metadata' || key === 'id') {
      continue;
    }
    if (value === undefined) {
      delete target[key];
      continue;
    }
    target[key] = value;
  }
};

// テストでDocumentClientやUUID生成を差し替えられるようにするファクトリ。
export function createHandler({ documentClient, uuidGenerator } = {}) {
  const dynamoDb = documentClient ?? buildDocumentClient();
  const generateId = uuidGenerator ?? randomUUID;

  return async function handler(event) {
    try {
      const projectTable = process.env.PROJECT_TABLE_NAME;
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

      if (!body?.title || !body.summary || !Array.isArray(body.techStack)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'title, summary, techStackは必須です' }),
        };
      }

      const now = new Date().toISOString();
      const providedId = body.id;
      const generatedId = generateId();
      const id = sanitizeId(providedId, generatedId);
      const idForPartition = typeof id === 'number' ? id : id.toString();

      const projectAttributes = {};
      assignProjectAttributes(projectAttributes, body);

      projectAttributes.id = id;
      projectAttributes.title = body.title;
      projectAttributes.summary = body.summary;
      projectAttributes.techStack = Array.isArray(body.techStack) ? body.techStack : [];
      projectAttributes.detail = body.detail ?? null;

      const metadataFromPayload = isPlainObject(body.metadata) ? body.metadata : {};
      const rawOrder = metadataFromPayload.order;
      const normalizedOrder =
        typeof rawOrder === 'number' && Number.isFinite(rawOrder) ? rawOrder : null;

      const createdAt = metadataFromPayload.createdAt ?? now;
      const metadata = {
        ...metadataFromPayload,
        status: metadataFromPayload.status ?? 'PUBLISHED',
        order: normalizedOrder,
        createdAt,
        updatedAt: now,
      };

      projectAttributes.metadata = metadata;
      projectAttributes.createdAt = createdAt;
      projectAttributes.updatedAt = now;

      const projectType =
        body.type ?? projectAttributes.detail?.type ?? projectAttributes.type ?? null;
      if (projectType) {
        projectAttributes.type = projectType;
      } else {
        delete projectAttributes.type;
      }

      const orderToken =
        metadata.order !== null
          ? buildOrderToken(metadata.order)
          : buildFallbackOrderToken();

      const projectItem = {
        ...projectAttributes,
        EntityPartitionKey: `PROJECT#${idForPartition}`,
        EntitySortKey: 'PROFILE',
        PortfolioIndexPartitionKey: 'PORTFOLIO#ALL',
        PortfolioIndexSortKey: orderToken,
      };

      if (projectAttributes.type) {
        projectItem.ProjectTypeIndexPartitionKey = `TYPE#${projectAttributes.type}`;
        projectItem.ProjectTypeIndexSortKey = orderToken;
      }

      const command = new PutCommand({
        TableName: projectTable,
        Item: projectItem,
        ConditionExpression:
          'attribute_not_exists(EntityPartitionKey) AND attribute_not_exists(EntitySortKey)',
      });
      await dynamoDb.send(command);

      const responseProject = { ...projectAttributes };

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'プロジェクトを作成しました', project: responseProject }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'エラーが発生しました', error: error.message }),
      };
    }
  };
}

export const handler = createHandler();