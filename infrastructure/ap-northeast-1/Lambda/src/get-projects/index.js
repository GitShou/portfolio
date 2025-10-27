
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

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

// テスト用にスタブ化したクライアントを受け取れるようにしたファクトリ。
export function createHandler({ documentClient } = {}) {
  const dynamoDb = documentClient ?? buildDocumentClient();

  return async function handler(event) {
    try {
      const projectTable = process.env.PROJECT_TABLE_NAME;
      const command = new QueryCommand({
        TableName: projectTable,
        IndexName: 'GSI1',
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: {
          '#pk': 'PortfolioIndexPartitionKey',
        },
        ExpressionAttributeValues: {
          ':pk': 'PORTFOLIO#ALL',
        },
        ScanIndexForward: true,
      });
      const result = await dynamoDb.send(command);
      const projects = (result.Items ?? []).map(sanitizeProjectItem);
      return {
        statusCode: 200,
        body: JSON.stringify({ projects }),
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