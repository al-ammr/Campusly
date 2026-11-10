'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  CheckCircle,
  Building2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Tag,
  AlertCircle,
  Clock,
  Copy,
  Check,
} from 'lucide-react';

export default function NewSpotlightOrderPage() {
  const router = useRouter();

  // Wizard Steps: 1 = Plan, 2 = Details, 3 = Terms & Review, 4 = Payment Instructions
  const [step, setStep] = React.useState<number>(1);

  // Form State
  const [planId, setPlanId] = React.useState<'standard' | 'featured'>('standard');
  const [businessName, setBusinessName] = React.useState('');
  const [offer, setOffer] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [category, setCategory] = React.useState('spotlight-food');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = React.useState<any>(null);
  const [bankDetails, setBankDetails] = React.useState<any>(null);
  const [copiedRef, setCopiedRef] = React.useState(false);

  const categories = [
    { slug: 'spotlight-food', label: 'Food & Dining (Cafeteria, Snacks, Drinks)' },
    { slug: 'spotlight-fashion', label: 'Fashion & Apparel (Wear, Shoes, Tailoring)' },
    { slug: 'spotlight-tech', label: 'Tech, Gadgets & Phone Accessories' },
    { slug: 'spotlight-services', label: 'Services (Printing, Laundry, Tutoring, Repairs)' },
    { slug: 'spotlight-beauty', label: 'Beauty, Barbershop & Personal Care' },
    { slug: 'spotlight-books', label: 'Academic Books, Manuals & Stationery' },
    { slug: 'spotlight-other', label: 'Other Campus Enterprise' },
  ];

  const plans = [
    {
      id: 'standard',
      name: 'Standard Showcase',
      price: '₦5,000',
      duration: '3 Days Active',
      desc: 'Placement in the verified student enterprise catalog with verified star ratings and direct WhatsApp link.',
      features: ['Verified Commercial Badge', 'Standard Directory Placement', '3 Days Active Showcase'],
    },
    {
      id: 'featured',
      name: 'Featured Weekly Strip',
      price: '₦15,000',
      duration: '4 Days Active',
      desc: 'Prime position in the curated homepage top banner strip viewed by 12,000+ ABU students daily.',
      features: [
        'Curated Homepage Banner Strip',
        'Top of Spotlight Directory',
        'Priority Rotation & Highlight Badge',
        '4 Days Active Showcase',
      ],
      popular: true,
    },
  ];

  const handleSubmit = async () => {
    if (!agreeTerms) {
      setError('You must accept the Spotlight Commercial Terms before proceeding.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/spotlight/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          planId,
          business_name: businessName,
          offer,
          description,
          contact,
          agree_terms: agreeTerms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || data.message || 'Failed to place order.');
        return;
      }

      setCreatedOrder(data.order);
      setBankDetails(data.bankDetails);
      setStep(4);
    } catch {
      setError('Network connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (createdOrder?.reference) {
      navigator.clipboard.writeText(createdOrder.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-2 border-b border-border/80 dark:border-border-dark/80 pb-6">
        <Link
          href="/spotlight"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Spotlight Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-container text-brand flex items-center justify-center border border-border">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-ink-dark">
              Showcase Your Campus Enterprise
            </h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Ahmadu Bello University Verified Commerce Registry • Direct Student Discovery
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between max-w-lg mx-auto text-xs font-mono">
        {[
          { num: 1, label: 'Select Plan' },
          { num: 2, label: 'Details' },
          { num: 3, label: 'Review & Terms' },
          { num: 4, label: 'Transfer & Receipt' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step === s.num
                  ? 'bg-cypress-green dark:bg-cypress-green-dark text-white shadow-xs'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface-raised border border-border text-ink-muted'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className="hidden sm:inline text-ink-muted">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PLAN SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">
              Choose Promotion Tier
            </h2>
            <p className="text-xs text-ink-muted">
              Fixed duration and kobo pricing per authoritative university settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((p) => {
              const isSelected = planId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setPlanId(p.id as any)}
                  className={`
                    p-6 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between
                    ${
                      isSelected
                        ? 'border-accent bg-surface-raised dark:bg-surface-raised-dark shadow-md'
                        : 'border-border/80 dark:border-border-dark/80 bg-surface dark:bg-surface-dark hover:border-accent/40'
                    }
                  `}
                >
                  {p.popular && (
                    <span className="absolute -top-3 right-6 bg-accent text-white font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      Highest Student Visibility
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-ink dark:text-ink-dark">{p.name}</h3>
                      <div className="text-right">
                        <span className="font-serif font-bold text-xl text-cypress-green dark:text-cypress-green-dark">
                          {p.price}
                        </span>
                        <span className="block text-[11px] text-ink-muted font-mono">{p.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed">{p.desc}</p>

                    <ul className="space-y-2 pt-2 border-t border-border/50 text-xs">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-ink dark:text-ink-dark">
                          <CheckCircle className="w-3.5 h-3.5 text-cypress-green shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <div
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs text-center transition-colors ${
                        isSelected
                          ? 'bg-cypress-green text-white'
                          : 'bg-surface-raised border border-border text-ink'
                      }`}
                    >
                      {isSelected ? 'Plan Selected' : 'Select Plan'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue to Enterprise Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BUSINESS DETAILS */}
      {step === 2 && (
        <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">
              Enterprise &amp; Offer Details
            </h2>
            <p className="text-xs text-ink-muted">
              Enter your student-facing business profile and special offer.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-ink">Business or Brand Name *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Kongo Fast Bites &amp; Smoothies"
                className="w-full p-3 rounded-xl border border-border bg-surface-raised text-sm focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-ink">
                Headline Offer / Special Student Deal (max 80 chars) *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g. 15% off lunch boxes with student ID card"
                className="w-full p-3 rounded-xl border border-border bg-surface-raised text-sm focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-ink">Category Classification</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-surface-raised text-sm focus:ring-2 focus:ring-accent"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-ink">
                Direct Contact Channel (WhatsApp or Phone Number) *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. +234 803 123 4567 or https://wa.me/2348031234567"
                className="w-full p-3 rounded-xl border border-border bg-surface-raised text-sm focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-ink">Extended Description (Optional)</label>
              <textarea
                rows={4}
                maxLength={3000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Operating hours, location on campus (Samaru/Kongo), delivery options..."
                className="w-full p-3 rounded-xl border border-border bg-surface-raised text-sm focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-border text-xs text-ink hover:bg-surface-raised cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!businessName.trim() || !offer.trim() || !contact.trim()}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>Review Order &amp; Terms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TERMS & CONFIRMATION */}
      {step === 3 && (
        <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">
              Review Order &amp; Legal Terms
            </h2>
            <p className="text-xs text-ink-muted">
              Confirm your listing details before generating your bank transfer reference.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sand-light/50 dark:bg-surface-raised border border-border space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-ink-muted">Promotion Tier:</span>
              <span className="font-bold uppercase text-ink">{planId} Showcase</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-ink-muted">Business Name:</span>
              <span className="font-semibold text-ink">{businessName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-ink-muted">Headline Offer:</span>
              <span className="font-semibold text-ink">{offer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-ink-muted">Contact:</span>
              <span className="font-mono text-ink">{contact}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold">
              <span>Total Payable Amount:</span>
              <span className="font-serif text-cypress-green dark:text-cypress-green-dark">
                {planId === 'featured' ? '₦15,000' : '₦5,000'}
              </span>
            </div>
          </div>

          {/* Terms Acceptance (LEG-301 to LEG-304) */}
          <div className="p-4 rounded-xl border border-border/80 bg-surface-raised space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-cypress-green focus:ring-accent"
              />
              <span className="text-xs text-ink leading-relaxed">
                I accept the <strong className="font-semibold">Spotlight Commercial Terms (LEG-301)</strong>. I understand that:
                what is sold is a time-limited listing, not a guaranteed sales volume; Campusly may reject or pause listings that break university standards; and the listing begins only after the payment is manually confirmed in the university bank account (a receipt alone is not immediate confirmation).
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-border text-xs text-ink hover:bg-surface-raised cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting || !agreeTerms}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Reference...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Generate Transfer Reference</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT INSTRUCTIONS & REFERENCE */}
      {step === 4 && createdOrder && (
        <div className="bg-surface dark:bg-surface-dark border-2 border-accent/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark">
              Order Created Successfully
            </h2>
            <p className="text-xs text-ink-muted">
              Transfer the exact amount below to activate your listing on the Campusly registry.
            </p>
          </div>

          {/* Reference Box */}
          <div className="p-4 rounded-xl bg-sand-light/60 dark:bg-surface-raised border border-border max-w-md mx-auto space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted">
              Unique Payment Reference
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-bold text-lg text-cypress-green dark:text-cypress-green-dark">
                {createdOrder.reference}
              </span>
              <button
                type="button"
                onClick={copyReference}
                className="p-1.5 rounded-md hover:bg-surface transition-colors text-ink-muted hover:text-ink cursor-pointer"
                title="Copy reference code"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-ink-muted">
              Include this reference code in your transfer narration or receipt.
            </p>
          </div>

          {/* Bank Account Details */}
          {bankDetails && (
            <div className="max-w-md mx-auto p-5 rounded-xl border border-border text-left space-y-2 text-xs bg-surface-raised">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink-muted">Bank Name:</span>
                <span className="font-semibold text-ink">{bankDetails.bank_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink-muted">Account Name:</span>
                <span className="font-semibold text-ink">{bankDetails.account_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-ink-muted">Account Number:</span>
                <span className="font-mono font-bold text-ink text-sm">{bankDetails.account_number}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-muted font-bold">Amount Due:</span>
                <span className="font-mono font-bold text-cypress-green text-sm">
                  {bankDetails.amount_naira}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/spotlight/${createdOrder.reference}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 cursor-pointer shadow-md text-center"
            >
              Upload Payment Receipt Now
            </Link>
            <Link
              href="/spotlight"
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-border text-xs text-ink hover:bg-surface-raised text-center cursor-pointer"
            >
              Return to Spotlight Directory
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
