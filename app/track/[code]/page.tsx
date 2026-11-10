'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { EmptyState } from '@/components/ui/empty-state';

export default function TrackDetailPage() {
  const params = useParams();
  const rawCode = (params?.code as string) || '';
  const code = rawCode.trim().toUpperCase();

  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [statusData, setStatusData] = React.useState<any | null>(null);
  const [errorNotFound, setErrorNotFound] = React.useState(false);

  // Reply Form State
  const [replyMessage, setReplyMessage] = React.useState('');
  const [sendingReply, setSendingReply] = React.useState(false);

  const fetchStatus = React.useCallback(() => {
    setLoading(true);
    fetch(`/api/v1/track/${code}`)
      .then((res) => {
        if (!res.ok) {
          setErrorNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.data) {
          setStatusData(json.data);
          setErrorNotFound(false);
        }
      })
      .catch(() => {
        setErrorNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  React.useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/v1/track/${code}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        showToast({ type: 'success', message: 'Reply sent! Your submission has been returned to the review queue.' });
        setReplyMessage('');
        fetchStatus();
      } else {
        showToast({
          type: 'error',
          message: json.error?.message || 'Could not send reply.',
        });
      }
    } catch {
      showToast({ type: 'error', message: 'Network error sending reply.' });
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-ink-muted dark:text-ink-muted-dark">
        <p>Loading submission status...</p>
      </div>
    );
  }

  if (errorNotFound || !statusData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <EmptyState
          title="Submission Not Found"
          description="We could not find a submission with that tracking code. Please double check the code or submit a new listing."
          actionLabel="Try another code"
          actionHref="/track"
        />
      </div>
    );
  }

  const isNeedsInfo = statusData.status === 'needs_info';
  const isApproved = statusData.status === 'approved' || statusData.status === 'verified';
  const isRejected = statusData.status === 'rejected';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <Link
          href="/track"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand dark:text-brand-dark hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Track Another Submission</span>
        </Link>
      </nav>

      {/* Main Status Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-ink dark:text-ink-dark px-3 py-1 rounded-xl bg-surface-container dark:bg-surface-dark border border-border dark:border-border-dark">
            {statusData.tracking_code}
          </span>
          <Badge
            variant={
              isApproved ? 'verified' : isRejected ? 'rejected' : isNeedsInfo ? 'needs-info' : 'pending'
            }
          >
            {statusData.label}
          </Badge>
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
            {statusData.title}
          </h1>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-brand-dark capitalize">
            {statusData.kind}
          </span>
        </div>

        {/* Current status note */}
        <div className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark space-y-1">
          <span className="text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider block">
            Current Status
          </span>
          <p className="text-xs sm:text-sm text-ink dark:text-ink-dark font-medium leading-relaxed">
            {statusData.next_step}
          </p>
        </div>

        {/* Feedback from Reviewer if rejected or needs info */}
        {statusData.reason && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-ink dark:text-ink-dark space-y-1">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block">
              Feedback from Reviewer
            </span>
            <p className="text-xs sm:text-sm leading-relaxed">{statusData.reason.text}</p>
          </div>
        )}

        {/* Reply Window Countdown */}
        {isNeedsInfo && statusData.reply_until && (
          <div className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Please reply before{' '}
            <strong className="text-ink dark:text-ink-dark">
              {new Date(statusData.reply_until).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </strong>
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isNeedsInfo && (
        <form
          onSubmit={handleSendReply}
          className="rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-8 flex flex-col gap-4 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand dark:text-brand-dark" strokeWidth={2} />
            <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
              Reply to Reviewer
            </h2>
          </div>
          <Textarea
            label="Your Message"
            placeholder="Type your response or clarification here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={4}
            required
            helperText="Sending a reply automatically sends your submission back to the review queue."
          />
          <Button
            type="submit"
            variant="primary"
            disabled={sendingReply || !replyMessage.trim()}
          >
            {sendingReply ? 'Sending reply...' : 'Send reply to reviewer'}
          </Button>
        </form>
      )}
    </div>
  );
}
