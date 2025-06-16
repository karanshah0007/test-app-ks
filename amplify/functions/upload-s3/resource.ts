import { defineFunction } from "@aws-amplify/backend";

export const uploadS3Function = defineFunction({
  name: "uploadS3Function",
  entry: "./handler.ts",
  environment: {
    BRAND_ID: "eocw",
    CLIENT_ID: "dx0n",
    IS_PUBLIC: "false",
    PARENT_FOLDER_ID: "oyyv"
  }
});
