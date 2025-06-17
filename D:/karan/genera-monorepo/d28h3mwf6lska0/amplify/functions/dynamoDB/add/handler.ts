import {
  DynamoDB,
} from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  const item = {
    ...event.arguments.input,
  };

  await docClient
    .put({
      TableName: TABLE_NAME,
      Item: item,
    })
    .promise();

  return item;
};
