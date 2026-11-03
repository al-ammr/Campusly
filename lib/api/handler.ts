import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as crypto from 'crypto';
import {
  createErrorResponse,
  createSuccessResponse,
  ERROR_CATALOGUE,
  ApiFieldError,
} from './envelope';
import { getSecurityHeaders, validateCsrf, getIdempotentResponse, saveIdempotentResponse } from './security';
import { getOrCreateDeviceContext, DeviceContext } from './device';
import { checkRateLimit } from './rate-limit';

export interface HandlerContext<TBody = any, TQuery = any> {
  req: NextRequest;
  body: TBody;
  query: TQuery;
  requestId: string;
  device: DeviceContext;
  params?: Record<string, string>;
}

export interface RouteHandlerOptions<TBodySchema extends z.ZodTypeAny, TQuerySchema extends z.ZodTypeAny> {
  bodySchema?: TBodySchema;
  querySchema?: TQuerySchema;
  maxBodyBytes?: number; // default 1MB (1048576)
  rateLimit?: {
    keyPrefix: string;
    limit: number;
    windowSeconds: number;
  };
  requireCsrf?: boolean;
}

/**
 * Single robust API route wrapper adhering to D06, D08, and BP-05 requirements.
 */
export function createApiHandler<
  TBodySchema extends z.ZodTypeAny = z.ZodTypeAny,
  TQuerySchema extends z.ZodTypeAny = z.ZodTypeAny
>(
  options: RouteHandlerOptions<TBodySchema, TQuerySchema>,
  handler: (context: HandlerContext<z.infer<TBodySchema>, z.infer<TQuerySchema>>) => Promise<NextResponse | any>
) {
  return async function apiHandler(
    req: NextRequest,
    routeContext?: { params?: Record<string, string> | Promise<Record<string, string>> }
  ): Promise<NextResponse> {
    const start = Date.now();
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
    const responseHeaders = new Headers(getSecurityHeaders({ isReportOnlyCsp: true }));
    responseHeaders.set('X-Request-Id', requestId);

    // 1. Device identity & context
    const { context: deviceContext, cookieToSet } = await getOrCreateDeviceContext(req, responseHeaders);

    const method = req.method.toUpperCase();
    const isWrite = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    // 2. Anti-forgery (CSRF) validation on state-changing browser writes
    if (isWrite && (options.requireCsrf !== false)) {
      if (!validateCsrf(req)) {
        return createErrorResponse(ERROR_CATALOGUE.CSRF_FAILED, requestId, {
          headers: Object.fromEntries(responseHeaders),
        });
      }
    }

    // 3. Idempotency-Key Handling (24-hour memory)
    const idempotencyKey = req.headers.get('idempotency-key');
    let fullIdempotencyKey: string | null = null;
    if (isWrite && idempotencyKey) {
      fullIdempotencyKey = `idempotency:${deviceContext.tokenHash}:${idempotencyKey}`;
      const cached = getIdempotentResponse(fullIdempotencyKey);
      if (cached) {
        const replayHeaders = new Headers({
          ...cached.headers,
          'X-Request-Id': requestId,
          'X-Idempotency-Replay': 'true',
        });
        return NextResponse.json(cached.body, { status: cached.status, headers: replayHeaders });
      }
    }

    // 4. Rate Limiting
    if (options.rateLimit) {
      const rateLimitKey = `${options.rateLimit.keyPrefix}:${deviceContext.tokenHash}`;
      const rateResult = await checkRateLimit(
        rateLimitKey,
        options.rateLimit.limit,
        options.rateLimit.windowSeconds,
        isWrite
      );

      responseHeaders.set('RateLimit-Remaining', String(rateResult.remaining));

      if (!rateResult.allowed) {
        return createErrorResponse(ERROR_CATALOGUE.RATE_LIMITED, requestId, {
          retryAfter: rateResult.retryAfterSeconds,
          headers: Object.fromEntries(responseHeaders),
        });
      }
    }

    // 5. Query Parameter Validation
    let parsedQuery: any = {};
    if (options.querySchema) {
      const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
      const queryParsed = options.querySchema.safeParse(searchParams);
      if (!queryParsed.success) {
        const fields: ApiFieldError[] = queryParsed.error.issues.map((err) => ({
          field: err.path.join('.'),
          code: err.code,
          message: err.message,
        }));
        return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId, {
          fields,
          headers: Object.fromEntries(responseHeaders),
        });
      }
      parsedQuery = queryParsed.data;
    }

    // 6. Request Body Parsing & Size Limit Enforcement
    let parsedBody: any = {};
    if (isWrite && options.bodySchema) {
      const maxBytes = options.maxBodyBytes || 1048576; // 1 MB
      const contentLength = parseInt(req.headers.get('content-length') || '0', 10);

      if (contentLength > maxBytes) {
        return createErrorResponse(ERROR_CATALOGUE.FILE_TOO_LARGE, requestId, {
          headers: Object.fromEntries(responseHeaders),
        });
      }

      try {
        const rawJson = await req.json();

        // Standing Rule: Reject unknown fields on writes with .strict()
        const strictSchema = (options.bodySchema as any).strict ? (options.bodySchema as any).strict() : options.bodySchema;
        const bodyParsed = strictSchema.safeParse(rawJson);

        if (!bodyParsed.success) {
          const fields: ApiFieldError[] = bodyParsed.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            code: err.code,
            message: err.message,
          }));
          return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId, {
            fields,
            headers: Object.fromEntries(responseHeaders),
          });
        }
        parsedBody = bodyParsed.data;
      } catch (err) {
        return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId, {
          fields: [{ field: 'body', code: 'invalid_json', message: 'Malformed JSON payload.' }],
          headers: Object.fromEntries(responseHeaders),
        });
      }
    }

    // 7. Handler Execution
    try {
      const resolvedParams = routeContext?.params
        ? await Promise.resolve(routeContext.params)
        : undefined;

      const result = await handler({
        req,
        body: parsedBody,
        query: parsedQuery,
        requestId,
        device: deviceContext,
        params: resolvedParams,
      });

      let finalResponse: NextResponse;

      if (result instanceof NextResponse) {
        finalResponse = result;
        // Ensure request ID and security headers are attached
        finalResponse.headers.set('X-Request-Id', requestId);
        for (const [k, v] of Object.entries(getSecurityHeaders({ isReportOnlyCsp: true }))) {
          if (!finalResponse.headers.has(k)) {
            finalResponse.headers.set(k, v);
          }
        }
      } else {
        finalResponse = createSuccessResponse(result, requestId, {
          headers: Object.fromEntries(responseHeaders),
        });
      }

      if (cookieToSet) {
        finalResponse.headers.append('Set-Cookie', cookieToSet);
      }

      // Save Idempotency entry if requested
      if (fullIdempotencyKey && finalResponse.status < 400) {
        try {
          const clonedBody = await finalResponse.clone().json();
          saveIdempotentResponse(
            fullIdempotencyKey,
            finalResponse.status,
            clonedBody,
            Object.fromEntries(finalResponse.headers.entries())
          );
        } catch {
          // Non-JSON response, omit idempotency caching
        }
      }

      return finalResponse;
    } catch (error) {
      console.error(`[API Internal Error] [Req: ${requestId}] [${method} ${req.nextUrl.pathname}]:`, error);
      // Standing Rule: Never leak stack traces to client (SEC-308)
      return createErrorResponse(ERROR_CATALOGUE.INTERNAL_ERROR, requestId, {
        headers: Object.fromEntries(responseHeaders),
      });
    }
  };
}
