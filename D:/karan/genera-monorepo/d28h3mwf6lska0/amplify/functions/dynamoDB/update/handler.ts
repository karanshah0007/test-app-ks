import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  const { id, ...updates } = event.arguments.input;

  if (!id || Object.keys(updates).length === 0) {
    throw new Error("Missing 'id' or fields to update");
  }

  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};
  const updateExpressions: string[] = [];

  Object.entries(updates).forEach(([key, value], index) => {
    const attributeKey = `#key${index}`;
    const valueKey = `:value${index}`;
    expressionAttributeNames[attributeKey] = key;
    expressionAttributeValues[valueKey] = value;
    updateExpressions.push(`${attributeKey} = ${valueKey}`);
  });

  const updateExpression = `set ${updateExpressions.join(", ")}`;

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  const result = await docClient.update(params).promise();
  return result.Attributes;
};