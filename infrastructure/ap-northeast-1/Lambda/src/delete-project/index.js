'use strict';

const AWS = require('aws-sdk');
const projectTable = process.env.PROJECT_TABLE_NAME;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'idは必須です' }),
      };
    }
    const params = {
      TableName: projectTable,
      Key: { id },
    };
    await dynamoDb.delete(params).promise();
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