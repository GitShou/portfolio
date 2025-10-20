'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const projectTable = process.env.PROJECT_TABLE_NAME;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});

/**
 * Project型に沿ったバリデーション・格納例
 * idはuuidで自動生成
 */
exports.handler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    // 必須項目チェック
    if (!body.title || !body.summary || !Array.isArray(body.techStack)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'title, summary, techStackは必須です' }),
      };
    }

    // idはuuidで自動生成
    const id = uuidv4();

    // DynamoDBに格納するプロジェクトデータ
    const projectItem = {
      id,
      title: body.title,
      summary: body.summary,
      techStack: body.techStack,
      detail: body.detail || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: projectTable,
      Item: projectItem,
    };

    await dynamoDb.put(params).promise();

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