
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

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

// テストでDocumentClientをモック注入できるようにするファクトリ。
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
      const command = new DeleteCommand({
        TableName: projectTable,
        Key: { id },
      });
      await dynamoDb.send(command);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'プロジェクトを削除しました', id }),
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