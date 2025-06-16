import { a } from "@aws-amplify/backend";
import { listS3Function } from "../functions/list-s3/resource";

export const ListFilesS3 = a
  .query()
  .arguments({
    prefix: a.string(),
  })
  .returns(
    a.customType({
      files: a.json().required(),
    })
  )
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(listS3Function)); 