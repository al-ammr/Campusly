import { NextResponse } from 'next/server';

export interface ApiFieldError {
  field: string;
  code: string;
  message: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  fields?: ApiFieldError[];
  retry_after?: number;
  request_id: string;
}

export interface ApiResponseEnvelope<T = any> {
  data?: T;
  meta?: Record<string, any>;
  error?: ApiErrorPayload;
}

/**
 * Standard Error Catalogue from D06 Section 9
 */
export const ERROR_CATALOGUE = {
  // 400 Bad Request
  VALIDATION_FAILED: { status: 400, code: 'validation_failed', message: 'The submitted information is incomplete or invalid.' },
  FILE_REJECTED: { status: 400, code: 'file_rejected', message: 'The uploaded file failed safety or format checks.' },

  // 401 Unauthorized
  UNAUTHENTICATED: { status: 401, code: 'unauthenticated', message: 'You must be signed in to perform this action.' },
  JOB_UNAUTHORISED: { status: 401, code: 'job_unauthorised', message: 'Invalid or missing job authorization secret.' },

  // 403 Forbidden
  FORBIDDEN_ROLE: { status: 403, code: 'forbidden_role', message: 'Your account role does not have permission for this action.' },
  CSRF_FAILED: { status: 403, code: 'csrf_failed', message: 'Security check failed. Please refresh the page and try again.' },
  FORGERY_DETECTED: { status: 403, code: 'forgery_detected', message: 'Security check failed. Please refresh the page and try again.' },

  // 404 Not Found
  NOT_AVAILABLE: { status: 404, code: 'not_available', message: 'This listing is no longer available or does not exist.' },
  NOT_FOUND: { status: 404, code: 'not_found', message: 'The requested record could not be found.' },

  // 409 Conflict
  WRONG_STATE: { status: 409, code: 'wrong_state', message: 'This action cannot be performed in the current status.' },
  PAYMENT_NOT_CONFIRMED: { status: 409, code: 'payment_not_confirmed', message: 'Payment must be confirmed in bank before activation.' },
  ACTIVE_CAP_REACHED: { status: 409, code: 'active_cap_reached', message: 'You have reached the maximum active listings allowed at one time.' },
  SLOT_UNAVAILABLE: { status: 409, code: 'slot_unavailable', message: 'No featured slot is currently free. You may join the waitlist.' },

  // 410 Gone
  WINDOW_CLOSED: { status: 410, code: 'window_closed', message: 'The time window to perform this action has closed.' },

  // 413 Payload Too Large
  FILE_TOO_LARGE: { status: 413, code: 'file_too_large', message: 'The uploaded file exceeds the allowed file size limit.' },

  // 415 Unsupported Media Type
  FILE_TYPE_NOT_ALLOWED: { status: 415, code: 'file_type_not_allowed', message: 'Only JPG, PNG, WebP or PDF files are accepted.' },

  // 422 Unprocessable Entity
  NOT_ALLOWED_CATEGORY: { status: 422, code: 'not_allowed_category', message: 'This submission belongs to a prohibited category.' },
  BLOCKED_REPEAT: { status: 422, code: 'blocked_repeat', message: 'Submissions from this device or contact are temporarily suspended.' },

  // 429 Too Many Requests
  RATE_LIMITED: { status: 429, code: 'rate_limited', message: 'Too many requests. Please wait a moment before trying again.' },
  DEVICE_TOO_NEW: { status: 429, code: 'device_too_new', message: 'Please browse the campus directory for a moment before starring.' },

  // 500 Internal Server Error
  INTERNAL_ERROR: { status: 500, code: 'internal_error', message: 'An unexpected server error occurred. Please try again.' },

  // 503 Service Unavailable
  MAINTENANCE: { status: 503, code: 'maintenance', message: 'Campusly is undergoing brief scheduled maintenance. Please return shortly.' },
} as const;

export type ErrorCatalogueKey = keyof typeof ERROR_CATALOGUE;

/**
 * Creates a standard JSON error response matching D06 Section 2 and 9.
 */
export function createErrorResponse(
  spec: {
    status: number;
    code: string;
    message: string;
  },
  requestId: string,
  options?: {
    fields?: ApiFieldError[];
    retryAfter?: number;
    headers?: Record<string, string>;
  }
): NextResponse<ApiResponseEnvelope<never>> {
  const payload: ApiErrorPayload = {
    code: spec.code,
    message: spec.message,
    request_id: requestId,
  };

  if (options?.fields && options.fields.length > 0) {
    payload.fields = options.fields;
  }

  if (options?.retryAfter !== undefined) {
    payload.retry_after = options.retryAfter;
  }

  const responseHeaders = new Headers(options?.headers);
  responseHeaders.set('X-Request-Id', requestId);
  responseHeaders.set('Cache-Control', 'no-store');

  if (options?.retryAfter !== undefined) {
    responseHeaders.set('Retry-After', String(options.retryAfter));
  }

  return NextResponse.json(
    { error: payload },
    { status: spec.status, headers: responseHeaders }
  );
}

/**
 * Creates a standard JSON success response matching D06 Section 2.
 */
export function createSuccessResponse<T>(
  data: T,
  requestId: string,
  options?: {
    meta?: Record<string, any>;
    status?: number;
    headers?: Record<string, string>;
    cacheControl?: string;
    etag?: string;
  }
): NextResponse<ApiResponseEnvelope<T>> {
  const body: ApiResponseEnvelope<T> = { data };
  if (options?.meta) {
    body.meta = options.meta;
  }

  const responseHeaders = new Headers(options?.headers);
  responseHeaders.set('X-Request-Id', requestId);

  if (options?.cacheControl) {
    responseHeaders.set('Cache-Control', options.cacheControl);
  } else {
    responseHeaders.set('Cache-Control', 'no-store');
  }

  if (options?.etag) {
    responseHeaders.set('ETag', options.etag);
  }

  return NextResponse.json(body, {
    status: options?.status || 200,
    headers: responseHeaders,
  });
}
