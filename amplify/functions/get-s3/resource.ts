import { defineFunction } from "@aws-amplify/backend";

export const getS3Function = defineFunction({
  name: "getS3Function",
  entry: "./handler.ts",
});
