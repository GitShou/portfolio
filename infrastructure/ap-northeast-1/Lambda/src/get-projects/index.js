'use strict';

const AWS = require('aws-sdk');
const projectTable = process.env.PROJECT_TABLE_NAME;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});

exports.handler = async (event) => {
  try {
    const params = {
      TableName: projectTable,
    };
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ projects: result.Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'エラーが発生しました', error: error.message }),
    };
  }
};