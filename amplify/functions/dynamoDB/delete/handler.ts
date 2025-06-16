import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  const id = event.arguments.id;

  const result = await docClient
    .delete({
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: "ALL_OLD"
    })
    .promise();

  return result.Attributes;
};