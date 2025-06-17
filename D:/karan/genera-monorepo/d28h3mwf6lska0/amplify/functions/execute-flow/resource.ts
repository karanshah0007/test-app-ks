import { defineFunction } from "@aws-amplify/backend";

export const executeFlowFunction = defineFunction({
  name: "executeFlowFunction",
  entry: "./handler.ts",
  timeoutSeconds: 900,
});
