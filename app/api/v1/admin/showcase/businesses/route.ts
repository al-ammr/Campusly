import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';
import { getShowcaseBundle, saveTopBusinesses } from '@/lib/showcase/service';
import { TopBusinessItem } from '@/lib/showcase/types';

export async function POST(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin || !admin.active) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const business: TopBusinessItem = await request.json();
    if (!business.name || !business.category) {
      return NextResponse.json(
        { error: 'name_and_category_required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const bundle = await getShowcaseBundle();
    const existing = [...bundle.topBusinesses];

    // If ID exists, replace; otherwise append
    const idx = existing.findIndex((b) => b.id === business.id);
    if (idx >= 0) {
      existing[idx] = business;
    } else {
      existing.push({
        ...business,
        id: business.id || `biz-${Date.now()}`,
      });
    }

    // Sort by score or rank, capped at Top 10
    const updatedList = await saveTopBusinesses(
      existing.slice(0, 10),
      admin.id,
      `Admin ${admin.email} modified business ${business.name}`
    );

    return NextResponse.json(
      { ok: true, data: updatedList },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('[Admin Showcase Business POST Error]:', error);
    return NextResponse.json(
      { error: 'failed_to_save_business' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminFromRequest(request);
  if (!admin || !admin.active) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'id_required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const bundle = await getShowcaseBundle();
    const filtered = bundle.topBusinesses.filter((b) => b.id !== id);
    const updatedList = await saveTopBusinesses(
      filtered,
      admin.id,
      `Admin ${admin.email} removed business ${id}`
    );

    return NextResponse.json(
      { ok: true, data: updatedList },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('[Admin Showcase Business DELETE Error]:', error);
    return NextResponse.json(
      { error: 'failed_to_delete_business' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
