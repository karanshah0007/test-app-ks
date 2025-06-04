import { defineBackend } from "@aws-amplify/backend";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const REGION = "us-east-1";
const customBucketArn = "arn:aws:s3:::brand-workload-content-dx0n-eocw-s3-dev";

export const backend = defineBackend({
  auth,
  data,
});

const customBucketStack = backend.createStack("custom-bucket-stack");

const customBucket = Bucket.fromBucketAttributes(customBucketStack, "MyCustomBucket", {
  bucketArn: customBucketArn,
  region: REGION,
});

backend.addOutput({
  storage: {
    aws_region: REGION,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: REGION,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        paths: {
          "public/*": {
            guest: ["get", "list"],
          },
        },
      },
    ],
  },
});

const unauthPolicy = new Policy(backend.stack, "customBucketUnauthPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [`${customBucket.bucketArn}/public/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [`${customBucket.bucketArn}`],
      conditions: {
        StringLike: {
          "s3:prefix": ["public/", "public/*"],
        },
      },
    }),
  ],
});

if (backend.auth?.resources?.unauthenticatedUserIamRole) {
  backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(unauthPolicy);
}
