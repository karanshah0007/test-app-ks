"use client";
import { useState } from "react";
import Link from "next/link";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";
import { GraphQLResult } from "@aws-amplify/api";
import { Amplify } from "aws-amplify";
import LambdaResponseViewer from "@/app/components/LambdaResponseViewer";

const devFlowOptions = [
  {
    label: "Todos Flow",
    value:
      "arn:aws:states:us-east-1:992382535498:stateMachine:dev_d3nh2xvu5kckmx_todos_flow_cb67",
  },
  {
    label: "User Sync Flow",
    value:
      "arn:aws:states:us-east-1:992382535498:express:dev_d3nh2xvu5kckmx_user_sync_flow_ab12",
  },
  {
    label: "Email Notifier Flow",
    value:
      "arn:aws:states:us-east-1:992382535498:express:dev_d3nh2xvu5kckmx_email_notifier_flow_cd34",
  },
  {
    label: "Data Cleanup Flow",
    value:
      "arn:aws:states:us-east-1:992382535498:express:dev_d3nh2xvu5kckmx_data_cleanup_flow_ef56",
  },
];

interface ExecuteFlowResponse {
  ExecuteFlow: {
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
  };
}

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "https://x7xgwafhwjeqbbk4qqt7jzkst4.appsync-api.us-east-1.amazonaws.com/graphql",
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "da2-ovt6quse7nebbablwauxj3fc6y",
    },
  },
});

const client = generateClient<Schema>();

export default function Flows() {
  const [arn, setArn] = useState("");
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ arn?: string; payload?: string }>({});
  const [lambdaResponse, setLambdaResponse] = useState<
    ExecuteFlowResponse["ExecuteFlow"] | null
  >(null);

  const validateAndSubmit = async () => {
    const newErrors: { arn?: string; payload?: string } = {};

    if (!arn.trim()) {
      newErrors.arn = "State Machine ARN is required.";
    }

    try {
      if (payload.trim()) {
        JSON.parse(payload);
      } else {
        newErrors.payload = "Payload is required.";
      }
    } catch {
      newErrors.payload = "Payload must be valid JSON.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const result = (await client.graphql({
        query: `
          mutation ExecuteFlow($stateMachineArn: String!, $payload: AWSJSON!) {
            ExecuteFlow(stateMachineArn: $stateMachineArn, payload: $payload) {
              executedVersion
              statusCode
              logOutput
              duration
              billedDuration
              memorySize
              maxMemoryUsed
              requestId
              responsePayload
              errorMessage
              errorType
              functionError
            }
          }
        `,
        variables: {
          stateMachineArn: arn,
          payload: payload,
        },
      })) as GraphQLResult<ExecuteFlowResponse>;

      if (result.data?.ExecuteFlow) {
        setLambdaResponse(result.data.ExecuteFlow);
      }
    } catch (err) {
      console.error("Error triggering workflow:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Flows</h1>
              <p className="text-gray-600 mt-1">
                Manage your workflow processes
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Trigger a Workflow
            </h2>

            <div className="mb-6">
              <label
                htmlFor="arn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dev Flow
              </label>
              <select
                id="arn"
                value={arn}
                onChange={(e) => setArn(e.target.value)}
                className={`w-full border rounded-md p-3 text-sm shadow-sm focus:ring-2 focus:outline-none ${
                  errors.arn
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
              >
                <option value="">Select a Dev Flow</option>
                {devFlowOptions.map((flow) => (
                  <option key={flow.value} value={flow.value}>
                    {flow.label}
                  </option>
                ))}
              </select>
              {errors.arn && (
                <p className="mt-1 text-sm text-red-600">{errors.arn}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="payload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payload (JSON)
              </label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={6}
                placeholder='{ "key": "value" }'
                className={`w-full border rounded-md p-3 text-sm shadow-sm focus:ring-2 focus:outline-none font-mono ${
                  errors.payload
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
              />
              {errors.payload && (
                <p className="mt-1 text-sm text-red-600">{errors.payload}</p>
              )}
            </div>

            <button
              type="button"
              onClick={validateAndSubmit}
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-full bg-green-600 text-white shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] px-6 pb-2 pt-2.5 text-sm font-medium transition duration-150 ease-in-out
    ${
      loading
        ? "opacity-70 cursor-not-allowed"
        : "hover:bg-green-700 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)]"
    }
  `}
            >
              {loading ? (
                <>
                  <div
                    role="status"
                    className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                  Loading
                </>
              ) : (
                "Trigger Workflow"
              )}
            </button>
            {lambdaResponse && (
              <div className="mt-8">
                <LambdaResponseViewer data={lambdaResponse} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
