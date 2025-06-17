import { defineFunction } from "@aws-amplify/backend";

export const listS3Function = defineFunction({
  name: "listS3Function",
  entry: "./handler.ts",
}); 