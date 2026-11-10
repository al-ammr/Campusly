'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Lock,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const [tab, setTab] = React.useState<'support' | 'report' | 'privacy'>('support');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Header - Simple English, NO overhead badges */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shrink-0">
            <Mail className="w-5 h-5" strokeWidth={2} />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight">
            Contact Us
          </h1>
        </div>
        <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Have a question, feedback, or need help with a listing? Send us a message and our student team will get back to you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => { setTab('support'); setSubmitted(false); }}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            tab === 'support'
              ? 'bg-brand text-white font-bold shadow-xs'
              : 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>General Help</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('report'); setSubmitted(false); }}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            tab === 'report'
              ? 'bg-brand text-white font-bold shadow-xs'
              : 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Report an Issue</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('privacy'); setSubmitted(false); }}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
            tab === 'privacy'
              ? 'bg-brand text-white font-bold shadow-xs'
              : 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <Lock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Privacy &amp; Data</span>
        </button>
      </div>

      {/* Form Card Shell */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-10 shadow-xs">
        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-success/10 text-success dark:text-success-dark flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h2 className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                Message Sent!
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                Thank you for reaching out, {name || 'student'}. Our team will review your message and reply via email within 48 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === 'report' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-ink dark:text-ink-dark leading-relaxed">
                <strong className="block font-bold mb-0.5 text-amber-900 dark:text-amber-200">
                  Report a Listing or Misleading Content
                </strong>
                Found incorrect contact numbers, duplicate listings, or unauthorized club pages? Tell us which listing needs review and what should be fixed.
              </div>
            )}

            {tab === 'privacy' && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-ink dark:text-ink-dark leading-relaxed">
                <strong className="block font-bold mb-0.5 text-blue-900 dark:text-blue-200">
                  Update or Delete Your Information
                </strong>
                Want to update your WhatsApp link or have your phone number removed from a listing? Let us know the listing title and we will update it promptly.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink dark:text-ink-dark">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink dark:text-ink-dark">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amina@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink dark:text-ink-dark">
                Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  tab === 'report'
                    ? 'e.g. Incorrect meeting venue on Tech Club listing'
                    : tab === 'privacy'
                    ? 'e.g. Please update WhatsApp contact for Campus Bites'
                    : 'e.g. Question about listing my departmental association'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink dark:text-ink-dark">
                Your Message *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Give us details about your request, question, or the listing you are referring to..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-brand"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-strong text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>

      {/* Quick Info Footer Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ink-muted dark:text-ink-muted-dark shadow-xs">
        <div className="space-y-1">
          <strong className="block font-bold text-ink dark:text-ink-dark">
            Direct Student Operations Desk
          </strong>
          <p>
            Maintained by GDGOC ABU Zaria • Samaru &amp; Kongo campuses, Zaria
          </p>
        </div>
        <span className="font-mono text-xs font-semibold text-brand dark:text-brand-dark">
          contact@campusly.ng
        </span>
      </div>
    </div>
  );
}
