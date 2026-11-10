-- ==============================================================================
-- Campusly Migration 001: Initial Schema
-- Source of Truth: D05 Architecture & Data Model, D07 Business Rules, D08 Security
-- ==============================================================================

-- 1. PostgreSQL Extensions (DB-00)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Campuses Table (D05 Section 6)
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Lagos',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table (10 Community/Event/Opp categories + 8 Spotlight categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  kind VARCHAR(32) NOT NULL CHECK (kind IN ('community', 'spotlight')),
  icon_key VARCHAR(64) NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Anonymous Devices Table (ARC-901, D08)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  trust_score INTEGER NOT NULL DEFAULT 100,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Attachments Table (Images, receipts, proofs)
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_type VARCHAR(32) NOT NULL,
  owner_id UUID,
  purpose VARCHAR(64) NOT NULL,
  storage_key VARCHAR(512) NOT NULL UNIQUE,
  mime VARCHAR(128) NOT NULL,
  bytes INTEGER NOT NULL CHECK (bytes > 0 AND bytes <= 8388608), -- max 8MB
  alt_text VARCHAR(140),
  scanned_at TIMESTAMPTZ,
  delete_after TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Shared Listings Table (Communities, Events, Opportunities)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  kind VARCHAR(32) NOT NULL CHECK (kind IN ('community', 'event', 'opportunity')),
  slug VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN (
    'Pending', 'Approved', 'Verified', 'Needs info', 'Rejected', 'Hidden', 'Removed'
  )),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(100) NOT NULL CHECK (char_length(trim(title)) >= 3),
  summary VARCHAR(160) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 3000),
  image_id UUID REFERENCES attachments(id) ON DELETE SET NULL,
  tracking_code VARCHAR(32) NOT NULL UNIQUE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  contact_name VARCHAR(80) NOT NULL,
  contact_channel VARCHAR(256) NOT NULL,
  contact_email VARCHAR(254),
  star_count INTEGER NOT NULL DEFAULT 0 CHECK (star_count >= 0),
  star_count_reached_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  report_count INTEGER NOT NULL DEFAULT 0 CHECK (report_count >= 0),
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  hidden_reason VARCHAR(256),
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Verified status applies ONLY to communities (BR-003)
  CONSTRAINT check_verified_community_only CHECK (
    status != 'Verified' OR kind = 'community'
  )
);

-- 7. Kind-Specific Metadata Tables
CREATE TABLE IF NOT EXISTS community_meta (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  how_to_join TEXT,
  who_can_join TEXT,
  meeting_times VARCHAR(256),
  founded_year INTEGER CHECK (founded_year >= 1962 AND founded_year <= 2100),
  size_band VARCHAR(64),
  verified_at TIMESTAMPTZ,
  verified_until TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_meta (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  venue VARCHAR(256) NOT NULL,
  map_link VARCHAR(2048) CHECK (map_link IS NULL OR map_link ~* '^https?://'),
  register_link VARCHAR(2048) CHECK (register_link IS NULL OR register_link ~* '^https?://'),
  is_free BOOLEAN NOT NULL DEFAULT TRUE,

  CONSTRAINT check_event_ends_after_starts CHECK (
    ends_at IS NULL OR ends_at >= starts_at
  )
);

CREATE TABLE IF NOT EXISTS opportunity_meta (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL, -- internship, scholarship, fellowship, volunteering, grant, competition
  organiser VARCHAR(128) NOT NULL,
  deadline_at TIMESTAMPTZ,
  is_rolling BOOLEAN NOT NULL DEFAULT FALSE,
  eligibility TEXT,
  apply_link VARCHAR(2048) NOT NULL CHECK (apply_link ~* '^https?://')
);

CREATE TABLE IF NOT EXISTS listing_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  label VARCHAR(64) NOT NULL,
  url VARCHAR(2048) NOT NULL CHECK (url ~* '^https?://'),
  is_official BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Status History Table (Audit trail of every status transition)
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  from_status VARCHAR(32),
  to_status VARCHAR(32) NOT NULL,
  reason_code VARCHAR(64),
  note TEXT,
  actor_type VARCHAR(32) NOT NULL CHECK (actor_type IN ('submitter', 'admin', 'system')),
  actor_id UUID,
  at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Stars Table (One star per device per listing, unique constraint)
CREATE TABLE IF NOT EXISTS stars (
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  network_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id, listing_id)
);

-- 10. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  spotlight_id UUID,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  network_hash VARCHAR(64),
  reason VARCHAR(64) NOT NULL,
  note VARCHAR(300),
  status VARCHAR(32) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed', 'actioned')),
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Info Replies Table (Organiser reply to Needs info within window)
CREATE TABLE IF NOT EXISTS info_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_id UUID REFERENCES attachments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Announcements Table (Admin only)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  title VARCHAR(128) NOT NULL,
  body TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Privacy-Light Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(64) NOT NULL,
  device_hash VARCHAR(64) NOT NULL,
  route VARCHAR(128) NOT NULL,
  props JSONB,
  at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Spotlight Paid Listings Table
CREATE TABLE IF NOT EXISTS spotlight_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
  reference VARCHAR(32) NOT NULL UNIQUE,
  status VARCHAR(32) NOT NULL CHECK (status IN (
    'Awaiting payment', 'Receipt submitted', 'Active', 'Paused', 'Expired', 'Cancelled', 'Rejected'
  )),
  plan VARCHAR(32) NOT NULL CHECK (plan IN ('standard', 'featured')),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  business_name VARCHAR(100) NOT NULL,
  offer VARCHAR(80) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 3000),
  contact VARCHAR(256) NOT NULL,
  image_id UUID REFERENCES attachments(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  renewal_of UUID REFERENCES spotlight_listings(id) ON DELETE SET NULL,
  slot_number INTEGER CHECK (slot_number IS NULL OR (slot_number >= 1 AND slot_number <= 6)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Spotlight Payments Table (Enhanced per BP-03 requirement)
CREATE TABLE IF NOT EXISTS spotlight_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotlight_id UUID NOT NULL REFERENCES spotlight_listings(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'underpaid', 'overpaid', 'refunded'
  )),
  amount_kobo INTEGER NOT NULL CHECK (amount_kobo > 0),
  amount_received_kobo INTEGER CHECK (amount_received_kobo IS NULL OR amount_received_kobo >= 0),
  receipt_attachment_id UUID REFERENCES attachments(id) ON DELETE SET NULL,
  bank_reference VARCHAR(64),
  bank_sender_name VARCHAR(128),
  bank_narration VARCHAR(256),
  admin_note VARCHAR(1000),
  confirmed_in_bank BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_note VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Spotlight Waitlist Table
CREATE TABLE IF NOT EXISTS spotlight_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotlight_id UUID NOT NULL REFERENCES spotlight_listings(id) ON DELETE CASCADE,
  offered_at TIMESTAMPTZ,
  offer_expires_at TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'offered', 'expired', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Bank Accounts Table (Read from settings/admin; two-Lead approval model)
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_name VARCHAR(128) NOT NULL,
  account_name VARCHAR(128) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(256) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role IN ('reviewer', 'finance', 'lead')),
  mfa_secret_enc TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. Settings Register Table (D07)
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(128) PRIMARY KEY,
  value JSONB NOT NULL,
  type VARCHAR(32) NOT NULL CHECK (type IN ('integer', 'string', 'boolean', 'json', 'kobo')),
  description TEXT NOT NULL,
  updated_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(128) NOT NULL,
  old_value JSONB NOT NULL,
  new_value JSONB NOT NULL,
  note VARCHAR(500) NOT NULL,
  changed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. Audit Log Table (Append-only)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action VARCHAR(64) NOT NULL,
  object_type VARCHAR(64) NOT NULL,
  object_id UUID,
  before JSONB,
  after JSONB,
  ip_hash VARCHAR(64) NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 22. Scheduled Job Runs Table
CREATE TABLE IF NOT EXISTS job_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job VARCHAR(64) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMPTZ,
  result JSONB,
  error TEXT
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

-- DB-02b: Partial Active-Slug Index (Allows reusing slug after item is Removed)
CREATE UNIQUE INDEX IF NOT EXISTS listings_active_slug_idx
  ON listings (campus_id, kind, slug)
  WHERE status != 'Removed';

-- DB-03: Partial Index on Public Listings
CREATE INDEX IF NOT EXISTS listings_public_idx
  ON listings (category_id, created_at DESC)
  WHERE status IN ('Approved', 'Verified');

-- DB-04: Full-Text and Fuzzy Search Indexes
CREATE INDEX IF NOT EXISTS listings_search_vector_idx
  ON listings USING gin (search_vector);

CREATE INDEX IF NOT EXISTS listings_title_trgm_idx
  ON listings USING gin (title gin_trgm_ops);

-- DB-05: Queue and Expiry Indexes
CREATE INDEX IF NOT EXISTS listings_review_queue_idx
  ON listings (status, created_at ASC);

CREATE INDEX IF NOT EXISTS spotlight_expiry_idx
  ON spotlight_listings (status, ends_at ASC);

-- ==============================================================================
-- TRIGGERS & INTEGRITY RULES (DB-05, D08)
-- ==============================================================================

-- Rule 1: Audit Log is Append-Only (Reject UPDATE or DELETE)
CREATE OR REPLACE FUNCTION protect_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: updates and deletes are forbidden';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit_log ON audit_log;
CREATE TRIGGER trg_protect_audit_log
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION protect_audit_log();

-- Rule 2: Automatic search_vector generation
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.summary, ''))), 'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(NEW.description, ''))), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_listing_search_vector ON listings;
CREATE TRIGGER trg_update_listing_search_vector
  BEFORE INSERT OR UPDATE OF title, summary, description ON listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_search_vector();

-- Rule 3: Enforce Listing State Machine Transition Rules (ARC-701, D07)
CREATE OR REPLACE FUNCTION validate_listing_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- If status hasn't changed, allow update
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Disallow any transition out of Removed
  IF OLD.status = 'Removed' THEN
    RAISE EXCEPTION 'Cannot transition listing out of Removed status';
  END IF;

  -- Validate specific allowed transitions from D07
  IF OLD.status = 'Pending' AND NEW.status NOT IN ('Approved', 'Needs info', 'Rejected', 'Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Pending to %', NEW.status;
  ELSIF OLD.status = 'Needs info' AND NEW.status NOT IN ('Pending', 'Rejected', 'Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Needs info to %', NEW.status;
  ELSIF OLD.status = 'Approved' AND NEW.status NOT IN ('Verified', 'Hidden', 'Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Approved to %', NEW.status;
  ELSIF OLD.status = 'Verified' AND NEW.status NOT IN ('Approved', 'Hidden', 'Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Verified to %', NEW.status;
  ELSIF OLD.status = 'Hidden' AND NEW.status NOT IN ('Approved', 'Verified', 'Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Hidden to %', NEW.status;
  ELSIF OLD.status = 'Rejected' AND NEW.status NOT IN ('Removed') THEN
    RAISE EXCEPTION 'Invalid transition from Rejected to %', NEW.status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_listing_status_transition ON listings;
CREATE TRIGGER trg_validate_listing_status_transition
  BEFORE UPDATE OF status ON listings
  FOR EACH ROW EXECUTE FUNCTION validate_listing_status_transition();

-- Rule 4: Spotlight Active requires Confirmed Payment in Bank (ARC-703, D07 BR-141)
CREATE OR REPLACE FUNCTION validate_spotlight_active_payment()
RETURNS TRIGGER AS $$
DECLARE
  has_confirmed_payment BOOLEAN;
BEGIN
  IF NEW.status = 'Active' AND (OLD.status IS NULL OR OLD.status != 'Active') THEN
    SELECT EXISTS (
      SELECT 1 FROM spotlight_payments
      WHERE spotlight_id = NEW.id
        AND confirmed_in_bank = TRUE
        AND status = 'confirmed'
    ) INTO has_confirmed_payment;

    IF NOT has_confirmed_payment THEN
      RAISE EXCEPTION 'Spotlight listing cannot be Active without a confirmed payment in bank';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_spotlight_active_payment ON spotlight_listings;
CREATE TRIGGER trg_validate_spotlight_active_payment
  BEFORE INSERT OR UPDATE OF status ON spotlight_listings
  FOR EACH ROW EXECUTE FUNCTION validate_spotlight_active_payment();
