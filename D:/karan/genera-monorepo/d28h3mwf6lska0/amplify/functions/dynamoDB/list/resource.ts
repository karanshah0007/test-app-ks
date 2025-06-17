import { defineFunction } from "@aws-amplify/backend";

export const listFunction = defineFunction({
  name: "listFunction",
  entry: "./handler.ts",
  environment: {
    TABLE_NAME: "Article-5p3j4x7cxbejlib64lfezxryiu-NONE",
  },
});
