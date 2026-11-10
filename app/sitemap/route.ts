import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campusly.com';
  const urls = [
    '/',
    '/privacy',
    '/terms',
    '/cookies',
    '/disclaimer',
    // add additional static routes here
  ];

  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`)
    .join('\n')}
</urlset>`;

  return new NextResponse(xmlBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // optional: cache header
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
