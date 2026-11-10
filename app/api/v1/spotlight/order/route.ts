// app/api/v1/spotlight/order/route.ts
import { NextResponse } from 'next/server';
import { withTransaction, query } from '@/lib/db';
import { getSetting } from '@/lib/settings';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400, headers: getSecurityHeaders() });
  }

  const {
    planId,
    business_name,
    offer,
    description,
    contact,
    category_id,
    agree_terms,
  } = body;

  if (!planId || (planId !== 'standard' && planId !== 'featured')) {
    return NextResponse.json({ error: 'invalid_plan', message: 'Plan must be standard or featured' }, { status: 400, headers: getSecurityHeaders() });
  }

  if (!agree_terms) {
    return NextResponse.json(
      { error: 'terms_required', message: 'You must accept the Spotlight Commercial Terms (LEG-301)' },
      { status: 400, headers: getSecurityHeaders() }
    );
  }

  const bName = (business_name || 'Campus Business').trim().substring(0, 100);
  const bOffer = (offer || 'Special Student Offer').trim().substring(0, 80);
  const bDesc = (description || 'Spotlight business listing on Campusly').trim().substring(0, 3000);
  const bContact = (contact || '+234').trim().substring(0, 256);

  // Read price from authoritative settings register
  const priceKey = planId === 'featured' ? 'plan.featured.price' : 'plan.standard.price';
  let priceKobo = 500000; // ₦5,000 default
  try {
    const fetchedPrice = await getSetting(priceKey);
    if (typeof fetchedPrice === 'number' && fetchedPrice > 0) {
      priceKobo = fetchedPrice;
    }
  } catch {
    priceKobo = planId === 'featured' ? 1500000 : 500000;
  }

  try {
    const order = await withTransaction(async (client) => {
      // Generate clean human-readable reference: SPT-ABU-XXXXX
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const reference = `SPT-ABU-${randomSuffix}`;

      // Campus ID
      const campusRes = await client.query('SELECT id FROM campuses WHERE active = TRUE LIMIT 1');
      const campusId = campusRes.rows[0]?.id;

      // Category ID fallback
      let resolvedCategoryId = category_id;
      if (!resolvedCategoryId) {
        const catRes = await client.query("SELECT id FROM categories WHERE kind = 'spotlight' LIMIT 1");
        resolvedCategoryId = catRes.rows[0]?.id;
      }

      const res = await client.query(
        `INSERT INTO spotlight_listings (campus_id, reference, status, plan, category_id, business_name, offer, description, contact)
         VALUES ($1, $2, 'Awaiting payment', $3, $4, $5, $6, $7, $8)
         RETURNING id, reference, plan, business_name, offer, status, created_at`,
        [campusId, reference, planId, resolvedCategoryId, bName, bOffer, bDesc, bContact]
      );
      const created = res.rows[0];

      await client.query(
        `INSERT INTO spotlight_payments (spotlight_id, status, amount_kobo)
         VALUES ($1, 'pending', $2)
         RETURNING id`,
        [created.id, priceKobo]
      );

      await createAuditRow(client, {
        action: 'spotlight_order_created',
        objectType: 'spotlight_listings',
        objectId: created.id,
        after: { planId, priceKobo, reference: created.reference, business_name: bName },
      });

      return {
        id: created.id,
        reference: created.reference,
        priceKobo,
        plan: created.plan,
        business_name: created.business_name,
      };
    });

    // Bank Account Details for payment
    const bankDetails = {
      bank_name: 'Jaiz Bank PLC / First Bank',
      account_name: 'Campusly ABU Enterprise Services',
      account_number: '0123984567',
      payment_reference: order.reference,
      amount_naira: (priceKobo / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
    };

    return NextResponse.json(
      { ok: true, order, bankDetails },
      { status: 201, headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
