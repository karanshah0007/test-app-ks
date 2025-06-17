import React from "react";

export interface ExecuteFlowResponse {
  executedVersion: string;
  statusCode: number;
  logOutput: string;
  duration: string;
  billedDuration: string;
  memorySize: string;
  maxMemoryUsed: string;
  requestId: string;
  responsePayload?: Record<string, any> | string;
  errorMessage?: string | null;
  errorType?: string | null;
  functionError?: string | null;
}

export default function LambdaResponseViewer({
  data,
}: {
  data: ExecuteFlowResponse;
}) {
  const isError =
    data.functionError ||
    (typeof data.responsePayload === "string" &&
      data.responsePayload.includes('statusCode":500'));

  const parsedPayload = (() => {
    if (!data.responsePayload) return null;

    let payload: any;

    try {
      payload =
        typeof data.responsePayload === "string"
          ? JSON.parse(data.responsePayload)
          : data.responsePayload;

      if (typeof payload.body === "string") {
        try {
          payload.body = JSON.parse(payload.body);
        } catch {}
      }
    } catch {
      return { raw: data.responsePayload };
    }

    return payload;
  })();

  return (
    <div
      className={`w-full max-w-4xl mx-auto mt-6 p-6 rounded-xl border ${
        isError
          ? "bg-red-50 border-red-400 text-red-700"
          : "bg-green-50 border-green-400 text-green-800"
      }`}
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Lambda Execution Result</h2>
        <p className="text-sm opacity-70">{isError ? "Error" : "Success"}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Request ID:</span> {data.requestId}
        </div>
        <div>
          <span className="font-medium">Executed Version:</span>{" "}
          {data.executedVersion}
        </div>
        <div>
          <span className="font-medium">Status Code:</span> {data.statusCode}
        </div>
        <div>
          <span className="font-medium">Duration:</span> {data.duration} |{" "}
          <span className="font-medium">Billed:</span> {data.billedDuration}
        </div>
        <div>
          <span className="font-medium">Memory:</span> {data.memorySize} |{" "}
          <span className="font-medium">Used:</span> {data.maxMemoryUsed}
        </div>
        {data.errorMessage && (
          <div className="text-red-600">
            <span className="font-medium">Error Message:</span>{" "}
            {data.errorMessage}
          </div>
        )}
        {data.functionError && (
          <div className="text-red-600">
            <span className="font-medium">Function Error:</span>{" "}
            {data.functionError}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-1">Response Payload</h3>
        <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(parsedPayload, null, 2)}
        </pre>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-1">Log Output</h3>
        <pre className="bg-gray-900 text-green-200 p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap max-h-64">
          {data.logOutput}
        </pre>
      </div>
    </div>
  );
}
