import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event: any) => {
  const bucketName = "brand-workload-content-dx0n-eocw-s3-dev";
  const prefix = event.arguments.prefix || "";

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const response = await s3.send(listCommand);
    const files = [];

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) {
          const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: item.Key,
          });

          const url = await getSignedUrl(s3, getCommand, { expiresIn: 300 });

          files.push({
            key: item.Key,
            url: url,
            lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
            size: item.Size || 0,
          });
        }
      }
    }

    return {
      files,
    };
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}; 