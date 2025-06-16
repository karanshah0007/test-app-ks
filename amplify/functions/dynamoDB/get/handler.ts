import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  const id = event.arguments.id;

  const result = await docClient
    .get({
      TableName: TABLE_NAME,
      Key: { id },
    })
    .promise();

  return result.Item;
};