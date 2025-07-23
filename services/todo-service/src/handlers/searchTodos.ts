import { ScanCommand, type ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { dynamoDb } from '../lib/dynamodb';
import { TABLE_NAME } from '../constants';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const queryParameters = event.queryStringParameters as { query: string };
    const { query } = queryParameters || {};
    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing query parameter' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    const params: ScanCommandInput = {
      TableName: TABLE_NAME,
      FilterExpression: 'contains (#task, :searchString)',
      ExpressionAttributeNames: {
        '#task': 'task',
      },
      ExpressionAttributeValues: {
        ':searchString': query,
      },
    };
    const result = await dynamoDb.send(new ScanCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('An error occurred', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Could not search to-do items',
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
