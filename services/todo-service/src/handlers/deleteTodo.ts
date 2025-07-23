import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
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
        body: JSON.stringify({
          error: "Path parameter 'id' is missing or invalid",
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: ReturnValue.ALL_OLD,
    };
    const deleteCommand = new DeleteCommand(params);
    const result = await dynamoDb.send(deleteCommand);
    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'To-do item not found' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'To-do item deleted successfully',
        deletedItem: result.Attributes,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error deleting to-do item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete to-do item' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
