import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async () => {
  const result = await docClient
    .scan({
      TableName: TABLE_NAME,
    })
    .promise();

  return result.Items;
};