import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ListingCard } from '@/components/cards/listing-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import NotFound from '@/app/not-found';
import { t, STRINGS } from '@/lib/copy/strings';
import { PublicListingSummary, PublicSpotlightItem } from '@/lib/api/public-queries';

describe('BP-07: Public screens & components', () => {
  describe('Copy Strings Integrity (UI-601 to UI-607, COP-01 to COP-12)', () => {
    it('returns exact strings for known keys', () => {
      expect(t('app.name')).toBe('Campusly');
      expect(t('common.paid_listing')).toBe('Paid listing');
      expect(t('common.verified')).toBe('Verified');
    });

    it('interpolates placeholders correctly', () => {
      const interpolated = t('category.communities_heading', { category: 'Tech & Code' });
      expect(interpolated).toBe('Communities in Tech & Code');
    });

    it('contains no unescaped exclamation marks in errors or warnings (COP-10)', () => {
      for (const [key, val] of Object.entries(STRINGS)) {
        if (key.includes('error') || key.includes('warning') || key.includes('not_available')) {
          expect(val).not.toContain('!');
        }
      }
    });

    it('contains zero emoji in system UI copy (COP-11)', () => {
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
      for (const [key, val] of Object.entries(STRINGS)) {
        expect(emojiRegex.test(val)).toBe(false);
      }
    });
  });

  describe('ListingCard component', () => {
    const baseListing: PublicListingSummary = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      kind: 'community',
      slug: 'gdgoc-abu',
      title: 'GDGOC ABU Zaria',
      summary: 'Tech student developer club on campus.',
      category: {
        id: 'cat-1',
        slug: 'tech',
        name: 'Tech & Code',
        icon_key: 'laptop',
      },
      image: null,
      status: 'Approved',
      verified: false,
      star_count: 55,
      created_at: '2026-01-01T00:00:00.000Z',
    };

    it('renders community card with stars and link to slug', () => {
      const html = renderToStaticMarkup(<ListingCard listing={baseListing} />);
      expect(html).toContain('GDGOC ABU Zaria');
      expect(html).toContain('55 stars');
      expect(html).toContain('/communities/gdgoc-abu');
      expect(html).not.toContain('Paid listing');
      expect(html).not.toContain('Verified');
    });

    it('renders verified badge for verified community', () => {
      const html = renderToStaticMarkup(
        <ListingCard listing={{ ...baseListing, verified: true, status: 'Verified' }} />
      );
      expect(html).toContain('Verified');
    });

    it('renders event with formatted starts_at date badge', () => {
      const eventListing: PublicListingSummary = {
        ...baseListing,
        id: 'event-1',
        kind: 'event',
        slug: 'annual-hackathon',
        title: 'Annual Hackathon 2026',
        starts_at: '2026-11-20T09:00:00.000Z',
        star_count: undefined,
      };

      const html = renderToStaticMarkup(<ListingCard listing={eventListing} />);
      expect(html).toContain('Annual Hackathon 2026');
      expect(html).toContain('/events/event-1');
      expect(html).toContain('View event details');
    });

    it('renders opportunity with closing soon badge if marked closing_soon', () => {
      const oppListing: PublicListingSummary = {
        ...baseListing,
        id: 'opp-1',
        kind: 'opportunity',
        slug: 'scholarship-2026',
        title: 'Tech Scholarship 2026',
        deadline_at: '2026-11-05T23:59:59.000Z',
        closing_soon: true,
        star_count: undefined,
      };

      const html = renderToStaticMarkup(<ListingCard listing={oppListing} />);
      expect(html).toContain('Closing soon');
      expect(html).toContain('/opportunities/opp-1');
      expect(html).toContain('View application');
    });
  });

  describe('SpotlightCard component (COP-06 strict rules)', () => {
    const baseSpotlight: PublicSpotlightItem = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      reference: 'SP-ABCD-1234',
      business_name: 'Zaria Tech Print',
      offer: '20% off all project printing',
      description: 'Fast laser printing right outside north gate.',
      category: {
        id: 'cat-2',
        slug: 'services',
        name: 'Campus Services',
      },
      plan: 'standard',
      paid_label: 'Paid listing',
      contact: '08012345678',
      image: null,
      starts_at: '2026-11-01T00:00:00.000Z',
      ends_at: '2026-11-04T00:00:00.000Z',
      rank_group: 'ranked',
    };

    it('MUST render Paid listing label on every Spotlight card', () => {
      const html = renderToStaticMarkup(<SpotlightCard item={baseSpotlight} />);
      expect(html).toContain('Paid listing');
      expect(html).toContain('Zaria Tech Print');
      expect(html).toContain('20% off all project printing');
    });

    it('NEVER renders Verified badge or star count on Spotlight cards', () => {
      const html = renderToStaticMarkup(<SpotlightCard item={baseSpotlight} />);
      expect(html).not.toContain('Verified');
      expect(html).not.toContain('stars');
    });

    it('renders Featured badge when item is on featured plan', () => {
      const html = renderToStaticMarkup(<SpotlightCard item={{ ...baseSpotlight, plan: 'featured' }} />);
      expect(html).toContain('Featured');
    });
  });

  describe('app/not-found.tsx (D03 UI-506 / D06 API-120)', () => {
    it('renders neutral not_available message with home link', () => {
      const html = renderToStaticMarkup(<NotFound />);
      expect(html).toContain('Listing not available');
      expect(html).toContain('This listing is no longer available or does not exist.');
      expect(html).toContain('Return to homepage');
    });
  });
});

