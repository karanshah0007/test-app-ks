import { defineFunction } from "@aws-amplify/backend";

export const deleteFunction = defineFunction({
  name: "deleteFunction",
  entry: "./handler.ts",
  environment: {
    TABLE_NAME: "Article-5p3j4x7cxbejlib64lfezxryiu-NONE",
  },
});
