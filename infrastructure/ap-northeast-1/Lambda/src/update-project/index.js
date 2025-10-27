
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

const buildDocumentClient = () =>
  DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: process.env.REGION }),
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

      if (body.title !== undefined) {
        updatedItem.title = body.title;
      }
      if (body.summary !== undefined) {
        updatedItem.summary = body.summary;
      }
      if (body.techStack !== undefined) {
        updatedItem.techStack = body.techStack;
      }
      if (body.detail !== undefined) {
        updatedItem.detail = body.detail;
      }

      if (!updatedItem.metadata) {
        updatedItem.metadata = {};
      }
      if (body.metadata) {
        updatedItem.metadata = {
          ...updatedItem.metadata,
          ...body.metadata,
        };
      }

      const now = new Date().toISOString();
      updatedItem.updatedAt = now;
      updatedItem.metadata = {
        ...updatedItem.metadata,
        updatedAt: now,
      };

      const projectType =
        body.type ?? body.detail?.type ?? updatedItem.type ?? updatedItem.detail?.type ?? null;
      if (projectType) {
        updatedItem.type = projectType;
      } else {
        delete updatedItem.type;
      }

      const orderValue = updatedItem.metadata?.order;
      const orderToken =
        typeof orderValue === 'number'
          ? buildOrderToken(orderValue)
          : existingOrderToken ?? buildFallbackOrderToken();

      updatedItem.EntityPartitionKey = `PROJECT#${partitionKeyValue}`;
      updatedItem.EntitySortKey = 'PROFILE';
      updatedItem.PortfolioIndexPartitionKey = 'PORTFOLIO#ALL';
      updatedItem.PortfolioIndexSortKey = orderToken;

      if (projectType) {
        updatedItem.ProjectTypeIndexPartitionKey = `TYPE#${projectType}`;
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