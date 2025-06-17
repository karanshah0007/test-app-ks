import { a, defineFunction } from "@aws-amplify/backend";

export const Test1CustomMutationFunction = defineFunction({
    name: "Test1CustomMutation",
    entry: "../../functions/execute-flow/handler.ts",
    timeoutSeconds: 900,
    environment : {
      STATE_MACHINE_ARN : "",
      TYPE: '',
      API_END_POINT: '/api/admin/v1/clients',
      PAYLOAD: JSON.stringify({"fields":"id","nextToken":"","limit":"10","filter":""}),
    }
  });

export const Test1CustomMutation = a
  .mutation()
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
  .handler(a.handler.function(Test1CustomMutationFunction));

export const Test2MethodCustomMutationFunction = defineFunction({
    name: "Test2MethodCustomMutation",
    entry: "../../functions/execute-flow/handler.ts",
    timeoutSeconds: 900,
    environment : {
      STATE_MACHINE_ARN : "arn:aws:states:us-east-1:992382535498:stateMachine:dev_d3nh2xvu5kckmx_todos_flow_cb67",
      TYPE: 'EXPRESS',
      API_END_POINT: '',
      PAYLOAD: JSON.stringify({"limit":"5"}),
    }
  });

export const Test2MethodCustomMutation = a
  .mutation()
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
  .handler(a.handler.function(Test2MethodCustomMutationFunction));

export const AuthorTestMethodCustomMutationFunction = defineFunction({
    name: "AuthorTestMethodCustomMutation",
    entry: "../../functions/execute-flow/handler.ts",
    timeoutSeconds: 900,
    environment : {
      STATE_MACHINE_ARN : "",
      TYPE: '',
      API_END_POINT: '/api/content/v1/clients/{clientId}/brands/{brandId}/tags',
      PAYLOAD: JSON.stringify({"clientId":"dx0n","brandId":"eocw","fields":"","nextToken":"","limit":"5","filter":""}),
    }
  });

export const AuthorTestMethodCustomMutation = a
  .mutation()
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
  .handler(a.handler.function(AuthorTestMethodCustomMutationFunction));

