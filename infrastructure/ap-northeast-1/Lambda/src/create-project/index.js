
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

      const detail = body.detail ?? null;
      const projectType = detail?.type ?? body.type ?? null;

      const metadata = {
        status: body.metadata?.status ?? 'PUBLISHED',
        order: typeof body.metadata?.order === 'number' ? body.metadata.order : null,
        createdAt: now,
        updatedAt: now,
      };

      const orderToken =
        metadata.order !== null
          ? buildOrderToken(metadata.order)
          : buildFallbackOrderToken();

      const projectItem = {
        EntityPartitionKey: `PROJECT#${idForPartition}`,
        EntitySortKey: 'PROFILE',
        PortfolioIndexPartitionKey: 'PORTFOLIO#ALL',
        PortfolioIndexSortKey: orderToken,
        id,
        title: body.title,
        summary: body.summary,
        techStack: body.techStack,
        detail,
        metadata,
        createdAt: now,
        updatedAt: now,
      };

      if (projectType) {
        projectItem.type = projectType;
        projectItem.ProjectTypeIndexPartitionKey = `TYPE#${projectType}`;
        projectItem.ProjectTypeIndexSortKey = orderToken;
      }

      const command = new PutCommand({
        TableName: projectTable,
        Item: projectItem,
        ConditionExpression:
          'attribute_not_exists(EntityPartitionKey) AND attribute_not_exists(EntitySortKey)',
      });
      await dynamoDb.send(command);

      const responseProject = {
        id,
        title: body.title,
        summary: body.summary,
        techStack: body.techStack,
        detail,
        metadata,
        type: projectType,
        createdAt: now,
        updatedAt: now,
      };

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