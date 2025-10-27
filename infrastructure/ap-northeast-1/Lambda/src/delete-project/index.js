
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
      const partitionKeyValue = typeof id === 'number' ? id.toString() : String(id);
      const command = new DeleteCommand({
        TableName: projectTable,
        Key: {
          EntityPartitionKey: `PROJECT#${partitionKeyValue}`,
          EntitySortKey: 'PROFILE',
        },
        ReturnValues: 'ALL_OLD',
      });
      const result = await dynamoDb.send(command);
      if (!result.Attributes) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: '指定されたプロジェクトは存在しません' }),
        };
      }
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