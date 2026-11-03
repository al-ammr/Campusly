'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Banner } from '@/components/ui/banner';
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
        showToast({ type: 'success', message: 'Reply sent! Submission returned to review queue.' });
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
          description="We could not find a submission with tracking code. Please double check your code or submit a new listing."
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
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <Link
          href="/track"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; Track another submission
        </Link>
      </nav>

      {/* Main Status Card */}
      <div className="p-6 rounded-2xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark flex flex-col gap-5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold tracking-wider text-ink-muted dark:text-ink-muted-dark">
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

        <div>
          <h1 className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
            {statusData.title}
          </h1>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta dark:text-terracotta-dark capitalize">
            {statusData.kind}
          </span>
        </div>

        {/* Next step notice */}
        <div className="p-4 rounded-xl bg-sand-light dark:bg-sand-light-dark border border-sand-dark dark:border-sand-dark-dark">
          <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark block uppercase tracking-wider">
            Current Status Note
          </span>
          <p className="text-sm text-ink dark:text-ink-dark mt-1 font-medium">
            {statusData.next_step}
          </p>
        </div>

        {/* Reason details if Rejected or Needs info */}
        {statusData.reason && (
          <div className="p-4 rounded-xl bg-berry-red/10 dark:bg-berry-red-dark/15 border border-berry-red/20 text-ink dark:text-ink-dark">
            <span className="text-xs font-semibold text-berry-red dark:text-berry-red-dark block uppercase tracking-wider">
              Feedback from Reviewer
            </span>
            <p className="text-sm mt-1">{statusData.reason.text}</p>
          </div>
        )}

        {/* Reply Window Countdown for Needs info */}
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

      {/* Needs Info Interactive Reply Form */}
      {isNeedsInfo && (
        <form
          onSubmit={handleSendReply}
          className="p-6 rounded-2xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark flex flex-col gap-4"
        >
          <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
            Reply to Reviewer
          </h2>
          <Textarea
            label="Your Message"
            placeholder="Provide the requested information or clarification here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={4}
            required
            helperText="Sending a reply automatically moves your submission back to the Pending review queue."
          />
          <Button
            type="submit"
            variant="primary"
            disabled={sendingReply || !replyMessage.trim()}
          >
            {sendingReply ? 'Sending reply...' : 'Submit reply to reviewer'}
          </Button>
        </form>
      )}
    </div>
  );
}
