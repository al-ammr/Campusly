'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  HelpCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  AlertTriangle,
  ExternalLink,
  Lock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
} from 'lucide-react';

interface ReviewData {
  listing: any;
  meta: any;
  links: any[];
  attachments: any[];
  history: any[];
  duplicates: any[];
}

const REJECT_REASONS = [
  { value: 'COMMUNITY_GUIDELINE_VIOLATION', label: 'Breaches University Community Guidelines' },
  { value: 'INCOMPLETE_INFORMATION', label: 'Incomplete or Inaccurate Registry Data' },
  { value: 'COMMERCIAL_CONTENT_NOT_ALLOWED', label: 'Commercial Advertisement (Must use Spotlight)' },
  { value: 'OFFENSIVE_OR_HARMFUL', label: 'Inappropriate or Defamatory Content' },
  { value: 'DUPLICATE_SUBMISSION', label: 'Duplicate Entry Already Registered' },
  { value: 'IMPERSONATION', label: 'Unauthorized Impersonation of Campus Body' },
];

export default function AdminReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const [data, setData] = React.useState<ReviewData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  // Modals state
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState(REJECT_REASONS[0].value);
  const [decisionNote, setDecisionNote] = React.useState('');

  const [showNeedsInfoModal, setShowNeedsInfoModal] = React.useState(false);
  const [needsInfoNote, setNeedsInfoNote] = React.useState('');

  const [showPreviewModal, setShowPreviewModal] = React.useState(false);

  const loadDetails = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/review/${listingId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setActionError('Failed to fetch listing review data.');
      }
    } catch {
      setActionError('Network error loading review data.');
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  React.useEffect(() => {
    if (listingId) loadDetails();
  }, [listingId, loadDetails]);

  const handleDecision = async (action: string, note?: string, reason?: string) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/v1/admin/review/${listingId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({ action, note, reason }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setActionError(resData.error || resData.message || 'Action failed.');
        return;
      }

      // Close open modals and refresh
      setShowRejectModal(false);
      setShowNeedsInfoModal(false);
      await loadDetails();
    } catch {
      setActionError('Failed to record decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-muted">Loading submission details and verification artifacts...</p>
      </div>
    );
  }

  if (!data || !data.listing) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-danger mx-auto" />
        <h2 className="text-base font-bold text-ink dark:text-ink-dark">Submission Not Found</h2>
        <Link href="/admin/review" className="text-xs text-accent hover:underline">
          Return to Review Queue
        </Link>
      </div>
    );
  }

  const { listing, meta, links, attachments, history, duplicates } = data;
  const isCommunity = listing.kind === 'community';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Back & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-border-dark/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/review"
            className="p-2 rounded-lg border border-border hover:bg-surface-raised transition-colors text-ink-muted hover:text-ink"
            title="Back to Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-surface-raised border border-border uppercase">
                {listing.kind}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-accent/15 text-accent border border-accent/20">
                {listing.status}
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-ink-dark mt-1">
              {listing.title}
            </h1>
          </div>
        </div>

        {/* Public Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border hover:bg-surface-raised text-xs font-semibold cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-accent" />
          <span>Public Preview (UI-326)</span>
        </button>
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
          {actionError}
        </div>
      )}

      {/* Duplicate Hints Banner */}
      {duplicates && duplicates.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Potential Duplicate Submissions Detected ({duplicates.length})</span>
          </div>
          <p className="text-[11px] opacity-90">
            Similar titles or matching slugs exist in registry. Check for prior approvals:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {duplicates.map((dup) => (
              <li key={dup.id}>
                <Link href={`/admin/review/${dup.id}`} className="underline font-medium hover:text-amber-700">
                  {dup.title}
                </Link>{' '}
                — Status: <span className="font-mono">{dup.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Grid: Details + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-xs uppercase font-mono tracking-wider text-ink-muted mb-1.5">
                Official Summary
              </h2>
              <p className="text-sm font-medium text-ink dark:text-ink-dark leading-relaxed">
                {listing.summary}
              </p>
            </div>

            <div>
              <h2 className="text-xs uppercase font-mono tracking-wider text-ink-muted mb-1.5">
                Full Registry Description
              </h2>
              <div className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed whitespace-pre-line p-3 rounded-lg bg-sand-light/40 dark:bg-surface-raised-dark border border-border/50">
                {listing.description || 'No extended description provided.'}
              </div>
            </div>

            {/* Contextual Kind Metadata */}
            {meta && (
              <div className="pt-4 border-t border-border/60 dark:border-border-dark/60 space-y-3">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-ink dark:text-ink-dark">
                  Specific Specification Metadata
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {isCommunity && (
                    <>
                      {meta.meeting_schedule && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Meeting Schedule</span>
                          <span className="font-medium text-ink">{meta.meeting_schedule}</span>
                        </div>
                      )}
                      {meta.location && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Meeting Venue</span>
                          <span className="font-medium text-ink">{meta.location}</span>
                        </div>
                      )}
                      {meta.dues_kobo !== undefined && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Membership Dues</span>
                          <span className="font-medium text-ink">
                            {meta.dues_kobo === 0 ? 'Free (No dues)' : `₦${(meta.dues_kobo / 100).toLocaleString()}`}
                          </span>
                        </div>
                      )}
                      {meta.contact_email && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Leadership Contact</span>
                          <span className="font-medium text-ink">{meta.contact_email}</span>
                        </div>
                      )}
                    </>
                  )}

                  {listing.kind === 'event' && (
                    <>
                      <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                        <span className="text-[10px] text-ink-muted block font-mono">Starts At</span>
                        <span className="font-medium text-ink">
                          {meta.starts_at ? new Date(meta.starts_at).toLocaleString('en-NG') : '—'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                        <span className="text-[10px] text-ink-muted block font-mono">Ends At</span>
                        <span className="font-medium text-ink">
                          {meta.ends_at ? new Date(meta.ends_at).toLocaleString('en-NG') : '—'}
                        </span>
                      </div>
                      {meta.venue && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60 sm:col-span-2">
                          <span className="text-[10px] text-ink-muted block font-mono">Venue / Hall</span>
                          <span className="font-medium text-ink">{meta.venue}</span>
                        </div>
                      )}
                    </>
                  )}

                  {listing.kind === 'opportunity' && (
                    <>
                      {meta.provider && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Provider Body</span>
                          <span className="font-medium text-ink">{meta.provider}</span>
                        </div>
                      )}
                      {meta.deadline && (
                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60">
                          <span className="text-[10px] text-ink-muted block font-mono">Application Deadline</span>
                          <span className="font-medium text-ink">
                            {new Date(meta.deadline).toLocaleDateString('en-NG')}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Verification Attachments (SEC-220) */}
          <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                Submitted Evidence &amp; Attachments
              </h2>
              <span className="text-[10px] text-ink-muted font-mono">Private 5m Signed Access</span>
            </div>

            {attachments.length === 0 ? (
              <p className="text-xs text-ink-muted py-3">No attachments uploaded with this submission.</p>
            ) : (
              <div className="divide-y divide-border/50 border border-border/50 rounded-lg overflow-hidden">
                {attachments.map((file) => (
                  <div key={file.id} className="p-3 flex items-center justify-between text-xs hover:bg-surface-raised">
                    <div>
                      <span className="font-medium text-ink block">{file.original_name}</span>
                      <span className="text-[10px] text-ink-muted font-mono">
                        {file.mime_type} • {(file.size_bytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <a
                      href={`/api/v1/uploads/presign?key=${encodeURIComponent(file.storage_key)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sand-light dark:bg-sand-light-dark border border-border text-[11px] font-semibold hover:bg-surface"
                    >
                      <Lock className="w-3 h-3 text-cypress-green" />
                      <span>Inspect</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Timeline & Audit History */}
        <div className="space-y-6">
          <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              Status Audit History
            </h2>

            {history.length === 0 ? (
              <p className="text-xs text-ink-muted py-2">No prior status transitions.</p>
            ) : (
              <div className="space-y-3 relative pl-4 border-l border-border/70 dark:border-border-dark/70">
                {history.map((h) => (
                  <div key={h.id} className="relative text-xs space-y-1">
                    <div className="w-2 h-2 rounded-full bg-accent absolute -left-[21px] top-1" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-ink">{h.to_status}</span>
                      <span className="text-[10px] text-ink-muted font-mono">
                        {new Date(h.at).toLocaleDateString('en-NG')}
                      </span>
                    </div>
                    {h.note && (
                      <p className="text-[11px] text-ink-muted bg-surface-raised p-2 rounded border border-border/50">
                        {h.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM DECISION ACTION BAR (BP-11) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-border/80 dark:border-border-dark/80 shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-muted">Action target:</span>
            <span className="font-serif font-bold text-ink dark:text-ink-dark">{listing.title}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-raised border">
              Current: {listing.status}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Needs Info Action */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowNeedsInfoModal(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-600/20 text-xs font-semibold hover:bg-blue-600/20 transition-colors cursor-pointer"
            >
              Needs Info
            </button>

            {/* Reject Action */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowRejectModal(true)}
              className="px-3.5 py-2 rounded-lg bg-rose-600/10 text-rose-700 dark:text-rose-300 border border-rose-600/20 text-xs font-semibold hover:bg-rose-600/20 transition-colors cursor-pointer"
            >
              Reject
            </button>

            {/* Verify Action (Communities only per BR-003) */}
            {isCommunity && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecision('verify')}
                className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Community</span>
              </button>
            )}

            {/* Approve Action */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('approve')}
              className="px-4 py-2 rounded-lg bg-cypress-green dark:bg-cypress-green-dark text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve Listing</span>
            </button>

            {/* Overrides dropdown / secondary */}
            {listing.status === 'Approved' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecision('hide', 'Administrative hide')}
                className="px-3 py-2 rounded-lg border border-border text-xs text-ink-muted hover:text-ink cursor-pointer"
              >
                Hide
              </button>
            )}
            {listing.status === 'Hidden' && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecision('restore', 'Administrative restore')}
                className="px-3 py-2 rounded-lg border border-border text-xs text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
              >
                Restore
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface dark:bg-surface-dark border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-ink dark:text-ink-dark flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Reject Listing Submission
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Standardized rejection reason is recorded in audit logs and communicated to the student submitter.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Standard Reason (D07)</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-surface-raised text-ink text-xs focus:ring-1 focus:ring-accent"
                >
                  {REJECT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Specific Audit Note (Optional)</label>
                <textarea
                  rows={3}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Additional context or remediation instructions..."
                  className="w-full p-2 rounded-lg border border-border bg-surface-raised text-ink text-xs focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDecision('reject', decisionNote, rejectReason)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Needs Info Modal */}
      {showNeedsInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface dark:bg-surface-dark border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-ink dark:text-ink-dark flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Request Additional Information
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Moves listing to &ldquo;Needs info&rdquo; status and notifies submitter via tracking timeline.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Inquiry Question for Submitter</label>
                <textarea
                  rows={4}
                  required
                  value={needsInfoNote}
                  onChange={(e) => setNeedsInfoNote(e.target.value)}
                  placeholder="e.g. Please clarify meeting hall permission or attach executive endorsement letter..."
                  className="w-full p-2.5 rounded-lg border border-border bg-surface-raised text-ink text-xs focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNeedsInfoModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || !needsInfoNote.trim()}
                onClick={() => handleDecision('needs_info', needsInfoNote)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Preview Modal (D03 UI-326) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-surface dark:bg-surface-dark border border-border rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                <h3 className="font-serif font-bold text-base">Public Display Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-ink-muted hover:text-ink text-xs font-semibold px-2 py-1 rounded border border-border cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            {/* Mocked Public Card */}
            <div className="p-5 rounded-xl border border-border/80 bg-sand-light/40 dark:bg-canvas-dark space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-accent/20 text-accent uppercase">
                  {listing.category_name || 'Campus Activity'}
                </span>
                <span className="text-[11px] font-mono text-ink-muted">Ahmadu Bello University</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">{listing.title}</h2>
              <p className="text-xs text-ink-muted leading-relaxed">{listing.summary}</p>
            </div>

            <p className="text-[11px] text-ink-muted text-center">
              This preview matches the student-facing catalog card upon approval.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
