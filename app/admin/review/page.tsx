'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Search,
  ExternalLink,
  X,
  Inbox,
  MapPin,
  Building,
  Briefcase,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { DEFAULT_TOP_BUSINESSES } from '@/lib/showcase/defaults';
import { TopBusinessItem } from '@/lib/showcase/types';

// ============================================================================
// DATA TYPE DEFINITION
// ============================================================================
export interface DirectoryListingRecord {
  id: string;
  trackingCode: string;
  name: string;
  campus: string;
  location: string;
  category: string;
  studentRepContact: string;
  dateAdded: string;
  plan: 'free' | 'spotlight';
  status: 'Active' | 'Pending' | 'Needs Info';
  description: string;
  featuredOffer?: string;
  score?: number;
  reviewCount?: number;
  logoUrl?: string;
  whatsappUrl?: string;
}

// ============================================================================
// REAL SYSTEM DATA INJECTION POINT
// Convert the 10 real verified businesses into directory records.
// ============================================================================
function mapSystemBusinessesToRecords(items: TopBusinessItem[]): DirectoryListingRecord[] {
  return items.map((biz) => {
    let phone = 'Campus Directory Verified';
    if (biz.actionButton?.link) {
      const match = biz.actionButton.link.match(/wa\.me\/(\d+)/);
      if (match) {
        phone = `+${match[1]}`;
      }
    }

    const campus = biz.location.toLowerCase().includes('kongo')
      ? 'Kongo Campus'
      : biz.location.toLowerCase().includes('between samaru and kongo')
      ? 'Samaru & Kongo'
      : 'Samaru Campus';

    // Ranks 1 to 5 carry the active ₦5,000 Spotlight placement
    const isSpotlight = biz.rank <= 5;

    return {
      id: biz.id,
      trackingCode: biz.id.toUpperCase(),
      name: biz.name,
      campus,
      location: biz.location,
      category: biz.category,
      studentRepContact: phone,
      dateAdded: 'Active Record',
      plan: isSpotlight ? 'spotlight' : 'free',
      status: 'Active',
      description: biz.description,
      featuredOffer: biz.featuredOffer,
      score: biz.score,
      reviewCount: biz.reviewCount,
      logoUrl: biz.logoUrl,
      whatsappUrl: biz.actionButton?.link,
    };
  });
}

const PALETTE = {
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

export default function AdminDirectoryDashboard() {
  // DATA INJECTION POINT: Initialize with real system businesses (exactly 10 records)
  const [records, setRecords] = React.useState<DirectoryListingRecord[]>(() =>
    mapSystemBusinessesToRecords(DEFAULT_TOP_BUSINESSES)
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<
    'all' | 'business' | 'opportunities' | 'spotlight' | 'communities' | 'events' | 'pending' | 'verified'
  >('all');
  const [selectedRecord, setSelectedRecord] = React.useState<DirectoryListingRecord | null>(null);

  // --------------------------------------------------------------------------
  // STAT CARDS COMPUTATION (Reflects ACTUAL live state, 0 if empty)
  // --------------------------------------------------------------------------
  const stats = React.useMemo(() => {
    const totalCount = records.length;
    const pendingCount = records.filter((r) => r.status === 'Pending').length;
    const spotlightCount = records.filter((r) => r.plan === 'spotlight').length;
    // ₦5,000 per active spotlight subscription
    const spotlightRevenue = spotlightCount * 5000;

    // Detect distinct active campus coverage
    const uniqueCampuses = new Set(
      records.map((r) => (r.campus.includes('Kongo') ? 'Kongo' : 'Samaru'))
    );
    const campusesSynced = uniqueCampuses.size;

    return {
      total: totalCount,
      pending: pendingCount,
      revenue: spotlightRevenue,
      campuses: campusesSynced,
    };
  }, [records]);

  // --------------------------------------------------------------------------
  // FILTERING LOGIC
  // --------------------------------------------------------------------------
  const filteredRecords = React.useMemo(() => {
    return records.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.trackingCode.toLowerCase().includes(q) ||
        item.campus.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'business') return true; // All 10 existing records are verified campus businesses
      if (activeTab === 'opportunities') return false; // Real queue has 0 pending opportunities currently
      if (activeTab === 'spotlight') return item.plan === 'spotlight';
      if (activeTab === 'communities') return false;
      if (activeTab === 'events') return false;
      if (activeTab === 'pending') return item.status === 'Pending';
      if (activeTab === 'verified') return item.status === 'Active';
      return true;
    });
  }, [records, searchQuery, activeTab]);

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------
  const handleTogglePlan = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextPlan = r.plan === 'spotlight' ? 'free' : 'spotlight';
          return { ...r, plan: nextPlan };
        }
        return r;
      })
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) =>
        prev ? { ...prev, plan: prev.plan === 'spotlight' ? 'free' : 'spotlight' } : null
      );
    }
  };

  const handleUpdateStatus = (id: string, nextStatus: 'Active' | 'Pending' | 'Needs Info') => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          PAGE HEADER: Title & Description
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: PALETTE.border }}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: PALETTE.dark }}>
            Directory Submissions
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: PALETTE.placeholder }}>
            Central moderation queue for verified campus businesses, student societies, and spotlight listings across Samaru and Kongo.
          </p>
        </div>
      </div>

      {/* ========================================================
          FOUR FLOATING STAT CARDS WITH HOVER EFFECTS
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Directory */}
        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
          style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: PALETTE.muted }}>
              Total Directory
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.placeholder }}
            >
              Live data
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight" style={{ color: PALETTE.dark }}>
              {stats.total}
            </span>
            <span className="text-xs" style={{ color: PALETTE.muted }}>verified listings</span>
          </div>
        </div>

        {/* Pending Queue */}
        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
          style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: PALETTE.muted }}>
              Pending Queue
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.placeholder }}
            >
              Live data
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono tracking-tight`}
              style={{ color: stats.pending > 0 ? '#B45309' : PALETTE.dark }}
            >
              {stats.pending}
            </span>
            <span className="text-xs" style={{ color: PALETTE.muted }}>awaiting review</span>
          </div>
        </div>

        {/* Spotlight Revenue */}
        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
          style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: PALETTE.muted }}>
              Spotlight Revenue
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.placeholder }}
            >
              Live data
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight" style={{ color: PALETTE.dark }}>
              ₦{stats.revenue.toLocaleString('en-NG')}
            </span>
            <span className="text-xs" style={{ color: PALETTE.muted }}>active tier</span>
          </div>
        </div>

        {/* Campuses Synced */}
        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
          style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: PALETTE.muted }}>
              Campuses Synced
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.placeholder }}
            >
              Live data
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight" style={{ color: PALETTE.dark }}>
              {stats.campuses}
            </span>
            <span className="text-xs" style={{ color: PALETTE.muted }}>Samaru &amp; Kongo</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          FLOATING CARD CONTAINER: Search, Tabs & Semantic Table
         ======================================================== */}
      <div
        className="rounded-2xl border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
      >
        {/* Search Row */}
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: PALETTE.border }}>
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 pointer-events-none" style={{ color: PALETTE.placeholder }} />
            <input
              type="text"
              placeholder="Search by name, tracking code, or campus location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border focus:outline-hidden transition-colors"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.dark }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 hover:opacity-70 cursor-pointer"
                style={{ color: PALETTE.placeholder }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Result counter indicator */}
          <div className="text-xs flex items-center gap-1.5 self-end sm:self-auto" style={{ color: PALETTE.placeholder }}>
            <span>Displaying</span>
            <span className="font-semibold" style={{ color: PALETTE.dark }}>{filteredRecords.length}</span>
            <span>of</span>
            <span className="font-semibold" style={{ color: PALETTE.dark }}>{records.length}</span>
            <span>records</span>
          </div>
        </div>

        {/* Tab Filters (Includes 'business' and 'opportunities') */}
        <div
          className="px-4 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-b"
          style={{ borderColor: PALETTE.border, background: PALETTE.inputBg }}
        >
          {[
            { id: 'all', label: 'All Submissions', count: records.length },
            { id: 'business', label: 'Business', count: records.length },
            { id: 'opportunities', label: 'Opportunities', count: 0 },
            { id: 'spotlight', label: '₦5,000 Spotlight', count: records.filter((r) => r.plan === 'spotlight').length },
            { id: 'communities', label: 'Communities', count: 0 },
            { id: 'events', label: 'Events', count: 0 },
            { id: 'pending', label: 'Pending Review', count: records.filter((r) => r.status === 'Pending').length },
            { id: 'verified', label: 'Verified Active', count: records.filter((r) => r.status === 'Active').length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-2.5 px-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5
                `}
                style={
                  isActive
                    ? { borderColor: PALETTE.dark, color: PALETTE.dark, fontWeight: 700 }
                    : { borderColor: 'transparent', color: PALETTE.muted }
                }
              >
                <span>{tab.label}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                  style={
                    isActive
                      ? { background: PALETTE.dark, color: PALETTE.ivory }
                      : { background: PALETTE.ivory, color: PALETTE.placeholder, border: `1px solid ${PALETTE.border}` }
                  }
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            DATA TABLE: Production-grade semantic <table>
           ======================================================== */}
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead
                className="border-b uppercase tracking-wider font-semibold sticky top-0 z-10"
                style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.muted }}
              >
                <tr>
                  <th scope="col" className="py-3 px-4 w-28">Tracking Code</th>
                  <th scope="col" className="py-3 px-4 min-w-[220px]">Listing Name &amp; Campus</th>
                  <th scope="col" className="py-3 px-4 min-w-[200px]">Category &amp; Student Rep</th>
                  <th scope="col" className="py-3 px-4 w-28">Date</th>
                  <th scope="col" className="py-3 px-4 w-28">Plan / Tier</th>
                  <th scope="col" className="py-3 px-4 w-28">Status</th>
                  <th scope="col" className="py-3 px-4 w-20 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: PALETTE.border }}>
                {filteredRecords.map((item) => {
                  const isSelected = selectedRecord?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecord(item)}
                      className="transition-colors cursor-pointer hover:opacity-90"
                      style={
                        isSelected
                          ? { background: '#F0EAD6' }
                          : { background: 'transparent' }
                      }
                    >
                      {/* Tracking Code */}
                      <td className="py-3 px-4 font-mono font-medium whitespace-nowrap" style={{ color: PALETTE.dark }}>
                        {item.trackingCode}
                      </td>

                      {/* Listing Name & Campus */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {item.logoUrl ? (
                            <div
                              className="w-7 h-7 rounded-md overflow-hidden shrink-0 relative border"
                              style={{ borderColor: PALETTE.border, background: PALETTE.inputBg }}
                            >
                              <Image
                                src={item.logoUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="28px"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0"
                              style={{ background: PALETTE.inputBg, color: PALETTE.muted }}
                            >
                              {item.name.slice(0, 1)}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold truncate" style={{ color: PALETTE.dark }}>
                              {item.name}
                            </span>
                            <span className="text-[11px] flex items-center gap-1 truncate" style={{ color: PALETTE.placeholder }}>
                              <MapPin className="w-3 h-3 shrink-0" style={{ color: PALETTE.caramel }} />
                              <span className="truncate">{item.location}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Student Rep */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate" style={{ color: PALETTE.dark }}>
                            {item.category}
                          </span>
                          <span className="text-[11px] truncate font-mono" style={{ color: PALETTE.placeholder }}>
                            {item.studentRepContact}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap" style={{ color: PALETTE.placeholder }}>
                        {item.dateAdded}
                      </td>

                      {/* Plan / Tier */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.plan === 'spotlight' ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border"
                            style={{ background: '#FFF3CD', color: '#7C4A27', borderColor: PALETTE.border }}
                          >
                            <span>₦5,000 Spotlight</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium" style={{ color: PALETTE.placeholder }}>
                            Free Listing
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.status === 'Active' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}
                        {item.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                        {item.status === 'Needs Info' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-800 border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                            <span>Needs Info</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(item);
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded border transition-colors hover:opacity-80 cursor-pointer"
                          style={{ borderColor: PALETTE.border, color: PALETTE.dark, background: PALETTE.inputBg }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ========================================================
              AUTHENTIC EMPTY STATE: Calm, Utilitarian, Trustworthy
             ======================================================== */
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div
              className="w-10 h-10 rounded-full border flex items-center justify-center"
              style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.accent }}
            >
              <Inbox className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold" style={{ color: PALETTE.dark }}>
                No submissions found
              </h3>
              <p className="text-xs max-w-sm leading-relaxed" style={{ color: PALETTE.placeholder }}>
                {searchQuery
                  ? `No directory entries match the search "${searchQuery}". Please check spelling or clear the query.`
                  : activeTab === 'opportunities'
                  ? 'There are currently 0 pending entries in the opportunities queue.'
                  : activeTab === 'communities' || activeTab === 'events'
                  ? `There are currently 0 pending entries in the ${activeTab} queue.`
                  : 'There are no listings matching this filter criteria.'}
              </p>
            </div>
            {searchQuery || activeTab !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-2 text-xs font-medium underline underline-offset-4 cursor-pointer"
                style={{ color: PALETTE.dark }}
              >
                Reset all filters
              </button>
            ) : null}
          </div>
        )}

        {/* ========================================================
            PAGINATION FOOTER: Real, Accurate Submissions Count
           ======================================================== */}
        <div
          className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: PALETTE.border, color: PALETTE.placeholder }}
        >
          <div>
            Showing{' '}
            <span className="font-semibold" style={{ color: PALETTE.dark }}>
              {filteredRecords.length > 0 ? '1' : '0'}
            </span>
            –
            <span className="font-semibold" style={{ color: PALETTE.dark }}>
              {filteredRecords.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold" style={{ color: PALETTE.dark }}>{records.length}</span>{' '}
            listings
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border opacity-50 cursor-not-allowed"
              style={{ borderColor: PALETTE.border, background: PALETTE.inputBg, color: PALETTE.placeholder }}
            >
              Previous
            </button>
            <span
              className="px-2.5 py-1 rounded font-medium text-xs"
              style={{ background: PALETTE.dark, color: PALETTE.ivory }}
            >
              1
            </span>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border opacity-50 cursor-not-allowed"
              style={{ borderColor: PALETTE.border, background: PALETTE.inputBg, color: PALETTE.placeholder }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          INSPECTION DRAWER / MODAL: Calm, Functional Review Desk
         ======================================================== */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-5"
            style={{ background: PALETTE.ivory, borderColor: PALETTE.border }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: PALETTE.border }}>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded border"
                  style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.dark }}
                >
                  {selectedRecord.trackingCode}
                </span>
                <span className="font-semibold text-sm" style={{ color: PALETTE.dark }}>
                  Listing Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded transition-colors hover:opacity-70 cursor-pointer"
                style={{ color: PALETTE.placeholder }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                {selectedRecord.logoUrl ? (
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden border shrink-0 relative"
                    style={{ borderColor: PALETTE.border, background: PALETTE.inputBg }}
                  >
                    <Image
                      src={selectedRecord.logoUrl}
                      alt={selectedRecord.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
                    style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.dark }}
                  >
                    {selectedRecord.name.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="font-bold text-sm" style={{ color: PALETTE.dark }}>
                    {selectedRecord.name}
                  </h3>
                  <span className="flex items-center gap-1 mt-0.5" style={{ color: PALETTE.placeholder }}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: PALETTE.caramel }} />
                    <span>{selectedRecord.location}</span>
                  </span>
                  <span className="text-[11px] mt-0.5" style={{ color: PALETTE.placeholder }}>
                    Campus: {selectedRecord.campus}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className="p-3 rounded-xl border leading-relaxed"
                style={{ background: PALETTE.inputBg, borderColor: PALETTE.border, color: PALETTE.muted }}
              >
                <span className="font-semibold block mb-1" style={{ color: PALETTE.dark }}>
                  About this Listing:
                </span>
                {selectedRecord.description}
              </div>

              {/* Student Offer / Deal */}
              {selectedRecord.featuredOffer && (
                <div
                  className="p-3 rounded-xl border leading-relaxed"
                  style={{ background: '#FFF3CD', borderColor: PALETTE.border, color: '#7C4A27' }}
                >
                  <span className="font-semibold block mb-0.5">
                    Featured Student Offer:
                  </span>
                  {selectedRecord.featuredOffer}
                </div>
              )}

              {/* Verified Contact Details */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="p-2.5 rounded-xl border"
                  style={{ background: PALETTE.inputBg, borderColor: PALETTE.border }}
                >
                  <span className="text-[10px] uppercase font-semibold block" style={{ color: PALETTE.placeholder }}>
                    Category
                  </span>
                  <span className="font-medium" style={{ color: PALETTE.dark }}>
                    {selectedRecord.category}
                  </span>
                </div>
                <div
                  className="p-2.5 rounded-xl border"
                  style={{ background: PALETTE.inputBg, borderColor: PALETTE.border }}
                >
                  <span className="text-[10px] uppercase font-semibold block" style={{ color: PALETTE.placeholder }}>
                    Contact Channel
                  </span>
                  {selectedRecord.whatsappUrl ? (
                    <a
                      href={selectedRecord.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-medium hover:underline inline-flex items-center gap-1"
                      style={{ color: PALETTE.mid }}
                    >
                      <span>{selectedRecord.studentRepContact}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-mono font-medium" style={{ color: PALETTE.dark }}>
                      {selectedRecord.studentRepContact}
                    </span>
                  )}
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="pt-2 border-t flex items-center justify-between gap-3" style={{ borderColor: PALETTE.border }}>
                <button
                  type="button"
                  onClick={() => handleTogglePlan(selectedRecord.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80 cursor-pointer"
                  style={{ borderColor: PALETTE.border, background: PALETTE.inputBg, color: PALETTE.dark }}
                >
                  {selectedRecord.plan === 'spotlight'
                    ? 'Downgrade to Free'
                    : 'Upgrade to ₦5,000 Spotlight'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'Needs Info')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80 cursor-pointer"
                    style={{ borderColor: '#F59E0B', color: '#B45309', background: '#FEF3C7' }}
                  >
                    Flag
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'Active')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
                    style={{ background: PALETTE.dark }}
                  >
                    Confirm Active
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
