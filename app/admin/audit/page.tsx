'use client';

import * as React from 'react';
import { ScrollText, RefreshCw, Shield, Search, ArrowUpDown } from 'lucide-react';

interface AuditItem {
  id: string;
  action: string;
  object_type: string;
  object_id: string | null;
  admin_email: string | null;
  admin_role: string | null;
  before: any;
  after: any;
  ip_hash: string;
  at: string;
}

export default function AdminAuditPage() {
  const [items, setItems] = React.useState<AuditItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const loadAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/audit');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAudit();
  }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.action.toLowerCase().includes(q) ||
      item.object_type.toLowerCase().includes(q) ||
      (item.admin_email && item.admin_email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-border-dark/80 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-ink-dark flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-accent" />
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Cryptographically sealed activity log per D05 Section 6 &amp; D08 SEC-101 to SEC-112.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter actions or admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface-raised dark:bg-surface-raised-dark text-ink focus:outline-none focus:ring-1 focus:ring-accent w-48 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={loadAudit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-surface-raised text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-light/50 dark:bg-surface-raised-dark text-ink-muted uppercase tracking-wider font-mono border-b border-border/60">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor / Admin</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Object</th>
                <th className="px-4 py-3">IP Fingerprint</th>
                <th className="px-4 py-3">State Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-border-dark/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-ink-muted text-xs">
                    {loading ? 'Reading immutable audit rows...' : 'No audit entries match filter.'}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-sand-light/20 dark:hover:bg-surface-raised/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-ink-muted">
                      {new Date(item.at).toLocaleString('en-NG')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-ink dark:text-ink-dark">
                          {item.admin_email || 'System Daemon'}
                        </span>
                        {item.admin_role && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-accent/15 text-accent uppercase">
                            {item.admin_role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-raised border border-border/60 font-semibold text-cypress-green dark:text-cypress-green-dark">
                        {item.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      <span className="font-medium text-ink">{item.object_type}</span>
                      {item.object_id && (
                        <span className="font-mono text-[10px] ml-1.5 text-ink-muted">
                          {item.object_id.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[10px] text-ink-muted">
                      {item.ip_hash.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-[11px] max-w-xs truncate text-ink-muted font-mono">
                      {item.after ? JSON.stringify(item.after) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
