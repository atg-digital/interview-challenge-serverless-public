import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { dynamoDb } from '../lib/dynamodb';
import { TABLE_NAME } from '../constants';

// TODO: probs abstract this to a constants file ✅

const getErrorDetails = (error: unknown): string | z.ZodIssue[] => {
  if (error instanceof z.ZodError) {
    return error.issues;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.body == null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is undefined or null' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const todoSchema = z.object({
      task: z.string().min(1),
      completed: z.boolean().optional(),
    });

    let dataParsed: { task: string; completed?: boolean | undefined };

    try {
      dataParsed = todoSchema.parse(JSON.parse(event.body));
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid input',
          details: getErrorDetails(e),
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const item = {
      id: uuidv4(),
      task: dataParsed.task,
      completed: dataParsed.completed ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    };

    await dynamoDb.send(new PutCommand(params));

    return {
      statusCode: 201,
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error creating to-do item:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create to-do item' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
