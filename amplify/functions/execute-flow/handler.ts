import type { Handler } from "aws-lambda";
import { LambdaClient, InvokeCommand, LogType } from "@aws-sdk/client-lambda";

const lambda = new LambdaClient({});

export const handler: Handler = async (event, context) => {
  const stateMachineArn = process.env.STATE_MACHINE_ARN;
  const payloadString = process.env.PAYLOAD;
  const type = process.env.TYPE;
  let payload;
  try {
    payload = payloadString ? JSON.parse(payloadString) : null;
  } catch {
    return {
      error: "Invalid JSON in PAYLOAD environment variable",
    };
  }

  if (!stateMachineArn) {
    return {
      error: "Missing stateMachineArn",
    };
  }

  if (!payload) {
    return {
      error: "Missing payload",
    };
  }

  if (!type) {
    return {
      error: "Missing type (STANDARD or EXPRESS)",
    };
  }

  const command = new InvokeCommand({
    FunctionName:
      "arn:aws:lambda:us-east-1:992382535498:function:test-dev-amplify-app",
    Payload: Buffer.from(JSON.stringify({ stateMachineArn, type, payload })),
    LogType: LogType.Tail,
  });

  const response = await lambda.send(command);

  let duration = "0 ms";
  let billedDuration = "0 ms";
  let memorySize = "0 MB";
  let maxMemoryUsed = "0 MB";
  let requestId = "";
  let logOutput = "";

  const logResult = response.LogResult;
  if (logResult) {
    const decodedLogResult = Buffer.from(logResult, "base64").toString("utf-8");
    logOutput = decodedLogResult;

    const durationMatch = decodedLogResult.match(
      /REPORT RequestId: .*?Duration: ([\d.]+) (ms|s)/
    );
    const billedDurationMatch = decodedLogResult.match(
      /Billed Duration: (\d+) ms/
    );
    const memorySizeMatch = decodedLogResult.match(/Memory Size: (\d+) MB/);
    const maxMemoryUsedMatch = decodedLogResult.match(
      /Max Memory Used: (\d+) MB/
    );
    const requestIdMatch = decodedLogResult.match(/RequestId: (\S+)/);

    if (durationMatch) duration = `${durationMatch[1]} ${durationMatch[2]}`;
    if (billedDurationMatch) billedDuration = `${billedDurationMatch[1]} ms`;
    if (memorySizeMatch) memorySize = `${memorySizeMatch[1]} MB`;
    if (maxMemoryUsedMatch) maxMemoryUsed = `${maxMemoryUsedMatch[1]} MB`;
    if (requestIdMatch) requestId = requestIdMatch[1];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decodedPayload: Record<string, any> = {};
  if (response.Payload) {
    const payloadString = Buffer.from(response.Payload).toString("utf-8");
    try {
      decodedPayload = JSON.parse(payloadString);
    } catch (error) {
      decodedPayload = {
        rawPayload: payloadString,
      };
    }
  }

  const lambdaInvokeResponse = {
    executedVersion: response.ExecutedVersion ?? "$LATEST",
    statusCode: response.StatusCode ?? 500,
    logOutput,
    duration,
    billedDuration,
    memorySize,
    maxMemoryUsed,
    requestId,
    responsePayload: decodedPayload,
    errorMessage: response.FunctionError
      ? "Unhandled function error"
      : undefined,
    errorType: response.FunctionError ?? undefined,
    functionError: response.FunctionError ?? undefined,
  };

  if (!response || response.$metadata.httpStatusCode !== 200) {
    return {
      error: response.FunctionError,
    };
  }

  return lambdaInvokeResponse;
};