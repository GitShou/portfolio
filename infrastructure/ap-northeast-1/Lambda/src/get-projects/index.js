
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

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

// テスト用にスタブ化したクライアントを受け取れるようにしたファクトリ。
export function createHandler({ documentClient } = {}) {
  const dynamoDb = documentClient ?? buildDocumentClient();

  return async function handler(event) {
    try {
      const projectTable = process.env.PROJECT_TABLE_NAME;
      const command = new ScanCommand({ TableName: projectTable });
      const result = await dynamoDb.send(command);
      const projects = result.Items ?? [];
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