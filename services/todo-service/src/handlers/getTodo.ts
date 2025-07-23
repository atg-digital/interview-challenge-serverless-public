import { GetCommand } from '@aws-sdk/lib-dynamodb';
import type {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { dynamoDb } from '../lib/dynamodb';
import { TABLE_NAME } from '../constants';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters as APIGatewayProxyEventPathParameters;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing id parameter' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
    };
    const result = await dynamoDb.send(new GetCommand(params));
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Item not found' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve to-do item' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
