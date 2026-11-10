import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';
import {
  getShowcaseBundle,
  saveCategories,
  saveIntro,
  saveGallery,
  saveCta,
  saveTopBusinesses,
} from '@/lib/showcase/service';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['reviewer', 'finance', 'lead']);
  if (!authorized) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const bundle = await getShowcaseBundle();
    return NextResponse.json(
      { ok: true, data: bundle },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('[Admin Showcase GET Error]:', error);
    return NextResponse.json(
      { error: 'server_error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin || !admin.active) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const body = await request.json();
    const { categories, intro, gallery, cta, topBusinesses, note } = body;
    const adminNote = note || `Admin ${admin.email} updated showcase content`;

    if (categories && Array.isArray(categories)) {
      await saveCategories(categories, admin.id, adminNote);
    }
    if (intro && typeof intro === 'object') {
      await saveIntro(intro, admin.id, adminNote);
    }
    if (gallery && Array.isArray(gallery)) {
      await saveGallery(gallery, admin.id, adminNote);
    }
    if (cta && typeof cta === 'object') {
      await saveCta(cta, admin.id, adminNote);
    }
    if (topBusinesses && Array.isArray(topBusinesses)) {
      await saveTopBusinesses(topBusinesses, admin.id, adminNote);
    }

    const updated = await getShowcaseBundle();
    return NextResponse.json(
      { ok: true, data: updated, message: 'Showcase updated successfully' },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('[Admin Showcase PUT Error]:', error);
    return NextResponse.json(
      { error: 'update_failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
