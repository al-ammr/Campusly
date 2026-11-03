import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';

// Body schema for write demonstration
const testBodySchema = z.object({
  message: z.string().min(3).max(100),
  counter: z.number().int().min(1),
});

// Query schema for read demonstration
const testQuerySchema = z.object({
  filter: z.string().optional(),
});

export const GET = createApiHandler(
  {
    querySchema: testQuerySchema,
  },
  async ({ query, requestId, device }) => {
    return {
      status: 'ok',
      framework: 'Campusly API Framework v1',
      request_id: requestId,
      device_token_hash: device.tokenHash,
      is_new_device: device.isNewDevice,
      network_key: device.networkKey,
      query,
    };
  }
);

export const POST = createApiHandler(
  {
    bodySchema: testBodySchema,
    rateLimit: {
      keyPrefix: 'test_framework_submit',
      limit: 5,
      windowSeconds: 60,
    },
    requireCsrf: true,
  },
  async ({ body, requestId, device }) => {
    return {
      status: 'created',
      received: body,
      device_token_hash: device.tokenHash,
      request_id: requestId,
    };
  }
);
