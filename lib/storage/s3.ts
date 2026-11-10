import * as crypto from 'crypto';

interface S3Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

function getS3Config(): S3Config | null {
  const endpoint = process.env.STORAGE_ENDPOINT;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
  const bucket = process.env.STORAGE_BUCKET_NAME;
  const region = process.env.STORAGE_REGION || 'auto';

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return {
    endpoint: endpoint.replace(/\/+$/, ''),
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
  };
}

export function isS3Configured(): boolean {
  return getS3Config() !== null;
}

export function getPublicStorageUrl(storageKey: string): string {
  const cfg = getS3Config();
  if (!cfg) {
    return `/uploads/${storageKey}`;
  }

  // Supabase storage format
  if (cfg.endpoint.includes('/storage/v1/s3')) {
    const baseOrigin = cfg.endpoint.replace(/\/storage\/v1\/s3$/, '');
    return `${baseOrigin}/storage/v1/object/public/${cfg.bucket}/${storageKey}`;
  }

  // Standard S3 / R2 format
  return `${cfg.endpoint}/${cfg.bucket}/${storageKey}`;
}

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function sha256Hex(data: Buffer | string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  return hmac(kService, 'aws4_request');
}

export async function uploadToStorage(params: {
  key: string;
  buffer: Buffer;
  mime: string;
}): Promise<{ key: string; publicUrl: string; etag?: string }> {
  const cfg = getS3Config();
  if (!cfg) {
    throw new Error('S3 storage is not configured.');
  }

  const url = new URL(cfg.endpoint);
  const host = url.host;
  const basePath = url.pathname.replace(/\/$/, '');
  const objectPath = `${basePath}/${cfg.bucket}/${params.key}`;
  const fullUrl = `${url.protocol}//${host}${objectPath}`;

  const contentSha256 = sha256Hex(params.buffer);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${contentSha256}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = `PUT\n${objectPath}\n\n${canonicalHeaders}\n${signedHeaders}\n${contentSha256}`;

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${cfg.region}/s3/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256Hex(canonicalRequest)}`;

  const signingKey = getSignatureKey(cfg.secretAccessKey, dateStamp, cfg.region, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authHeader = `${algorithm} Credential=${cfg.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      Host: host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': contentSha256,
      Authorization: authHeader,
      'Content-Type': params.mime,
      'Content-Length': params.buffer.length.toString(),
    },
    body: new Uint8Array(params.buffer),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 upload failed with status ${response.status}: ${errorText}`);
  }

  const etag = response.headers.get('etag') || undefined;
  const publicUrl = getPublicStorageUrl(params.key);

  return {
    key: params.key,
    publicUrl,
    etag,
  };
}
