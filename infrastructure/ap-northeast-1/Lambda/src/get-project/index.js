import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

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

const toPartitionKeyValue = (id) => (typeof id === 'number' ? id.toString() : String(id));

export function createHandler({ documentClient } = {}) {
  const dynamoDb = documentClient ?? buildDocumentClient();

  return async function handler(event) {
    try {
      const projectTable = process.env.PROJECT_TABLE_NAME;
      const { id } = event.pathParameters || {};

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'idは必須です' }),
        };
      }

      const key = {
        EntityPartitionKey: `PROJECT#${toPartitionKeyValue(id)}`,
        EntitySortKey: 'PROFILE',
      };

      const result = await dynamoDb.send(
        new GetCommand({
          TableName: projectTable,
          Key: key,
        })
      );

      if (!result.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: '指定されたプロジェクトは存在しません' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ project: sanitizeProjectItem(result.Item) }),
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
