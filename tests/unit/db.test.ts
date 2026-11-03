import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { pool, withTransaction } from '@/lib/db';

describe('Database Schema, Migrations & Integrity Rules (BP-03)', () => {
  const upSqlPath = path.resolve(process.cwd(), 'scripts/migrations/001_initial_schema.sql');
  const downSqlPath = path.resolve(process.cwd(), 'scripts/migrations/001_initial_schema.down.sql');
  const seedScriptPath = path.resolve(process.cwd(), 'scripts/seed.ts');

  const upSql = fs.readFileSync(upSqlPath, 'utf-8');
  const downSql = fs.readFileSync(downSqlPath, 'utf-8');
  const seedCode = fs.readFileSync(seedScriptPath, 'utf-8');

  describe('PostgreSQL Extensions Initialization (DB-00)', () => {
    it('initializes uuid-ossp, pg_trgm, and unaccent extensions', () => {
      expect(upSql).toContain('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      expect(upSql).toContain('CREATE EXTENSION IF NOT EXISTS "pg_trgm"');
      expect(upSql).toContain('CREATE EXTENSION IF NOT EXISTS "unaccent"');
    });
  });

  describe('Table Schema Completeness (D05 Section 6)', () => {
    const requiredTables = [
      'campuses',
      'categories',
      'devices',
      'attachments',
      'listings',
      'community_meta',
      'event_meta',
      'opportunity_meta',
      'listing_links',
      'status_history',
      'stars',
      'reports',
      'info_replies',
      'announcements',
      'analytics_events',
      'spotlight_listings',
      'spotlight_payments',
      'spotlight_waitlist',
      'bank_accounts',
      'admins',
      'admin_sessions',
      'settings',
      'settings_history',
      'audit_log',
      'job_runs',
    ];

    for (const table of requiredTables) {
      it(`defines table "${table}" in up migration`, () => {
        const regex = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, 'i');
        expect(upSql).toMatch(regex);
      });

      it(`drops table "${table}" in down migration`, () => {
        const regex = new RegExp(`DROP TABLE IF EXISTS ${table}\\b`, 'i');
        expect(downSql).toMatch(regex);
      });
    }
  });

  describe('Constraints & Rules (D05, D07, D08)', () => {
    it('enforces check constraint for 7 D07 listing statuses', () => {
      expect(upSql).toContain(
        "'Pending', 'Approved', 'Verified', 'Needs info', 'Rejected', 'Hidden', 'Removed'"
      );
    });

    it('enforces that Verified status applies ONLY to communities (BR-003)', () => {
      expect(upSql).toContain('check_verified_community_only');
      expect(upSql).toContain("status != 'Verified' OR kind = 'community'");
    });

    it('enforces check constraint for 7 D07 Spotlight statuses (BR-120 to BR-130)', () => {
      expect(upSql).toContain(
        "'Awaiting payment', 'Receipt submitted', 'Active', 'Paused', 'Expired', 'Cancelled', 'Rejected'"
      );
    });

    it('enforces enhanced spotlight_payments schema (pending, confirmed, underpaid, overpaid, refunded)', () => {
      expect(upSql).toContain(
        "'pending', 'confirmed', 'underpaid', 'overpaid', 'refunded'"
      );
      expect(upSql).toContain('amount_received_kobo');
      expect(upSql).toContain('bank_sender_name');
      expect(upSql).toContain('bank_narration');
      expect(upSql).toContain('admin_note');
    });

    it('enforces event ends_at after starts_at check constraint', () => {
      expect(upSql).toContain('check_event_ends_after_starts');
      expect(upSql).toContain('ends_at IS NULL OR ends_at >= starts_at');
    });

    it('enforces positive integer amounts in kobo', () => {
      expect(upSql).toContain('amount_kobo > 0');
    });

    it('enforces https/http URL constraints on outbound links', () => {
      expect(upSql).toContain("apply_link ~* '^https?://'");
    });
  });

  describe('Indexes & Optimization (DB-02 to DB-05)', () => {
    it('creates partial unique index on active slugs (DB-02b)', () => {
      expect(upSql).toContain('listings_active_slug_idx');
      expect(upSql).toContain("WHERE status != 'Removed'");
    });

    it('creates partial index on public listings (DB-03)', () => {
      expect(upSql).toContain('listings_public_idx');
      expect(upSql).toContain("WHERE status IN ('Approved', 'Verified')");
    });

    it('creates GIN index with unaccent and trigram index on title (DB-04)', () => {
      expect(upSql).toContain('listings_search_vector_idx');
      expect(upSql).toContain('listings_title_trgm_idx');
      expect(upSql).toContain('gin (title gin_trgm_ops)');
    });

    it('creates compound index for star uniqueness per device per listing (DB-02)', () => {
      expect(upSql).toContain('PRIMARY KEY (device_id, listing_id)');
    });
  });

  describe('Integrity Triggers (D05 ARC-701 to ARC-703, D08)', () => {
    it('defines append-only trigger on audit_log to prevent updates and deletions', () => {
      expect(upSql).toContain('protect_audit_log');
      expect(upSql).toContain('trg_protect_audit_log');
      expect(upSql).toContain('audit_log is append-only: updates and deletes are forbidden');
    });

    it('defines listing status transition trigger enforcing allowed D07 moves', () => {
      expect(upSql).toContain('validate_listing_status_transition');
      expect(upSql).toContain('trg_validate_listing_status_transition');
      expect(upSql).toContain('Cannot transition listing out of Removed status');
    });

    it('defines trigger requiring confirmed payment before Spotlight becomes Active (ARC-703, BR-141)', () => {
      expect(upSql).toContain('validate_spotlight_active_payment');
      expect(upSql).toContain('trg_validate_spotlight_active_payment');
      expect(upSql).toContain('Spotlight listing cannot be Active without a confirmed payment in bank');
    });
  });

  describe('Database Client Singleton (lib/db)', () => {
    it('exports pool, query, withTransaction, and shutdownDb', () => {
      expect(pool).toBeDefined();
      expect(typeof pool.connect).toBe('function');
      expect(typeof withTransaction).toBe('function');
    });
  });

  describe('Seed Specification (D07)', () => {
    it('seeds 10 academic and student categories', () => {
      const categories = [
        'technology',
        'business',
        'sustainability',
        'academic',
        'leadership',
        'creative',
        'sports',
        'science',
        'health',
        'culture',
      ];
      for (const cat of categories) {
        expect(seedCode).toContain(`'${cat}'`);
      }
    });

    it('seeds 8 spotlight categories (BR-106)', () => {
      const spotlightCats = [
        'spotlight-food',
        'spotlight-fashion',
        'spotlight-tech',
        'spotlight-services',
        'spotlight-beauty',
        'spotlight-books',
        'spotlight-entertainment',
        'spotlight-other',
      ];
      for (const cat of spotlightCats) {
        expect(seedCode).toContain(`'${cat}'`);
      }
    });

    it('seeds sample listings across all D07 statuses', () => {
      const statuses = [
        'Pending',
        'Approved',
        'Verified',
        'Needs info',
        'Rejected',
        'Hidden',
        'Removed',
      ];
      for (const st of statuses) {
        expect(seedCode).toContain(`'${st}'`);
      }
    });

    it('seeds default settings with D07 values in kobo and integers', () => {
      expect(seedCode).toContain("'plan.standard.price', value: 100000");
      expect(seedCode).toContain("'plan.featured.price', value: 500000");
      expect(seedCode).toContain("'submit.daily_cap', value: 3");
    });
  });
});
