import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event: any) => {
  const bucketName = "brand-workload-content-dx0n-eocw-s3-dev";
  const key = event.arguments.key;

  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(input);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return {
    url: signedUrl,
    key,
  };
};
