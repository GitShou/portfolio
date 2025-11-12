
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

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

const toPartitionKeyValue = (id) =>
  typeof id === 'number' ? id.toString() : String(id);

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

const sanitizeProjectItem = (item) => {
  if (!item) return null;
  const {
    EntityPartitionKey,
    EntitySortKey,
    PortfolioIndexPartitionKey,
    PortfolioIndexSortKey,
    ProjectTypeIndexPartitionKey,
    ProjectTypeIndexSortKey,
    ...project
  } = item;
  return project;
};

// テスト時にスタブ化したクライアントを注入できるようにしたファクトリ。
export function createHandler({ documentClient } = {}) {
  const dynamoDb = documentClient ?? buildDocumentClient();

  return async function handler(event) {
    try {
      const projectTable = process.env.PROJECT_TABLE_NAME;
      const { id } = event.pathParameters || {};
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

      if (!id || !body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'idと更新内容は必須です' }),
        };
      }

      const partitionKeyValue = toPartitionKeyValue(id);
      const key = {
        EntityPartitionKey: `PROJECT#${partitionKeyValue}`,
        EntitySortKey: 'PROFILE',
      };

      const existingResult = await dynamoDb.send(
        new GetCommand({ TableName: projectTable, Key: key })
      );

      if (!existingResult.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: '指定されたプロジェクトは存在しません' }),
        };
      }

      const existingItem = existingResult.Item;
      const existingOrderToken = existingItem.PortfolioIndexSortKey;
      const updatedItem = { ...existingItem };

      assignProjectAttributes(updatedItem, body);

      const metadataPatch = isPlainObject(body.metadata) ? body.metadata : undefined;
      const existingMetadata = isPlainObject(updatedItem.metadata)
        ? { ...updatedItem.metadata }
        : {};

      const now = new Date().toISOString();
      const createdAt = existingMetadata.createdAt ?? now;

      const mergedMetadata = {
        ...existingMetadata,
        ...(metadataPatch ?? {}),
        createdAt,
        updatedAt: now,
      };

      const rawOrder = mergedMetadata.order;
      const normalizedOrder =
        typeof rawOrder === 'number' && Number.isFinite(rawOrder)
          ? rawOrder
          : existingMetadata.order ?? null;

      mergedMetadata.order = normalizedOrder;

      updatedItem.metadata = mergedMetadata;
      updatedItem.updatedAt = now;
      updatedItem.createdAt = existingItem.createdAt ?? createdAt;

      const projectType =
        body.type ?? updatedItem.detail?.type ?? updatedItem.type ?? existingItem.type ?? null;
      if (projectType) {
        updatedItem.type = projectType;
      } else {
        delete updatedItem.type;
      }

      const orderToken =
        typeof mergedMetadata.order === 'number'
          ? buildOrderToken(mergedMetadata.order)
          : existingOrderToken ?? buildFallbackOrderToken();

      updatedItem.EntityPartitionKey = `PROJECT#${partitionKeyValue}`;
      updatedItem.EntitySortKey = 'PROFILE';
      updatedItem.PortfolioIndexPartitionKey = 'PORTFOLIO#ALL';
      updatedItem.PortfolioIndexSortKey = orderToken;

      if (updatedItem.type) {
        updatedItem.ProjectTypeIndexPartitionKey = `TYPE#${updatedItem.type}`;
        updatedItem.ProjectTypeIndexSortKey = orderToken;
      } else {
        delete updatedItem.ProjectTypeIndexPartitionKey;
        delete updatedItem.ProjectTypeIndexSortKey;
      }

      const putCommand = new PutCommand({
        TableName: projectTable,
        Item: updatedItem,
        ConditionExpression:
          'attribute_exists(EntityPartitionKey) AND attribute_exists(EntitySortKey)',
      });

      await dynamoDb.send(putCommand);

      const responseProject = sanitizeProjectItem(updatedItem);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'プロジェクトを更新しました', project: responseProject }),
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