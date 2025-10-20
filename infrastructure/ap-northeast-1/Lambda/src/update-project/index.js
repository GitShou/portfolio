'use strict';

const AWS = require('aws-sdk');
const projectTable = process.env.PROJECT_TABLE_NAME;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});

exports.handler = async (event) => {
  try {
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
    const params = {
      TableName: projectTable,
      Key: { id },
      UpdateExpression: 'set ' + Object.keys(updateFields).map((k, i) => `#${k}= :${k}`).join(', '),
      ExpressionAttributeNames: Object.keys(updateFields).reduce((acc, k) => { acc[`#${k}`] = k; return acc; }, {}),
      ExpressionAttributeValues: Object.keys(updateFields).reduce((acc, k) => { acc[`:${k}`] = updateFields[k]; return acc; }, {}),
      ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'プロジェクトを更新しました', project: result.Attributes }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'エラーが発生しました', error: error.message }),
    };
  }
};