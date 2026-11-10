import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DEFAULT_SHOWCASE_CATEGORIES,
  DEFAULT_SHOWCASE_INTRO,
  DEFAULT_SHOWCASE_GALLERY,
  DEFAULT_SHOWCASE_CTA,
  DEFAULT_TOP_BUSINESSES,
  DEFAULT_SHOWCASE_BUNDLE,
} from '@/lib/showcase/defaults';
import { getShowcaseBundle } from '@/lib/showcase/service';
import { GET as getPublicShowcase } from '@/app/api/v1/showcase/route';

describe('Home Showcase & Exploration Categories Specification', () => {
  describe('Showcase Exploration Categories (Five Pillars)', () => {
    it('provides exactly 5 distinct exploration categories', () => {
      expect(DEFAULT_SHOWCASE_CATEGORIES).toHaveLength(5);
    });

    it('contains all required categories with valid dedicated routing paths', () => {
      const titles = DEFAULT_SHOWCASE_CATEGORIES.map((c) => c.title);
      expect(titles).toContain('Explore Categories');
      expect(titles).toContain('Explore Communities');
      expect(titles).toContain('Explore Events');
      expect(titles).toContain('Explore Opportunities');
      expect(titles).toContain('Explore Businesses');

      const hrefs = DEFAULT_SHOWCASE_CATEGORIES.map((c) => c.href);
      expect(hrefs).toContain('/categories');
      expect(hrefs).toContain('/communities');
      expect(hrefs).toContain('/events');
      expect(hrefs).toContain('/opportunities');
      expect(hrefs).toContain('/businesses');
    });

    it('each category card has an icon, subtitle, description, and badge', () => {
      for (const cat of DEFAULT_SHOWCASE_CATEGORIES) {
        expect(cat.id).toBeDefined();
        expect(cat.title.length).toBeGreaterThan(0);
        expect(cat.subtitle.length).toBeGreaterThan(0);
        expect(cat.description.length).toBeGreaterThan(0);
        expect(cat.icon).toBeDefined();
        expect(cat.badge).toBeDefined();
      }
    });
  });

  describe('Showcase Write-Up & Intro Content', () => {
    it('defines a comprehensive introductory write-up', () => {
      expect(DEFAULT_SHOWCASE_INTRO.title).toContain('ABU Zaria');
      expect(DEFAULT_SHOWCASE_INTRO.body.length).toBeGreaterThan(50);
      expect(DEFAULT_SHOWCASE_INTRO.features).toHaveLength(3);
    });

    it('includes peer-verification and instant-access feature highlights', () => {
      const featureTitles = DEFAULT_SHOWCASE_INTRO.features.map((f) => f.title);
      expect(featureTitles).toContain('100% Student-Verified');
      expect(featureTitles).toContain('Direct Instant Access');
      expect(featureTitles).toContain('Real-Time Campus Life');
    });
  });

  describe('Image Sliding Gallery (Carousel)', () => {
    it('provides ordered visual showcase slides', () => {
      expect(DEFAULT_SHOWCASE_GALLERY.length).toBeGreaterThanOrEqual(4);
      for (let i = 0; i < DEFAULT_SHOWCASE_GALLERY.length; i++) {
        expect(DEFAULT_SHOWCASE_GALLERY[i].order).toBe(i + 1);
        expect(DEFAULT_SHOWCASE_GALLERY[i].imageUrl).toMatch(/^(\/|https?:\/\/)/);
        expect(DEFAULT_SHOWCASE_GALLERY[i].title).toBeDefined();
      }
    });
  });

  describe('Explore CTA Button Specification', () => {
    it('defines default destination and customizable label', () => {
      expect(DEFAULT_SHOWCASE_CTA.label).toBeDefined();
      expect(DEFAULT_SHOWCASE_CTA.href).toBe('/explore');
      expect(DEFAULT_SHOWCASE_CTA.secondaryHref).toBe('/submit');
    });
  });

  describe('Special Requirement: Top 10 Ranked Campus Businesses', () => {
    it('contains exactly 10 ranked student enterprises', () => {
      expect(DEFAULT_TOP_BUSINESSES).toHaveLength(10);
    });

    it('ranks businesses sequentially from 1 to 10', () => {
      for (let i = 0; i < DEFAULT_TOP_BUSINESSES.length; i++) {
        expect(DEFAULT_TOP_BUSINESSES[i].rank).toBe(i + 1);
      }
    });

    it('verifies that each business includes score and full action button parameters', () => {
      for (const biz of DEFAULT_TOP_BUSINESSES) {
        expect(biz.name.length).toBeGreaterThan(0);
        expect(biz.category.length).toBeGreaterThan(0);
        expect(biz.score).toBeGreaterThan(0);
        expect(biz.score).toBeLessThanOrEqual(10);
        expect(biz.location).toBeDefined();

        // Action button requirement: label, link, behavior
        expect(biz.actionButton).toBeDefined();
        expect(biz.actionButton.label.length).toBeGreaterThan(0);
        expect(biz.actionButton.link.length).toBeGreaterThan(0);
        expect(['_self', '_blank']).toContain(biz.actionButton.behavior);
      }
    });
  });

  describe('Public Showcase API Endpoint (GET /api/v1/showcase)', () => {
    it('returns 200 with structured bundle and security headers', async () => {
      const response = await getPublicShowcase();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.ok).toBe(true);
      expect(json.data.categories).toHaveLength(5);
      expect(json.data.topBusinesses).toHaveLength(10);
      expect(json.data.intro).toBeDefined();
      expect(json.data.gallery.length).toBeGreaterThanOrEqual(4);
      expect(json.data.cta.href).toBe('/explore');
    });
  });
});
