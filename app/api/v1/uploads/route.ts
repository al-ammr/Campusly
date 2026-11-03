import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { validateFileSafety, storeAttachment } from '@/lib/storage/upload';
import { getOrCreateDeviceContext } from '@/lib/api/device';
import { getSecurityHeaders } from '@/lib/api/security';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const responseHeaders = new Headers(getSecurityHeaders({ isReportOnlyCsp: true }));
  responseHeaders.set('X-Request-Id', requestId);

  const { context: device } = await getOrCreateDeviceContext(req, responseHeaders);

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const purposeRaw = (formData.get('purpose') as string) || 'image';
    const altText = (formData.get('alt_text') as string) || undefined;

    if (!file || !(file instanceof File)) {
      return createErrorResponse(
        ERROR_CATALOGUE.VALIDATION_FAILED,
        requestId,
        {
          fields: [{ field: 'file', code: 'missing', message: 'No file provided.' }],
          headers: Object.fromEntries(responseHeaders),
        }
      );
    }

    const purpose = ['image', 'proof', 'receipt'].includes(purposeRaw)
      ? (purposeRaw as 'image' | 'proof' | 'receipt')
      : 'image';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate Safety & Format
    const validation = validateFileSafety(buffer, file.type, purpose);
    if (!validation.valid || !validation.detectedMime) {
      const errSpec =
        validation.code === 'file_too_large'
          ? ERROR_CATALOGUE.FILE_TOO_LARGE
          : validation.code === 'file_type_not_allowed'
          ? ERROR_CATALOGUE.FILE_TYPE_NOT_ALLOWED
          : ERROR_CATALOGUE.FILE_REJECTED;

      return createErrorResponse(
        { ...errSpec, message: validation.message || errSpec.message },
        requestId,
        { headers: Object.fromEntries(responseHeaders) }
      );
    }

    // Store File
    const result = await storeAttachment({
      buffer,
      mime: validation.detectedMime,
      purpose,
      deviceId: device.tokenHash,
      altText,
    });

    return createSuccessResponse(result, requestId, {
      status: 201,
      headers: Object.fromEntries(responseHeaders),
    });
  } catch (error) {
    return createErrorResponse(ERROR_CATALOGUE.FILE_REJECTED, requestId, {
      headers: Object.fromEntries(responseHeaders),
    });
  }
}
