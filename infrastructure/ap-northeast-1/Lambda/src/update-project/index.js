
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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
      const updateFields = {};
      if (body.title) updateFields.title = body.title;
      if (body.summary) updateFields.summary = body.summary;
      if (body.techStack) updateFields.techStack = body.techStack;
      if (body.detail) updateFields.detail = body.detail;
      updateFields.updatedAt = new Date().toISOString();
      const command = new UpdateCommand({
        TableName: projectTable,
        Key: { id },
        UpdateExpression: 'set ' + Object.keys(updateFields).map(k => `#${k} = :${k}`).join(', '),
        ExpressionAttributeNames: Object.keys(updateFields).reduce((acc, k) => {
          acc[`#${k}`] = k;
          return acc;
        }, {}),
        ExpressionAttributeValues: Object.keys(updateFields).reduce((acc, k) => {
          acc[`:${k}`] = updateFields[k];
          return acc;
        }, {}),
        ReturnValues: 'ALL_NEW',
      });
      const result = await dynamoDb.send(command);
      const project = result.Attributes ?? null;
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'プロジェクトを更新しました', project }),
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