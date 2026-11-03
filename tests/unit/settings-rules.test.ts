import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  isListingPubliclyVisible,
  isSpotlightPubliclyVisible,
  isOpportunityClosingSoon,
  classifyListingKind,
  calculateEventEndTime,
  calculateRollingReviewDate,
  generateTrackingCode,
  generateSpotlightReference,
  rankListings,
  getFeaturedRotationSeed,
  calculateSpotlightExpiry,
  isSpotlightExpired,
  isSpotlightInRenewalWindow,
  isSpotlightInRefundWindow,
  isListingCapReached,
  shouldAutoHideListing,
  SAFE_CODE_CHARS,
} from '@/lib/rules';
import {
  validateListingMove,
  validateSpotlightMove,
} from '@/lib/rules/status-machine';
import { SETTINGS_DEFAULTS } from '@/lib/settings/defaults';

describe('Settings Register & Pure Rules Module (BP-04)', () => {
  describe('D07 Standing Rule: Zero Hardcoded Business Numbers', () => {
    it('verifies all 35+ canonical D07 setting keys exist in defaults.ts', () => {
      const keys = Object.keys(SETTINGS_DEFAULTS);
      expect(keys.length).toBeGreaterThanOrEqual(35);
      expect(SETTINGS_DEFAULTS['plan.standard.price'].defaultValue).toBe(100000); // ₦1,000 in kobo
      expect(SETTINGS_DEFAULTS['plan.featured.price'].defaultValue).toBe(500000); // ₦5,000 in kobo
      expect(SETTINGS_DEFAULTS['submit.dailyCapPerDevice'].defaultValue).toBe(3);
      expect(SETTINGS_DEFAULTS['track.lookupCapPerHour'].defaultValue).toBe(10);
      expect(SETTINGS_DEFAULTS['report.autoHideCount'].defaultValue).toBe(3);
    });

    it('verifies that status-machine and pure rules files do not hardcode price numbers', () => {
      const statusMachinePath = path.resolve(process.cwd(), 'lib/rules/status-machine.ts');
      const rulesIndexPath = path.resolve(process.cwd(), 'lib/rules/index.ts');

      const smContent = fs.readFileSync(statusMachinePath, 'utf-8');
      const rulesContent = fs.readFileSync(rulesIndexPath, 'utf-8');

      // 500000 (featured kobo) and 100000 (standard kobo) must not be hardcoded in rule engines
      expect(smContent).not.toContain('500000');
      expect(smContent).not.toContain('100000');
      expect(rulesContent).not.toContain('500000');
      expect(rulesContent).not.toContain('100000');
    });
  });

  describe('D07 BR-001 & BR-002: Public Listing Visibility', () => {
    it('allows only Approved and Verified listings to be public', () => {
      expect(isListingPubliclyVisible('Approved')).toBe(true);
      expect(isListingPubliclyVisible('Verified')).toBe(true);

      expect(isListingPubliclyVisible('Pending')).toBe(false);
      expect(isListingPubliclyVisible('Needs info')).toBe(false);
      expect(isListingPubliclyVisible('Rejected')).toBe(false);
      expect(isListingPubliclyVisible('Hidden')).toBe(false);
      expect(isListingPubliclyVisible('Removed')).toBe(false);
    });

    it('allows Spotlight listings to be public strictly when Active', () => {
      expect(isSpotlightPubliclyVisible('Active')).toBe(true);
      expect(isSpotlightPubliclyVisible('Awaiting payment')).toBe(false);
      expect(isSpotlightPubliclyVisible('Receipt submitted')).toBe(false);
      expect(isSpotlightPubliclyVisible('Paused')).toBe(false);
      expect(isSpotlightPubliclyVisible('Expired')).toBe(false);
      expect(isSpotlightPubliclyVisible('Cancelled')).toBe(false);
    });
  });

  describe('D07 BR-013 & BR-140: Tracking Code & Reference Generation', () => {
    it('BR-013: generates CY-XXXX-XXXX tracking codes using look-alike free characters', () => {
      const code = generateTrackingCode();
      expect(code).toMatch(/^CY-[2345679ACDEFGHJKMNPQRSTUVWXYZ]{4}-[2345679ACDEFGHJKMNPQRSTUVWXYZ]{4}$/);

      // Verify forbidden look-alike characters (0, O, 1, I, L, 8, B)
      expect(code).not.toMatch(/[0O1IL8B]/);
    });

    it('BR-140: generates SP-XXXX-XXXX payment references using look-alike free characters', () => {
      const ref = generateSpotlightReference();
      expect(ref).toMatch(/^SP-[2345679ACDEFGHJKMNPQRSTUVWXYZ]{4}-[2345679ACDEFGHJKMNPQRSTUVWXYZ]{4}$/);
      expect(ref).not.toMatch(/[0O1IL8B]/);
    });

    it('generates non-sequential and unique values across iterations', () => {
      const codes = new Set<string>();
      for (let i = 0; i < 50; i++) {
        codes.add(generateTrackingCode());
      }
      expect(codes.size).toBe(50);
    });
  });

  describe('D07 BR-050, BR-051, BR-052: Events and Opportunities Rules', () => {
    it('BR-050 & BR-051: classifies items with start dates as events and deadlines as opportunities', () => {
      expect(
        classifyListingKind({ startsAt: new Date('2026-11-14T16:00:00Z') })
      ).toBe('event');
      expect(
        classifyListingKind({ deadlineAt: new Date('2026-12-01T23:59:59Z') })
      ).toBe('opportunity');
      expect(classifyListingKind({ isRolling: true })).toBe('opportunity');
    });

    it('BR-052: calculates event end time as 3 hours after start when omitted', () => {
      const start = new Date('2026-11-14T16:00:00Z');
      const end = calculateEventEndTime(start, null, 3);
      expect(end.getTime() - start.getTime()).toBe(3 * 60 * 60 * 1000);
    });

    it('BR-055: identifies opportunity closing soon within 7 days', () => {
      const now = new Date('2026-11-10T12:00:00Z');
      const inFiveDays = new Date('2026-11-15T12:00:00Z');
      const inTenDays = new Date('2026-11-20T12:00:00Z');
      const yesterday = new Date('2026-11-09T12:00:00Z');

      expect(isOpportunityClosingSoon(inFiveDays, now, 7)).toBe(true);
      expect(isOpportunityClosingSoon(inTenDays, now, 7)).toBe(false);
      expect(isOpportunityClosingSoon(yesterday, now, 7)).toBe(false);
    });

    it('BR-057: calculates rolling opportunity 60-day review date', () => {
      const reviewed = new Date('2026-11-01T00:00:00Z');
      const nextReview = calculateRollingReviewDate(reviewed, 60);
      expect(nextReview.getTime() - reviewed.getTime()).toBe(60 * 24 * 60 * 60 * 1000);
    });
  });

  describe('D07 BR-204 & BR-205: Star Ranking Order & Tie-Break Logic', () => {
    it('orders listings with highest stars first', () => {
      const listings = [
        { id: '1', starCount: 5, starCountReachedAt: '2026-11-02T10:00:00Z' },
        { id: '2', starCount: 15, starCountReachedAt: '2026-11-02T12:00:00Z' },
        { id: '3', starCount: 8, starCountReachedAt: '2026-11-02T08:00:00Z' },
      ];
      const ranked = rankListings(listings);
      expect(ranked.map((r) => r.id)).toEqual(['2', '3', '1']);
    });

    it('tie-break for starred listings: earlier reached count ranks higher', () => {
      const listings = [
        { id: 'later', starCount: 10, starCountReachedAt: '2026-11-02T14:00:00Z' },
        { id: 'earlier', starCount: 10, starCountReachedAt: '2026-11-02T09:00:00Z' },
      ];
      const ranked = rankListings(listings);
      expect(ranked[0].id).toBe('earlier');
    });

    it('tie-break for zero stars: newest activation ranks higher', () => {
      const listings = [
        { id: 'older', starCount: 0, starCountReachedAt: '', activatedAt: '2026-10-01T00:00:00Z' },
        { id: 'newer', starCount: 0, starCountReachedAt: '', activatedAt: '2026-11-01T00:00:00Z' },
      ];
      const ranked = rankListings(listings);
      expect(ranked[0].id).toBe('newer');
    });
  });

  describe('D07 BR-045: Report Auto-Hide Evaluation', () => {
    it('triggers auto-hide when 3 distinct devices report within 7 days', () => {
      const now = new Date('2026-11-02T12:00:00Z');
      const reports = [
        { deviceId: 'dev_1', createdAt: '2026-11-01T10:00:00Z' },
        { deviceId: 'dev_2', createdAt: '2026-10-30T10:00:00Z' },
        { deviceId: 'dev_3', createdAt: '2026-10-29T10:00:00Z' },
      ];
      expect(shouldAutoHideListing(reports, 3, 7, now)).toBe(true);
    });

    it('does NOT trigger auto-hide if multiple reports come from the same device', () => {
      const now = new Date('2026-11-02T12:00:00Z');
      const reports = [
        { deviceId: 'dev_1', createdAt: '2026-11-01T10:00:00Z' },
        { deviceId: 'dev_1', createdAt: '2026-11-01T11:00:00Z' },
        { deviceId: 'dev_1', createdAt: '2026-11-01T12:00:00Z' },
      ];
      expect(shouldAutoHideListing(reports, 3, 7, now)).toBe(false);
    });

    it('ignores reports older than 7 days', () => {
      const now = new Date('2026-11-02T12:00:00Z');
      const reports = [
        { deviceId: 'dev_1', createdAt: '2026-11-01T10:00:00Z' },
        { deviceId: 'dev_2', createdAt: '2026-10-31T10:00:00Z' },
        { deviceId: 'dev_3', createdAt: '2026-10-20T10:00:00Z' }, // 13 days ago
      ];
      expect(shouldAutoHideListing(reports, 3, 7, now)).toBe(false);
    });
  });

  describe('D07 BR-103, BR-147, BR-161: Spotlight Rules', () => {
    it('BR-103: enforces max 3 active listings per seller', () => {
      expect(isListingCapReached(2, 3)).toBe(false);
      expect(isListingCapReached(3, 3)).toBe(true);
      expect(isListingCapReached(4, 3)).toBe(true);
    });

    it('BR-147: checks 7-day refund window from decision date', () => {
      const now = new Date('2026-11-05T00:00:00Z');
      const recentDecision = new Date('2026-11-02T00:00:00Z'); // 3 days ago
      const oldDecision = new Date('2026-10-25T00:00:00Z'); // 11 days ago

      expect(isSpotlightInRefundWindow(recentDecision, 7, now)).toBe(true);
      expect(isSpotlightInRefundWindow(oldDecision, 7, now)).toBe(false);
    });

    it('BR-161: checks 24-hour renewal window before expiry', () => {
      const now = new Date('2026-11-05T12:00:00Z');
      const expiresTomorrow = new Date('2026-11-06T10:00:00Z'); // in 22 hours
      const expiresNextWeek = new Date('2026-11-12T10:00:00Z'); // in 7 days

      expect(isSpotlightInRenewalWindow(expiresTomorrow, 24, now)).toBe(true);
      expect(isSpotlightInRenewalWindow(expiresNextWeek, 24, now)).toBe(false);
    });
  });

  describe('D07 State Machine: Listing Status Transitions', () => {
    it('BR-003: refuses Verified status for non-community listings', () => {
      expect(() => {
        validateListingMove('Approved', 'Verified', 'event', 'lead');
      }).toThrow("Only communities can be granted 'Verified' status");

      expect(() => {
        validateListingMove('Approved', 'Verified', 'opportunity', 'lead');
      }).toThrow("Only communities can be granted 'Verified' status");
    });

    it('allows Verified status for community listings', () => {
      expect(() => {
        validateListingMove('Approved', 'Verified', 'community', 'reviewer');
      }).not.toThrow();
    });

    it('BR-004: refuses transition out of Rejected status', () => {
      expect(() => {
        validateListingMove('Rejected', 'Pending', 'community', 'reviewer');
      }).toThrow('A rejected listing is final and cannot be reopened');
    });

    it('BR-007: refuses transition out of Removed status', () => {
      expect(() => {
        validateListingMove('Removed', 'Approved', 'community', 'lead');
      }).toThrow("A 'Removed' listing cannot be transitioned to any other status");
    });

    it('requires a reason when transitioning to Rejected, Needs info, Hidden, or Removed', () => {
      expect(() => {
        validateListingMove('Pending', 'Needs info', 'community', 'reviewer');
      }).toThrow("A written question/reason is required for 'Needs info'");

      expect(() => {
        validateListingMove('Pending', 'Rejected', 'community', 'reviewer');
      }).toThrow("A reason is required to reject a submission");

      expect(() => {
        validateListingMove('Approved', 'Hidden', 'community', 'reviewer');
      }).toThrow("A reason is required to hide a listing");

      expect(() => {
        validateListingMove('Approved', 'Removed', 'community', 'reviewer');
      }).toThrow("A reason is required to remove a listing");
    });
  });

  describe('D07 State Machine: Spotlight Lifecycle Transitions', () => {
    it('BR-141: refuses Active status without confirmed payment in bank', () => {
      expect(() => {
        validateSpotlightMove('Receipt submitted', 'Active', 'finance', false);
      }).toThrow('Listing cannot be Active without Confirmed in Bank ticked');
    });

    it('refuses Active status if role is reviewer instead of finance or lead', () => {
      expect(() => {
        validateSpotlightMove('Receipt submitted', 'Active', 'reviewer', true);
      }).toThrow('Only Finance or Lead roles may activate a Spotlight listing');
    });

    it('allows Active status when confirmed in bank and role is finance or lead', () => {
      expect(() => {
        validateSpotlightMove('Receipt submitted', 'Active', 'finance', true);
      }).not.toThrow();
      expect(() => {
        validateSpotlightMove('Receipt submitted', 'Active', 'lead', true);
      }).not.toThrow();
    });

    it('BR-129: refuses reactivation of Expired, Cancelled, or Rejected Spotlight listings', () => {
      expect(() => {
        validateSpotlightMove('Expired', 'Active', 'lead', true);
      }).toThrow("cannot be reactivated. Sellers must renew with a new reference");

      expect(() => {
        validateSpotlightMove('Cancelled', 'Active', 'lead', true);
      }).toThrow("cannot be reactivated");
    });
  });
});
