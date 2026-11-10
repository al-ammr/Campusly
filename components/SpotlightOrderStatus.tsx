'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle,
  Clock,
  Upload,
  Copy,
  Check,
  Building,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

interface OrderData {
  id: string;
  reference: string;
  status: string;
  plan: string;
  business_name: string;
  offer: string;
  description: string;
  contact: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  amount_kobo: number;
  payment_status: string;
  category_name: string;
}

export function SpotlightOrderStatus({ reference }: { reference: string }) {
  const [order, setOrder] = React.useState<OrderData | null>(null);
  const [bankDetails, setBankDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [copiedRef, setCopiedRef] = React.useState(false);

  // Receipt Upload State
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [receiptNote, setReceiptNote] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const fetchOrder = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/spotlight/order/${reference}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setBankDetails(data.bankDetails);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  }, [reference]);

  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const copyRef = () => {
    if (order?.reference) {
      navigator.clipboard.writeText(order.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !receiptNote.trim()) {
      setUploadError('Please select a receipt document or provide transfer narration details.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await fetch(`/api/v1/spotlight/order/${reference}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          file_name: selectedFile?.name,
          receipt_note: receiptNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Failed to submit receipt.');
        return;
      }

      setUploadSuccess(true);
      await fetchOrder();
    } catch {
      setUploadError('Network error uploading receipt.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-muted">Verifying order status with university commerce ledger...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-danger mx-auto" />
        <h2 className="text-base font-bold text-ink">Order Reference Not Found</h2>
        <p className="text-xs text-ink-muted">
          No Spotlight reservation exists matching reference &ldquo;{reference}&rdquo;.
        </p>
        <Link href="/spotlight" className="text-xs text-accent hover:underline">
          Return to Spotlight
        </Link>
      </div>
    );
  }

  const isAwaiting = order.status === 'Awaiting payment';
  const isReceiptSubmitted = order.status === 'Receipt submitted';
  const isActive = order.status === 'Active';

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-border text-brand dark:text-brand-dark font-mono text-xs font-semibold uppercase">
          <Award className="w-3.5 h-3.5" />
          <span>Spotlight Commercial Order</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-ink-dark">
          {order.business_name}
        </h1>
        <p className="text-xs text-ink-muted">{order.offer}</p>
      </div>

      {/* Status Progress Strip */}
      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-muted font-medium">Order Reference:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-cypress-green dark:text-cypress-green-dark">
              {order.reference}
            </span>
            <button
              type="button"
              onClick={copyRef}
              className="p-1 rounded hover:bg-surface-raised cursor-pointer"
              title="Copy Reference"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs border-t border-border/40 pt-2">
          <span className="text-ink-muted font-medium">Current Status:</span>
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border uppercase ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : isReceiptSubmitted
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-sand-light dark:bg-sand-light-dark text-ink border-border'
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs border-t border-border/40 pt-2 font-bold">
          <span className="text-ink-muted">Payable Amount:</span>
          <span className="font-serif text-sm text-cypress-green">
            ₦{(order.amount_kobo / 100).toLocaleString('en-NG')}
          </span>
        </div>
      </div>

      {/* Active Live Link */}
      {isActive && (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-serif font-bold text-base">Your Showcase is Live!</h3>
          <p>
            Your business is actively featured on the Campusly registry through{' '}
            {order.ends_at ? new Date(order.ends_at).toLocaleDateString('en-NG') : 'the active window'}.
          </p>
          <Link
            href="/spotlight"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cypress-green text-white font-semibold text-xs mt-2"
          >
            <span>View Spotlight Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Bank Transfer Details (if awaiting payment) */}
      {isAwaiting && bankDetails && (
        <div className="p-5 rounded-xl bg-sand-light/50 dark:bg-surface-raised border border-border space-y-3 text-xs">
          <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
            <Building className="w-4 h-4 text-accent" />
            University Bank Account Details
          </h3>
          <div className="space-y-1.5 font-mono text-[11px]">
            <p>Bank: <strong className="font-sans font-semibold text-ink">{bankDetails.bank_name}</strong></p>
            <p>Account Name: <strong className="font-sans font-semibold text-ink">{bankDetails.account_name}</strong></p>
            <p>Account Number: <strong className="font-bold text-sm text-cypress-green">{bankDetails.account_number}</strong></p>
            <p>Narration / Ref: <strong className="font-bold text-ink">{order.reference}</strong></p>
          </div>
        </div>
      )}

      {/* Receipt Submission Form */}
      {(isAwaiting || isReceiptSubmitted) && (
        <div className="bg-surface dark:bg-surface-dark border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-ink dark:text-ink-dark flex items-center gap-2">
            <Upload className="w-4 h-4 text-accent" />
            {isReceiptSubmitted ? 'Update Payment Evidence' : 'Submit Payment Receipt'}
          </h3>

          {uploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Receipt submitted. Our finance team verifies bank entries within 2–4 hours.</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleUploadReceipt} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-ink">
                Upload Transfer Receipt (Image or PDF)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full p-2.5 rounded-xl border border-border bg-surface-raised text-xs file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent/20 file:text-accent cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-ink">
                Sender Name or Bank Transfer Narration Details
              </label>
              <textarea
                rows={2}
                value={receiptNote}
                onChange={(e) => setReceiptNote(e.target.value)}
                placeholder="e.g. Transferred from Aisha Bello via OPay / Kuda (Ref: TXN-847291)"
                className="w-full p-2.5 rounded-xl border border-border bg-surface-raised text-xs focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 px-4 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Receipt...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isReceiptSubmitted ? 'Update Receipt' : 'Confirm & Submit Receipt'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
