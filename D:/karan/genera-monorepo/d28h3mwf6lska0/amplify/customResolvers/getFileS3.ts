import { a } from "@aws-amplify/backend";

import { getS3Function } from "../functions/get-s3/resource";

export const GetFileS3 = a
  .query()
  .arguments({
    key: a.string().required(),
  })
  .returns(
    a.customType({
      url: a.string().required(),
      key: a.string().required(),
    })
  )
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(getS3Function));
