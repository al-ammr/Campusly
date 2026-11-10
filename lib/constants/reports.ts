export const VALID_REPORT_REASONS = [
  'spam',
  'wrong_info',
  'inappropriate',
  'scam',
  'other',
] as const;

export type ReportReason = (typeof VALID_REPORT_REASONS)[number];
