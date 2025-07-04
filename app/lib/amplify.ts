import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        "https://iownhnlci5bufh2eayqfbcv4f4.appsync-api.us-east-1.amazonaws.com/graphql",
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey:
        process.env.NEXT_PUBLIC_API_KEY ?? "da2-xxv5l24kdjgz5lqge7ljaeohym",
    },
  },
  Storage: {
    S3: {
      bucket: "brand-workload-content-dx0n-eocw-s3-dev", // your custom bucket name
      region: "us-east-1",
      buckets: {
        "brand-workload-content-dx0n-eocw-s3-dev": {
          bucketName: "brand-workload-content-dx0n-eocw-s3-dev",
          region: "us-east-1",
        },
      },
    },
  },
});
