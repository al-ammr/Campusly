-- ==============================================================================
-- Campusly Migration 001 Rollback: Initial Schema
-- ==============================================================================

-- Drop triggers
DROP TRIGGER IF EXISTS trg_validate_spotlight_active_payment ON spotlight_listings;
DROP TRIGGER IF EXISTS trg_validate_listing_status_transition ON listings;
DROP TRIGGER IF EXISTS trg_update_listing_search_vector ON listings;
DROP TRIGGER IF EXISTS trg_protect_audit_log ON audit_log;

-- Drop trigger functions
DROP FUNCTION IF EXISTS validate_spotlight_active_payment();
DROP FUNCTION IF EXISTS validate_listing_status_transition();
DROP FUNCTION IF EXISTS update_listing_search_vector();
DROP FUNCTION IF EXISTS protect_audit_log();

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS job_runs CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS settings_history CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS spotlight_waitlist CASCADE;
DROP TABLE IF EXISTS spotlight_payments CASCADE;
DROP TABLE IF EXISTS spotlight_listings CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS info_replies CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS stars CASCADE;
DROP TABLE IF EXISTS status_history CASCADE;
DROP TABLE IF EXISTS listing_links CASCADE;
DROP TABLE IF EXISTS opportunity_meta CASCADE;
DROP TABLE IF EXISTS event_meta CASCADE;
DROP TABLE IF EXISTS community_meta CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS campuses CASCADE;
