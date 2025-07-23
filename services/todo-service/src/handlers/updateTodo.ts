import { UpdateCommand, type UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import type {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { z } from 'zod';
import { dynamoDb } from '../lib/dynamodb';
import { TABLE_NAME } from '../constants';

const todoUpdateSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
  completed: z.boolean(),
});

type TodoUpdateData = z.infer<typeof todoUpdateSchema>;

const createResponse = (
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' },
});

const ERROR_MESSAGES = {
  BODY_REQUIRED: 'Request body is required',
  INVALID_JSON: 'Invalid JSON in request body',
  ID_REQUIRED: "Path parameter 'id' is required",
  INTERNAL_ERROR: 'Internal server error',
} as const;

const validateRequestBody = (body: string | null): TodoUpdateData => {
  if (!body) {
    throw new Error(ERROR_MESSAGES.BODY_REQUIRED);
  }

  try {
    const parsedData = JSON.parse(body);
    return todoUpdateSchema.parse(parsedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.issues.map((e) => e.message).join(', ')}`
      );
    }
    throw new Error(ERROR_MESSAGES.INVALID_JSON);
  }
};

const validatePathParameters = (
  pathParameters: APIGatewayProxyEventPathParameters | null
): string => {
  if (!pathParameters?.id) {
    throw new Error(ERROR_MESSAGES.ID_REQUIRED);
  }
  return pathParameters.id;
};

const updateTodoInDatabase = async (id: string, data: TodoUpdateData) => {
  const params: UpdateCommandInput = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET task = :task, completed = :completed',
    ExpressionAttributeValues: {
      ':task': data.task,
      ':completed': data.completed,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamoDb.send(new UpdateCommand(params));
  return result.Attributes || {};
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const updateData = validateRequestBody(event.body);
    const todoId = validatePathParameters(event.pathParameters);

    const updatedTodo = await updateTodoInDatabase(todoId, updateData);

    return createResponse(200, updatedTodo);
  } catch (error) {
    console.error('Error updating todo item:', error);

    if (error instanceof Error) {
      const message = error.message;
      if (
        message.includes('Validation error') ||
        message.includes('Request body') ||
        message.includes('Path parameter')
      ) {
        return createResponse(400, { error: message });
      }
    }

    return createResponse(500, { error: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};
