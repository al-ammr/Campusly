'use client';

import * as React from 'react';
import Link from 'next/link';
import { Flag, ShieldAlert, CheckCircle, Eye, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

interface ReportQueueItem {
  id: string;
  title: string;
  kind: string;
  status: string;
  total_reports: number;
  distinct_device_reports: number;
  reasons: string[];
  latest_report_at: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = React.useState<ReportQueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.items || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (listingId: string, action: 'dismiss' | 'hide' | 'restore') => {
    setProcessingId(listingId);
    try {
      const res = await fetch(`/api/v1/admin/reports/${listingId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchReports();
      }
    } catch {
      // Error
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: '#E0D7C6' }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: '#2D1810' }}>
            <Flag className="w-5 h-5" style={{ color: '#7C4A27' }} />
            Moderation Reports
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#8C7364' }}>
            Flagged listings queue — automatic hiding triggers after multiple distinct device reports.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
          style={{ borderColor: '#E0D7C6', color: '#6B5344', background: '#FFFFF0' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-ink-muted space-y-2">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Scanning flagged content...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-ink-muted space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
            <p className="font-semibold text-ink dark:text-ink-dark">No open reports</p>
            <p>Campus listings are operating cleanly without flagged violations.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60 dark:divide-border-dark/60">
            {reports.map((item) => {
              const isAutoHidden = item.status === 'Hidden';
              const highSeverity = item.distinct_device_reports >= 3;

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sand-light/20 dark:hover:bg-surface-raised/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-sm text-ink dark:text-ink-dark">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-surface-raised border">
                        {item.kind}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                          isAutoHidden
                            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                      {highSeverity && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-600 text-white flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Auto-Hide Threshold Exceeded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-muted">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {item.distinct_device_reports} distinct student devices
                      </span>
                      <span>•</span>
                      <span>{item.total_reports} total flags</span>
                      <span>•</span>
                      <span>Latest: {new Date(item.latest_report_at).toLocaleString('en-NG')}</span>
                    </div>

                    {/* Reported Reasons */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-ink-muted">Reported as:</span>
                      {item.reasons.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised border border-border/80 text-ink"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/admin/review/${item.id}`}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-surface-raised font-medium text-ink flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Link>

                    {item.status !== 'Hidden' ? (
                      <button
                        type="button"
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item.id, 'hide')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Quarantine &amp; Hide
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={processingId === item.id}
                        onClick={() => handleAction(item.id, 'restore')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Restore Listing
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-raised text-xs text-ink-muted hover:text-ink cursor-pointer"
                    >
                      Dismiss Reports
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
