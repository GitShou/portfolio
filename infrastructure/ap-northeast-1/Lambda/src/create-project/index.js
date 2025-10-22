
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

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
      const projectItem = {
        id: generateId(),
        title: body.title,
        summary: body.summary,
        techStack: body.techStack,
        detail: body.detail ?? null,
        createdAt: now,
        updatedAt: now,
      };

      const command = new PutCommand({
        TableName: projectTable,
        Item: projectItem,
      });
      await dynamoDb.send(command);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'プロジェクトを作成しました', project: projectItem }),
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