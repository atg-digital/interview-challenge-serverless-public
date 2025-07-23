import type {
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { TABLE_NAME } from '../constants';
import { dynamoDb } from '../lib/dynamodb';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const queryParams =
      event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
    const limitNumber = queryParams?.limit ? Number(queryParams.limit) : 10;
    const lastKey = queryParams?.lastKey
      ? JSON.parse(queryParams.lastKey)
      : undefined;

    const params = {
      TableName: TABLE_NAME,
      Limit: limitNumber,
      ExclusiveStartKey: lastKey,
    };

    const result = await dynamoDb.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: result.Items?.map((item) => unmarshall(item)),
        lastKey: result.LastEvaluatedKey
          ? JSON.stringify(result.LastEvaluatedKey)
          : null,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('There was an error fetching todos: ', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch todos' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
