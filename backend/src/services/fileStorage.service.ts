import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.warn('[fileStorage] R2 environment variables are not fully configured.');
}

const endpoint = accountId
  ? `https://${accountId}.r2.cloudflarestorage.com`
  : undefined;

export const fileStorageClient = new S3Client({
  region: 'auto',
  endpoint,
  credentials: accessKeyId && secretAccessKey ? {
    accessKeyId,
    secretAccessKey,
  } : undefined,
});

type UploadParams = {
  key: string;
  body: Buffer | Uint8Array | Blob | string;
  contentType?: string;
  cacheControl?: string;
};

export async function uploadFile(params: UploadParams) {
  if (!bucketName) {
    throw new Error('R2 bucket not configured');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
    CacheControl: params.cacheControl,
  });

  await fileStorageClient.send(command);
}

export async function deleteFile(key: string) {
  if (!bucketName) {
    throw new Error('R2 bucket not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await fileStorageClient.send(command);
}

export async function getFileDownloadUrl(key: string, expiresInSeconds = 300) {
  if (!bucketName) {
    throw new Error('R2 bucket not configured');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(fileStorageClient, command, { expiresIn: expiresInSeconds });
}

export const storageConfig = {
  bucketName,
  endpoint,
};


