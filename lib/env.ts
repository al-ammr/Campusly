import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_DIRECT_URL: z.string().optional(),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  REDIS_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  JOB_SECRET: z.string().min(16, 'JOB_SECRET must be at least 16 characters'),
  DATA_ENCRYPTION_KEY: z.string().min(32, 'DATA_ENCRYPTION_KEY must be at least 32 characters'),
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_REGION: z.string().default('auto'),
  STORAGE_ACCESS_KEY_ID: z.string().min(1, 'STORAGE_ACCESS_KEY_ID is required'),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1, 'STORAGE_SECRET_ACCESS_KEY is required'),
  STORAGE_BUCKET_NAME: z.string().min(1, 'STORAGE_BUCKET_NAME is required'),
  EMAIL_PROVIDER: z.enum(['mock', 'resend', 'smtp']).default('mock'),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('notifications@campusly.abu.edu.ng'),
  ADMIN_ALERT_EMAIL: z.string().email().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').default('http://localhost:3000'),
  NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG: z.string().default('abu-zaria'),
  NEXT_PUBLIC_BUILD_ID: z.string().default('dev'),
});

const isServer = typeof window === 'undefined';

function validateEnv() {
  const clientParsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG: process.env.NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG,
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,
  });

  if (!clientParsed.success) {
    const errorDetails = JSON.stringify(clientParsed.error.format(), null, 2);
    throw new Error(`[Env Validation Failed: Client] Invalid client environment variables:\n${errorDetails}`);
  }

  if (isServer) {
    const serverParsed = serverSchema.safeParse(process.env);
    if (!serverParsed.success) {
      const errorDetails = JSON.stringify(serverParsed.error.format(), null, 2);
      throw new Error(`[Env Validation Failed: Server] Invalid server environment variables:\n${errorDetails}`);
    }
    return {
      ...clientParsed.data,
      ...serverParsed.data,
    };
  }

  return {
    ...clientParsed.data,
  } as z.infer<typeof clientSchema> & Partial<z.infer<typeof serverSchema>>;
}

export const env = validateEnv();
