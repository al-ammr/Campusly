'use client';

import * as React from 'react';
import {
  BarChart3,
  Download,
  Search,
  Users,
  Calendar,
  CreditCard,
  ClipboardCheck,
  TrendingUp,
  RefreshCw,
  Gauge,
} from 'lucide-react';

interface MetricsPayload {
  summary: {
    activeCommunities: number;
    activeEvents: number;
    activeOpportunities: number;
    pendingReviews: number;
    openReports: number;
    spotlightRevenueKobo: number;
  };
  zeroResultQueries: Array<{ query: string; searches: number; lastSearchedAt: string }>;
  funnel: {
    directoryViews: number;
    detailViews: number;
    contactClicks: number;
    starsCast: number;
  };
  webVitals: {
    lcp: { good: number; needsImprovement: number; poor: number };
    inp: { good: number; needsImprovement: number; poor: number };
    cls: { good: number; needsImprovement: number; poor: number };
  };
  dateRange: string;
}

const BROWN = {
  dark: '#2D1810',
  mid: '#4A2E1B',
  accent: '#7C4A27',
  caramel: '#D4A373',
  muted: '#6B5344',
  placeholder: '#8C7364',
  ivory: '#FFFFF0',
  inputBg: '#F7F4EB',
  border: '#E0D7C6',
  canvas: '#F5F0E8',
};

export default function AdminMetricsPage() {
  const [data, setData] = React.useState<MetricsPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [range, setRange] = React.useState('30d');

  const fetchMetrics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/metrics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.metrics);
      }
    } catch {
      // Network error — show empty state
    } finally {
      setLoading(false);
    }
  }, [range]);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const noData = !data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: BROWN.border }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: BROWN.dark }}>
            <BarChart3 className="w-5 h-5" style={{ color: BROWN.accent }} />
            Analytics
          </h1>
          <p className="text-xs mt-0.5" style={{ color: BROWN.placeholder }}>
            Real-time metrics and engagement data for the Campusly directory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Range Selector */}
          <div
            className="flex items-center rounded-lg border p-0.5 text-xs font-mono"
            style={{ borderColor: BROWN.border, background: BROWN.ivory }}
          >
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className="px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                style={
                  range === r
                    ? { background: BROWN.mid, color: BROWN.ivory, fontWeight: 700 }
                    : { color: BROWN.muted }
                }
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={`/api/v1/admin/metrics?range=${range}&export=csv`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors hover:opacity-80"
            style={{ borderColor: BROWN.border, color: BROWN.muted, background: BROWN.ivory }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: BROWN.accent }} />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={fetchMetrics}
            disabled={loading}
            className="p-1.5 rounded-lg border cursor-pointer transition-colors hover:opacity-70"
            style={{ borderColor: BROWN.border, color: BROWN.muted, background: BROWN.ivory }}
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: BROWN.accent, borderTopColor: 'transparent' }}
          />
          <p className="text-xs" style={{ color: BROWN.placeholder }}>Loading analytics...</p>
        </div>
      ) : noData ? (
        /* ── EMPTY STATE: no analytics data yet ── */
        <div className="py-24 text-center space-y-4">
          <BarChart3 className="w-10 h-10 mx-auto opacity-30" style={{ color: BROWN.accent }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: BROWN.dark }}>No analytics data yet</p>
            <p className="text-xs mt-1" style={{ color: BROWN.placeholder }}>
              Metrics will appear here once the platform receives real user activity.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Active Communities',
                value: data.summary.activeCommunities,
                sub: 'Approved & verified',
                Icon: Users,
              },
              {
                label: 'Live Events & Opps',
                value: data.summary.activeEvents + data.summary.activeOpportunities,
                sub: `${data.summary.activeEvents} events · ${data.summary.activeOpportunities} opportunities`,
                Icon: Calendar,
              },
              {
                label: 'Spotlight Revenue',
                value: `₦${(data.summary.spotlightRevenueKobo / 100).toLocaleString('en-NG')}`,
                sub: 'Cleared bank revenue',
                Icon: CreditCard,
              },
              {
                label: 'Review Workload',
                value: data.summary.pendingReviews,
                sub: `${data.summary.openReports} flagged reports open`,
                Icon: ClipboardCheck,
              },
            ].map(({ label, value, sub, Icon }) => (
              <div
                key={label}
                className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-1 cursor-default"
                style={{ background: BROWN.ivory, borderColor: BROWN.border }}
              >
                <div className="flex items-center justify-between" style={{ color: BROWN.muted }}>
                  <span className="text-[10px] font-mono uppercase font-semibold">{label}</span>
                  <Icon className="w-4 h-4" style={{ color: BROWN.accent }} />
                </div>
                <div className="font-bold text-2xl" style={{ color: BROWN.dark }}>
                  {value}
                </div>
                <span className="text-[10px] font-mono" style={{ color: BROWN.placeholder }}>{sub}</span>
              </div>
            ))}
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zero-Result Queries */}
            <div className="rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 space-y-4" style={{ background: BROWN.ivory, borderColor: BROWN.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base flex items-center gap-2" style={{ color: BROWN.dark }}>
                    <Search className="w-4 h-4" style={{ color: BROWN.accent }} />
                    Unmet Campus Interests
                  </h2>
                  <p className="text-[11px] mt-0.5" style={{ color: BROWN.placeholder }}>
                    Top queries returning zero results — guides future club recruitment.
                  </p>
                </div>
              </div>

              {data.zeroResultQueries.length === 0 ? (
                <div className="py-8 text-center text-xs" style={{ color: BROWN.placeholder }}>
                  <Search className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: BROWN.accent }} />
                  No zero-result queries recorded yet.
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: BROWN.border }}>
                  {data.zeroResultQueries.map((item, index) => (
                    <div key={item.query} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-bold w-5" style={{ color: BROWN.placeholder }}>
                          {index + 1}
                        </span>
                        <span className="font-medium" style={{ color: BROWN.dark }}>
                          &ldquo;{item.query}&rdquo;
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold" style={{ color: BROWN.accent }}>
                        {item.searches} students
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Funnel */}
            <div className="rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 space-y-4" style={{ background: BROWN.ivory, borderColor: BROWN.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base flex items-center gap-2" style={{ color: BROWN.dark }}>
                    <TrendingUp className="w-4 h-4" style={{ color: BROWN.accent }} />
                    Student Discovery Funnel
                  </h2>
                  <p className="text-[11px] mt-0.5" style={{ color: BROWN.placeholder }}>
                    Conversion from browsing to active engagement.
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{ background: BROWN.inputBg, borderColor: BROWN.border, color: BROWN.muted }}
                >
                  {range.toUpperCase()}
                </span>
              </div>

              {data.funnel.directoryViews === 0 ? (
                <div className="py-8 text-center text-xs" style={{ color: BROWN.placeholder }}>
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: BROWN.accent }} />
                  No funnel data recorded yet.
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Catalog Impressions', count: data.funnel.directoryViews, percent: 100 },
                    { label: 'Profile Reads', count: data.funnel.detailViews, percent: data.funnel.directoryViews > 0 ? Math.round((data.funnel.detailViews / data.funnel.directoryViews) * 100) : 0 },
                    { label: 'Contact Clicks', count: data.funnel.contactClicks, percent: data.funnel.directoryViews > 0 ? Math.round((data.funnel.contactClicks / data.funnel.directoryViews) * 100) : 0 },
                    { label: 'Stars Cast', count: data.funnel.starsCast, percent: data.funnel.directoryViews > 0 ? Math.round((data.funnel.starsCast / data.funnel.directoryViews) * 100) : 0 },
                  ].map((stage) => (
                    <div key={stage.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium" style={{ color: BROWN.dark }}>{stage.label}</span>
                        <span className="font-mono" style={{ color: BROWN.muted }}>
                          {stage.count.toLocaleString()} ({stage.percent}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: BROWN.inputBg }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${stage.percent}%`, background: BROWN.mid }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Web Vitals */}
          <div className="rounded-2xl p-6 border shadow-md hover:shadow-lg transition-all duration-300 space-y-4" style={{ background: BROWN.ivory, borderColor: BROWN.border }}>
            <h2 className="font-bold text-base flex items-center gap-2" style={{ color: BROWN.dark }}>
              <Gauge className="w-4 h-4" style={{ color: BROWN.accent }} />
              Core Web Vitals
            </h2>

            {[data.webVitals.lcp, data.webVitals.inp, data.webVitals.cls].every(
              (v) => v.good === 0 && v.needsImprovement === 0 && v.poor === 0
            ) ? (
              <div className="py-8 text-center text-xs" style={{ color: BROWN.placeholder }}>
                <Gauge className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: BROWN.accent }} />
                No web vitals data collected yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {[
                  { name: 'Largest Contentful Paint', target: '< 2.5s', metric: data.webVitals.lcp },
                  { name: 'Interaction to Next Paint', target: '< 200ms', metric: data.webVitals.inp },
                  { name: 'Cumulative Layout Shift', target: '< 0.1', metric: data.webVitals.cls },
                ].map((v) => (
                  <div
                    key={v.name}
                    className="p-4 rounded-lg border space-y-2"
                    style={{ background: BROWN.inputBg, borderColor: BROWN.border }}
                  >
                    <div className="flex justify-between font-medium">
                      <span style={{ color: BROWN.dark }}>{v.name}</span>
                      <span className="font-mono" style={{ color: BROWN.placeholder }}>{v.target}</span>
                    </div>

                    <div className="h-3 rounded-full flex overflow-hidden">
                      <div style={{ width: `${v.metric.good}%` }} className="bg-emerald-500" title="Good" />
                      <div style={{ width: `${v.metric.needsImprovement}%` }} className="bg-amber-400" title="Needs Improvement" />
                      <div style={{ width: `${v.metric.poor}%` }} className="bg-rose-500" title="Poor" />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-emerald-600 font-bold">{v.metric.good}% Good</span>
                      <span style={{ color: BROWN.placeholder }}>{v.metric.needsImprovement}% Needs Imp.</span>
                      <span className="text-rose-600">{v.metric.poor}% Poor</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
