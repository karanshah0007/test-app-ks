import { a } from "@aws-amplify/backend";

import { uploadS3Function } from "../functions/upload-s3/resource";

export const UploadFileS3 = a
  .mutation()
  .arguments({
    key: a.string().required(),
    contentType: a.string().required(),
  })
  .returns(
    a.customType({
      url: a.string().required(),
      key: a.string().required(),
    })
  )
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(uploadS3Function));
