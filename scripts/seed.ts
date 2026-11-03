import { withTransaction, shutdownDb } from '../lib/db';

export async function seedDatabase() {
  console.log('[Seed] Seeding database with fake testing data...');

  await withTransaction(async (client) => {
    // 1. Seed Campus: Ahmadu Bello University (ABU Zaria)
    const campusRes = await client.query<{ id: string }>(
      `INSERT INTO campuses (slug, name, timezone, active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;`,
      ['abu-zaria', 'Ahmadu Bello University, Zaria', 'Africa/Lagos', true]
    );
    const campusId = campusRes.rows[0].id;

    // 2. Seed 10 Community Categories from D04 / D07
    const communityCategories = [
      { slug: 'technology', name: 'Technology & Digital Skills', icon: 'cpu', sort: 1 },
      { slug: 'business', name: 'Entrepreneurship & Business', icon: 'briefcase', sort: 2 },
      { slug: 'sustainability', name: 'Sustainability & Environment', icon: 'leaf', sort: 3 },
      { slug: 'academic', name: 'Academic & Professional Development', icon: 'graduation-cap', sort: 4 },
      { slug: 'leadership', name: 'Leadership & Volunteering', icon: 'heart-handshake', sort: 5 },
      { slug: 'creative', name: 'Creative Arts & Media', icon: 'palette', sort: 6 },
      { slug: 'sports', name: 'Sports & Recreation', icon: 'trophy', sort: 7 },
      { slug: 'science', name: 'Science & Research', icon: 'flask-conical', sort: 8 },
      { slug: 'health', name: 'Health & Wellbeing', icon: 'heart-pulse', sort: 9 },
      { slug: 'culture', name: 'Culture & Community', icon: 'users', sort: 10 },
    ];

    const categoryMap = new Map<string, string>();

    for (const cat of communityCategories) {
      const res = await client.query<{ id: string }>(
        `INSERT INTO categories (slug, name, kind, icon_key, sort)
         VALUES ($1, $2, 'community', $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon_key = EXCLUDED.icon_key
         RETURNING id;`,
        [cat.slug, cat.name, cat.icon, cat.sort]
      );
      categoryMap.set(cat.slug, res.rows[0].id);
    }

    // 3. Seed 8 Spotlight Categories from D07 BR-106
    const spotlightCategories = [
      { slug: 'spotlight-food', name: 'Food and drinks', icon: 'utensils', sort: 1 },
      { slug: 'spotlight-fashion', name: 'Fashion and accessories', icon: 'shirt', sort: 2 },
      { slug: 'spotlight-tech', name: 'Tech and gadgets', icon: 'smartphone', sort: 3 },
      { slug: 'spotlight-services', name: 'Services (printing, laundry, repairs, tutoring)', icon: 'wrench', sort: 4 },
      { slug: 'spotlight-beauty', name: 'Beauty and wellness', icon: 'sparkles', sort: 5 },
      { slug: 'spotlight-books', name: 'Books and stationery', icon: 'book-open', sort: 6 },
      { slug: 'spotlight-entertainment', name: 'Events and entertainment', icon: 'ticket', sort: 7 },
      { slug: 'spotlight-other', name: 'Other', icon: 'grid', sort: 8 },
    ];

    for (const scat of spotlightCategories) {
      const res = await client.query<{ id: string }>(
        `INSERT INTO categories (slug, name, kind, icon_key, sort)
         VALUES ($1, $2, 'spotlight', $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon_key = EXCLUDED.icon_key
         RETURNING id;`,
        [scat.slug, scat.name, scat.icon, scat.sort]
      );
      categoryMap.set(scat.slug, res.rows[0].id);
    }

    // 4. Seed Settings Register with D07 Default Constants
    const settingsDefaults = [
      { key: 'plan.standard.price', value: 100000, type: 'kobo', desc: 'Standard Spotlight price in kobo (₦1,000)' },
      { key: 'plan.standard.days', value: 3, type: 'integer', desc: 'Standard Spotlight duration in days' },
      { key: 'plan.featured.price', value: 500000, type: 'kobo', desc: 'Featured Spotlight price in kobo (₦5,000)' },
      { key: 'plan.featured.days', value: 4, type: 'integer', desc: 'Featured Spotlight duration in days' },
      { key: 'submit.daily_cap', value: 3, type: 'integer', desc: 'Max submissions per device per 24 hours' },
      { key: 'tracking.lookup_cap', value: 10, type: 'integer', desc: 'Max tracking code lookups per device per hour' },
      { key: 'report.daily_cap', value: 5, type: 'integer', desc: 'Max reports per device per 24 hours' },
      { key: 'report.autohide_threshold', value: 3, type: 'integer', desc: 'Distinct device reports within 7 days to auto-hide' },
      { key: 'star.device_hourly_cap', value: 10, type: 'integer', desc: 'Max stars per device per hour' },
      { key: 'star.network_hourly_cap', value: 30, type: 'integer', desc: 'Max stars per network per listing per hour' },
      { key: 'star.burst_threshold', value: 10, type: 'integer', desc: 'Stars in 10 minutes triggering burst flag' },
      { key: 'star.new_device_delay', value: 60, type: 'integer', desc: 'Seconds a new device must wait before star counts' },
    ];

    for (const s of settingsDefaults) {
      await client.query(
        `INSERT INTO settings (key, value, type, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;`,
        [s.key, JSON.stringify(s.value), s.type, s.desc]
      );
    }

    // 5. Seed Fake Admins (Lead, Reviewer, Finance)
    const fakeAdmins = [
      { email: 'fake.lead@campusly.abu.fake', role: 'lead', hash: '$argon2id$v=19$m=65536,t=3,p=4$fake_hash_lead' },
      { email: 'fake.reviewer@campusly.abu.fake', role: 'reviewer', hash: '$argon2id$v=19$m=65536,t=3,p=4$fake_hash_rev' },
      { email: 'fake.finance@campusly.abu.fake', role: 'finance', hash: '$argon2id$v=19$m=65536,t=3,p=4$fake_hash_fin' },
    ];

    for (const a of fakeAdmins) {
      await client.query(
        `INSERT INTO admins (email, password_hash, role, active)
         VALUES ($1, $2, $3, TRUE)
         ON CONFLICT (email) DO NOTHING;`,
        [a.email, a.hash, a.role]
      );
    }

    // 6. Seed Bank Account (Obviously fake for testing)
    await client.query(
      `INSERT INTO bank_accounts (bank_name, account_name, account_number, active)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT DO NOTHING;`,
      ['ABU Microfinance Bank (Fake)', 'Campusly Operations (Fake)', '9999999999']
    );

    // 7. Seed Sample Listings in Every Status (D07)
    const techCatId = categoryMap.get('technology')!;
    const acadCatId = categoryMap.get('academic')!;

    const sampleListings = [
      {
        kind: 'community',
        slug: 'gdgoc-abu-sample',
        title: 'Google Developer Group On Campus ABU (Sample)',
        summary: 'Peer-to-peer student tech community at Ahmadu Bello University.',
        description: 'A student group for developers interested in Google developer technologies.',
        status: 'Verified',
        catId: techCatId,
        tracking: 'CY-8K2M-1X9A',
      },
      {
        kind: 'community',
        slug: 'robotics-society-sample',
        title: 'ABU Robotics & Automation Society (Sample)',
        summary: 'Student robotics association building smart IoT systems.',
        description: 'Open to all engineering and computer science students.',
        status: 'Approved',
        catId: techCatId,
        tracking: 'CY-4T7N-8Y2B',
      },
      {
        kind: 'event',
        slug: 'annual-tech-symposium-sample',
        title: 'Annual Tech Symposium 2026 (Sample)',
        summary: 'Gathering of student tech founders and engineers.',
        description: 'Featuring tech presentations, workshops, and student networking.',
        status: 'Approved',
        catId: acadCatId,
        tracking: 'CY-9P3L-6W4C',
      },
      {
        kind: 'opportunity',
        slug: 'gdg-mentorship-fellowship-sample',
        title: 'Tech Mentorship Fellowship 2026 (Sample)',
        summary: 'Six-month guided development fellowship for students.',
        description: 'Paired with industry software engineers across Nigeria.',
        status: 'Pending',
        catId: techCatId,
        tracking: 'CY-2R8K-5M7D',
      },
      {
        kind: 'community',
        slug: 'campus-coders-incomplete-sample',
        title: 'Campus Coders Club (Sample Needs Info)',
        summary: 'Incomplete club submission awaiting advisor verification.',
        description: 'Pending faculty endorsement document.',
        status: 'Needs info',
        catId: techCatId,
        tracking: 'CY-6M9P-4X1E',
      },
      {
        kind: 'event',
        slug: 'crypto-pump-webinar-rejected',
        title: 'Get Rich Quick Crypto Seminar (Sample Rejected)',
        summary: 'Investment pitch webinar that violates campus commercial rules.',
        description: 'Rejected for violation of safety standards and BR-021.',
        status: 'Rejected',
        catId: techCatId,
        tracking: 'CY-1B5F-9Z8F',
      },
      {
        kind: 'community',
        slug: 'hidden-society-under-review',
        title: 'Secret Hackers Guild (Sample Hidden)',
        summary: 'Temporarily hidden while multiple spam reports are evaluated.',
        description: 'Under investigation by campus admins.',
        status: 'Hidden',
        catId: techCatId,
        tracking: 'CY-7Q2W-3E6G',
      },
      {
        kind: 'community',
        slug: 'defunct-club-removed-sample',
        title: 'Defunct 2020 Social Club (Sample Removed)',
        summary: 'Permanently removed listing.',
        description: 'Dissolved by organizers.',
        status: 'Removed',
        catId: acadCatId,
        tracking: 'CY-3D8J-2H5H',
      },
    ];

    for (const item of sampleListings) {
      const listingRes = await client.query<{ id: string }>(
        `INSERT INTO listings (
          campus_id, kind, slug, status, category_id, title, summary, description,
          tracking_code, contact_name, contact_channel, star_count, report_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 10, 0)
        ON CONFLICT (tracking_code) DO NOTHING
        RETURNING id;`,
        [
          campusId,
          item.kind,
          item.slug,
          item.status,
          item.catId,
          item.title,
          item.summary,
          item.description,
          item.tracking,
          'Sample Admin Contact',
          'https://chat.whatsapp.com/sample-fake-link',
        ]
      );

      if (listingRes.rows.length > 0) {
        const lid = listingRes.rows[0].id;
        if (item.kind === 'community') {
          await client.query(
            `INSERT INTO community_meta (listing_id, how_to_join, who_can_join, verified_at)
             VALUES ($1, 'Join our WhatsApp group', 'All registered students', CURRENT_TIMESTAMP)
             ON CONFLICT (listing_id) DO NOTHING;`,
            [lid]
          );
        } else if (item.kind === 'event') {
          await client.query(
            `INSERT INTO event_meta (listing_id, starts_at, ends_at, venue, is_free)
             VALUES ($1, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days 3 hours', 'Assembly Hall, Main Campus', TRUE)
             ON CONFLICT (listing_id) DO NOTHING;`,
            [lid]
          );
        } else if (item.kind === 'opportunity') {
          await client.query(
            `INSERT INTO opportunity_meta (listing_id, type, organiser, apply_link)
             VALUES ($1, 'fellowship', 'GDGOC ABU', 'https://campusly.abu.edu.ng/apply-fake')
             ON CONFLICT (listing_id) DO NOTHING;`,
            [lid]
          );
        }
      }
    }

    // 8. Seed Sample Spotlight Listings across Lifecycle States (D07 BR-120 to BR-130)
    const foodCatId = categoryMap.get('spotlight-food')!;
    const booksCatId = categoryMap.get('spotlight-books')!;

    // 8a: Spotlight Active (with verified payment)
    const activeSpotlight = await client.query<{ id: string }>(
      `INSERT INTO spotlight_listings (
        campus_id, reference, status, plan, category_id, business_name, offer, description, contact, starts_at, ends_at
      ) VALUES ($1, $2, 'Awaiting payment', 'featured', $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 days')
      ON CONFLICT (reference) DO NOTHING
      RETURNING id;`,
      [
        campusId,
        'SP-4H8N-2WRT',
        foodCatId,
        'Campus Canteen Express (Sample Active)',
        '20% off all lunchtime rice plates',
        'Serving hot student meals daily at Ribadu Hostel.',
        '08000000000',
      ]
    );

    if (activeSpotlight.rows.length > 0) {
      const spId = activeSpotlight.rows[0].id;
      // Insert confirmed payment row
      await client.query(
        `INSERT INTO spotlight_payments (
          spotlight_id, status, amount_kobo, amount_received_kobo, bank_reference,
          confirmed_in_bank, confirmed_at
        ) VALUES ($1, 'confirmed', 500000, 500000, 'BANK-REF-998822', TRUE, CURRENT_TIMESTAMP);`,
        [spId]
      );
      // Now safe to transition to Active (passes trigger constraint)
      await client.query(
        `UPDATE spotlight_listings SET status = 'Active' WHERE id = $1;`,
        [spId]
      );
    }

    // 8b: Spotlight Awaiting Payment
    await client.query(
      `INSERT INTO spotlight_listings (
        campus_id, reference, status, plan, category_id, business_name, offer, description, contact
      ) VALUES ($1, $2, 'Awaiting payment', 'standard', $3, $4, $5, $6, $7)
      ON CONFLICT (reference) DO NOTHING;`,
      [
        campusId,
        'SP-7K2M-9QXP',
        booksCatId,
        'Zaria Academic Books (Sample Awaiting Payment)',
        'Affordable stationery & handouts',
        'Located at Kongo campus gate.',
        '08011111111',
      ]
    );

    console.log('[Seed] Database seeding completed successfully.');
  });
}

if (require.main === module) {
  seedDatabase()
    .then(() => shutdownDb())
    .catch(async (err) => {
      console.error('[Seed Error]:', err);
      await shutdownDb();
      process.exit(1);
    });
}
