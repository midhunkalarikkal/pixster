import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

let s3Client;
if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
} else {
    throw new Error("AWS configuration is missing required parameters.");
}

export { s3Client };

export async function generateSignedUrl(key, expires = 172800) {
  const urlParts = key?.split('/');
  const s3Key = urlParts.slice(3).join('/');
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key
  })

  return getSignedUrl(s3Client, command, { expiresIn: expires });
}
