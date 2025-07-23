import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
    sslEnabled: false,
    forcePathStyle: true,
  };
}

const dynamoDbClient = new DynamoDBClient(options);
export const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
