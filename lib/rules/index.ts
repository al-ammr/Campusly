import * as crypto from 'crypto';

/**
 * Non-ambiguous character set for tracking codes and payment references.
 * Excludes look-alikes: 0/O, 1/I/L, 8/B (D07 BR-013, BR-140, D08 SEC-130).
 * Total 26 distinct, readable characters.
 */
export const SAFE_CODE_CHARS = '2345679ACDEFGHJKMNPQRSTUVWXYZ';

/**
 * BR-001 / BR-002: Public visibility by status.
 * Only Approved and Verified listings are publicly discoverable.
 */
export function isListingPubliclyVisible(status: string): boolean {
  return status === 'Approved' || status === 'Verified';
}

/**
 * BR-120 to BR-126: Spotlight public visibility.
 * Spotlight listings are public strictly when Active.
 */
export function isSpotlightPubliclyVisible(status: string): boolean {
  return status === 'Active';
}

/**
 * BR-055: Closing Soon Evaluation.
 * An opportunity shows "Closing soon" when its deadline is within the closing soon window.
 */
export function isOpportunityClosingSoon(
  deadlineAt: Date | string | null | undefined,
  now: Date = new Date(),
  windowDays: number = 7
): boolean {
  if (!deadlineAt) return false;
  const deadline = typeof deadlineAt === 'string' ? new Date(deadlineAt) : deadlineAt;
  const nowMs = now.getTime();
  const deadlineMs = deadline.getTime();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  return deadlineMs > nowMs && deadlineMs - nowMs <= windowMs;
}

/**
 * BR-050 / BR-051: Event vs Opportunity classification.
 */
export function classifyListingKind(input: {
  startsAt?: Date | string | null;
  deadlineAt?: Date | string | null;
  isRolling?: boolean;
}): 'event' | 'opportunity' {
  if (input.startsAt) {
    return 'event';
  }
  if (input.deadlineAt || input.isRolling) {
    return 'opportunity';
  }
  return 'event';
}

/**
 * BR-052: Default Event length calculation.
 * Ends 3 hours after start when no end time is specified.
 */
export function calculateEventEndTime(
  startsAt: Date | string,
  endsAt?: Date | string | null,
  defaultLengthHours: number = 3
): Date {
  if (endsAt) {
    return typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
  }
  const start = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  return new Date(start.getTime() + defaultLengthHours * 60 * 60 * 1000);
}

/**
 * BR-057: Rolling Opportunity Review Date.
 * Re-checked every 60 days.
 */
export function calculateRollingReviewDate(
  lastReviewedAt: Date | string,
  rollingReviewDays: number = 60
): Date {
  const last = typeof lastReviewedAt === 'string' ? new Date(lastReviewedAt) : lastReviewedAt;
  return new Date(last.getTime() + rollingReviewDays * 24 * 60 * 60 * 1000);
}

/**
 * Helper to generate random string from safe character set.
 */
function getRandomSafeChars(length: number): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SAFE_CODE_CHARS[bytes[i] % SAFE_CODE_CHARS.length];
  }
  return result;
}

/**
 * BR-013: Tracking Code Generation.
 * Format: CY-XXXX-XXXX (random, not sequential, look-alike free).
 */
export function generateTrackingCode(): string {
  return `CY-${getRandomSafeChars(4)}-${getRandomSafeChars(4)}`;
}

/**
 * BR-140: Spotlight Payment Reference Generation.
 * Format: SP-XXXX-XXXX (random, not sequential, look-alike free).
 */
export function generateSpotlightReference(): string {
  return `SP-${getRandomSafeChars(4)}-${getRandomSafeChars(4)}`;
}

export interface RankableListing {
  id: string;
  starCount: number;
  starCountReachedAt: Date | string;
  activatedAt?: Date | string | null;
  createdAt?: Date | string;
}

/**
 * BR-204 / BR-205: Star Ranking & Tie-Break Ordering.
 * 1. Star count descending.
 * 2. With stars: earlier reached date ranks higher (starCountReachedAt ascending).
 * 3. Zero stars: newer activation/creation ranks higher (activatedAt/createdAt descending).
 */
export function rankListings<T extends RankableListing>(listings: T[]): T[] {
  return [...listings].sort((a, b) => {
    // 1. Star count descending
    if (b.starCount !== a.starCount) {
      return b.starCount - a.starCount;
    }

    // 2. Tie-break for listings with stars: earlier reached ranks higher
    if (a.starCount > 0) {
      const aTime = new Date(a.starCountReachedAt).getTime();
      const bTime = new Date(b.starCountReachedAt).getTime();
      return aTime - bTime;
    }

    // 3. Tie-break for zero stars: newest first
    const aCreated = new Date(a.activatedAt || a.createdAt || 0).getTime();
    const bCreated = new Date(b.activatedAt || b.createdAt || 0).getTime();
    return bCreated - aCreated;
  });
}

/**
 * BR-227: Featured Strip Rotation Seed.
 * Rotation hours chunk calculation from epoch.
 */
export function getFeaturedRotationSeed(
  rotationHours: number = 6,
  now: Date = new Date()
): number {
  const epochHours = Math.floor(now.getTime() / (1000 * 60 * 60));
  return Math.floor(epochHours / rotationHours);
}

/**
 * BR-101 / BR-160: Spotlight Expiry Calculation.
 */
export function calculateSpotlightExpiry(
  startsAt: Date | string,
  planDays: number
): Date {
  const start = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  return new Date(start.getTime() + planDays * 24 * 60 * 60 * 1000);
}

export function isSpotlightExpired(
  endsAt: Date | string,
  now: Date = new Date()
): boolean {
  const end = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
  return now.getTime() >= end.getTime();
}

/**
 * BR-161: Spotlight Renewal Window Check.
 * Eligible for renewal within 24 hours before expiry and anytime after.
 */
export function isSpotlightInRenewalWindow(
  endsAt: Date | string,
  renewalHours: number = 24,
  now: Date = new Date()
): boolean {
  const end = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
  const nowMs = now.getTime();
  const endMs = end.getTime();
  const windowMs = renewalHours * 60 * 60 * 1000;

  // Within 24 hours before expiry OR already expired
  return nowMs >= endMs - windowMs;
}

/**
 * BR-147: Spotlight Refund Window Check.
 * Eligible for refund within 7 days of decision.
 */
export function isSpotlightInRefundWindow(
  decisionAt: Date | string,
  refundDays: number = 7,
  now: Date = new Date()
): boolean {
  const decision = typeof decisionAt === 'string' ? new Date(decisionAt) : decisionAt;
  const nowMs = now.getTime();
  const windowMs = refundDays * 24 * 60 * 60 * 1000;

  return nowMs - decision.getTime() <= windowMs;
}

/**
 * BR-103: Active Listing Cap Check.
 */
export function isListingCapReached(
  activeCount: number,
  cap: number = 3
): boolean {
  return activeCount >= cap;
}

/**
 * BR-045: Report Auto-Hide Evaluation.
 * Auto-hide if 3 or more distinct devices report within 7 days.
 */
export function shouldAutoHideListing(
  reports: Array<{ deviceId: string; createdAt: Date | string }>,
  threshold: number = 3,
  windowDays: number = 7,
  now: Date = new Date()
): boolean {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const cutoff = now.getTime() - windowMs;

  const distinctDevicesInWindow = new Set<string>();

  for (const report of reports) {
    const reportTime = new Date(report.createdAt).getTime();
    if (reportTime >= cutoff) {
      distinctDevicesInWindow.add(report.deviceId);
    }
  }

  return distinctDevicesInWindow.size >= threshold;
}
