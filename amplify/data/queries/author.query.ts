import { a, defineFunction } from "@aws-amplify/backend";

export const AuthorCustomMethodCustomQueryFunction = defineFunction({
    name: "AuthorCustomMethodCustomQuery",
    entry: "../../functions/execute-flow/handler.ts",
    timeoutSeconds: 900,
    environment : {
      STATE_MACHINE_ARN : "",
      TYPE: '',
      API_END_POINT: '/api/content/v1/clients/{clientId}/brands/{brandId}/files',
      PAYLOAD: JSON.stringify({"clientId":"dx0n","brandId":"eocw","fields":"","nextToken":"","limit":"1000","filter":""}),
    }
  });

export const AuthorCustomMethodCustomQuery = a
  .query()
  .returns(
    a.customType({
      executedVersion: a.string(),
      statusCode: a.integer().required(),
      logOutput: a.string().required(),
      duration: a.string().required(),
      billedDuration: a.string().required(),
      memorySize: a.string().required(),
      maxMemoryUsed: a.string().required(),
      requestId: a.string().required(),
      responsePayload: a.json(),
      errorMessage: a.string(),
      errorType: a.string(),
      functionError: a.string(),
    })
  )
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(AuthorCustomMethodCustomQueryFunction));

