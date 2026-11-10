'use client';

import * as React from 'react';
import {
  Award,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  CreditCard,
  Building,
  Check,
  DollarSign,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface SpotlightOrder {
  id: string;
  reference: string;
  listing_status: string;
  plan: string;
  business_name: string;
  offer: string;
  contact: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  amount_kobo: number;
  amount_received_kobo: number | null;
  bank_reference: string | null;
  bank_sender_name: string | null;
  confirmed_in_bank: boolean;
  confirmed_at: string | null;
  admin_note: string | null;
  category_name: string;
}

export default function AdminSpotlightPage() {
  const [orders, setOrders] = React.useState<SpotlightOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');

  // Payment Verification Modal
  const [selectedOrder, setSelectedOrder] = React.useState<SpotlightOrder | null>(null);
  const [confirmedInBank, setConfirmedInBank] = React.useState(false);
  const [bankRef, setBankRef] = React.useState('');
  const [bankSender, setBankSender] = React.useState('');
  const [receivedKobo, setReceivedKobo] = React.useState<string>('');
  const [adminNote, setAdminNote] = React.useState('');
  const [isActivating, setIsActivating] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/spotlight');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const openActivateModal = (order: SpotlightOrder) => {
    setSelectedOrder(order);
    setConfirmedInBank(false);
    setBankRef('');
    setBankSender('');
    setReceivedKobo(String(order.amount_kobo));
    setAdminNote('');
    setModalError(null);
  };

  const handleActivate = async () => {
    if (!selectedOrder) return;
    if (!confirmedInBank) {
      setModalError('You must check "Confirmed in bank" to verify payment.');
      return;
    }
    if (!bankRef.trim()) {
      setModalError('Bank transaction reference number is required.');
      return;
    }

    setIsActivating(true);
    setModalError(null);

    try {
      const res = await fetch(`/api/v1/admin/spotlight/${selectedOrder.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          action: 'activate',
          confirmed_in_bank: confirmedInBank,
          bank_reference: bankRef.trim(),
          bank_sender_name: bankSender.trim() || undefined,
          amount_received_kobo: receivedKobo ? Number(receivedKobo) : undefined,
          admin_note: adminNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.message || 'Activation failed.');
        return;
      }

      setSelectedOrder(null);
      await fetchOrders();
    } catch {
      setModalError('Network error confirming payment.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleQuickAction = async (orderId: string, action: 'pause' | 'resume' | 'reject' | 'refund') => {
    try {
      await fetch(`/api/v1/admin/spotlight/${orderId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({ action }),
      });
      await fetchOrders();
    } catch {
      // Error
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (o.listing_status === 'Awaiting payment' || o.listing_status === 'Receipt submitted')) ||
      o.listing_status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      o.business_name.toLowerCase().includes(search.toLowerCase()) ||
      o.reference.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenueKobo = orders
    .filter((o) => o.confirmed_in_bank)
    .reduce((sum, o) => sum + (o.amount_received_kobo || o.amount_kobo), 0);
  const activeCount = orders.filter((o) => o.listing_status === 'Active').length;
  const pendingVerification = orders.filter((o) => o.listing_status === 'Receipt submitted').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: '#E0D7C6' }}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: '#2D1810' }}>
            <Award className="w-6 h-6" style={{ color: '#7C4A27' }} />
            Spotlight Orders
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#8C7364' }}>
            Manage verified spotlight showcases, verify bank transfer receipts, and review ledger records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/v1/admin/spotlight?export=csv"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors hover:opacity-80"
            style={{ borderColor: '#E0D7C6', background: '#FFFFF0', color: '#6B5344' }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: '#7C4A27' }} />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
            style={{ borderColor: '#E0D7C6', background: '#FFFFF0', color: '#6B5344' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Floating KPI Cards with Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-1"
          style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
        >
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold" style={{ color: '#8C7364' }}>
            Confirmed Bank Revenue
          </span>
          <div className="font-bold text-2xl font-mono" style={{ color: '#2D1810' }}>
            ₦{(totalRevenueKobo / 100).toLocaleString('en-NG')}
          </div>
          <span className="text-[11px] font-mono" style={{ color: '#6B5344' }}>Verified directory subscriptions</span>
        </div>

        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-1"
          style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
        >
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold" style={{ color: '#8C7364' }}>
            Active Showcases
          </span>
          <div className="font-bold text-2xl font-mono" style={{ color: '#7C4A27' }}>
            {activeCount}
          </div>
          <span className="text-[11px] font-mono" style={{ color: '#6B5344' }}>Live on campus catalog</span>
        </div>

        <div
          className="p-5 rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-1"
          style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
        >
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold" style={{ color: '#8C7364' }}>
            Awaiting Verification
          </span>
          <div className="font-bold text-2xl font-mono" style={{ color: pendingVerification > 0 ? '#B45309' : '#2D1810' }}>
            {pendingVerification}
          </div>
          <span className="text-[11px] font-mono" style={{ color: '#6B5344' }}>Receipts uploaded by students</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Needs Verification' },
            { id: 'Active', label: 'Active Live' },
            { id: 'Paused', label: 'Paused' },
            { id: 'Expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
              style={
                statusFilter === tab.id
                  ? { background: '#2D1810', color: '#FFFFF0', fontWeight: 700 }
                  : { background: '#FFFFF0', color: '#6B5344', border: '1px solid #E0D7C6' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: '#8C7364' }} />
          <input
            type="text"
            placeholder="Search business or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none w-64"
            style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
          />
        </div>
      </div>

      {/* Floating Orders Table Card */}
      <div
        className="rounded-2xl border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="uppercase tracking-wider font-semibold border-b"
              style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#6B5344' }}
            >
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Enterprise Profile</th>
                <th className="px-4 py-3">Plan / Fee</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Bank Reference</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y font-sans" style={{ borderColor: '#E0D7C6' }}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: '#8C7364' }}>
                    Loading spotlight orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: '#8C7364' }}>
                    No orders match filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:opacity-90">
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs font-bold" style={{ color: '#2D1810' }}>
                      {item.reference}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-bold block" style={{ color: '#2D1810' }}>{item.business_name}</span>
                        <span className="text-[11px] block truncate max-w-xs" style={{ color: '#6B5344' }}>{item.offer}</span>
                        <span className="text-[10px] font-mono" style={{ color: '#8C7364' }}>{item.contact}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-sm block" style={{ color: '#2D1810' }}>₦{(item.amount_kobo / 100).toLocaleString()}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border" style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#8C7364' }}>
                          {item.plan}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                          item.listing_status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.listing_status === 'Receipt submitted'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {item.listing_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                      {item.confirmed_in_bank ? (
                        <div className="flex items-center gap-1 text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          <span>{item.bank_reference || 'Confirmed'}</span>
                        </div>
                      ) : item.bank_reference ? (
                        <span className="text-ink-muted">{item.bank_reference}</span>
                      ) : (
                        <span className="text-ink-muted/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      {item.listing_status !== 'Active' ? (
                        <button
                          type="button"
                          onClick={() => openActivateModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-cypress-green text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify &amp; Activate</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickAction(item.id, 'pause')}
                            className="px-2.5 py-1 rounded border border-border text-[11px] text-ink-muted hover:text-ink cursor-pointer"
                          >
                            Pause
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAction(item.id, 'refund')}
                            className="px-2.5 py-1 rounded border border-border text-[11px] text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                          >
                            Refund
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className="rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 border"
            style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
          >
            <div className="border-b pb-3" style={{ borderColor: '#E0D7C6' }}>
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#2D1810' }}>
                <CreditCard className="w-5 h-5" style={{ color: '#7C4A27' }} />
                Bank Verification &amp; Showcase Activation
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#8C7364' }}>
                Verify receipt against official bank statement before publishing.
              </p>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="p-3 rounded-xl border space-y-1 text-xs" style={{ background: '#F7F4EB', borderColor: '#E0D7C6' }}>
              <div className="flex justify-between">
                <span style={{ color: '#6B5344' }}>Business:</span>
                <span className="font-bold" style={{ color: '#2D1810' }}>{selectedOrder.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B5344' }}>Reference:</span>
                <span className="font-mono font-bold" style={{ color: '#7C4A27' }}>{selectedOrder.reference}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span style={{ color: '#2D1810' }}>Expected Amount:</span>
                <span className="font-mono text-sm" style={{ color: '#2D1810' }}>₦{(selectedOrder.amount_kobo / 100).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: '#2D1810' }}>
                  Bank Transaction Reference (Required) *
                </label>
                <input
                  type="text"
                  required
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  placeholder="e.g. NIP-TXN-9842183921"
                  className="w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-none"
                  style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: '#2D1810' }}>Sender Account Name</label>
                <input
                  type="text"
                  value={bankSender}
                  onChange={(e) => setBankSender(e.target.value)}
                  placeholder="e.g. Ibrahim Abubakar"
                  className="w-full p-2.5 rounded-xl border text-xs focus:outline-none"
                  style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
                />
              </div>

              {/* Confirmed in Bank Checkbox */}
              <div className="p-3.5 rounded-xl border" style={{ borderColor: '#E0D7C6', background: '#F7F4EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={confirmedInBank}
                    onChange={(e) => setConfirmedInBank(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded"
                  />
                  <span className="text-xs font-bold leading-relaxed" style={{ color: '#2D1810' }}>
                    Confirmed in Bank Account
                    <span className="block font-normal text-[11px] mt-0.5" style={{ color: '#6B5344' }}>
                      I have verified that the funds have cleared and settled in the bank account.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: '#E0D7C6' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-3.5 py-2 rounded-xl border text-xs cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: '#E0D7C6', background: '#F7F4EB', color: '#6B5344' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isActivating || !confirmedInBank || !bankRef.trim()}
                  className="px-5 py-2 rounded-xl font-semibold text-xs cursor-pointer disabled:opacity-50 transition-colors hover:opacity-90"
                  style={{ background: '#4A2E1B', color: '#FFFFF0' }}
                >
                  {isActivating ? 'Verifying...' : 'Verify & Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
