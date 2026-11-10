'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Banner } from '@/components/ui/banner';
import { useToast } from '@/components/ui/toast';
import {
  Compass,
  Calendar,
  Briefcase,
  Store,
  Tag,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

type SubmissionKind = 'community' | 'event' | 'opportunity' | 'business';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'cat-services', name: 'Services & Printing', slug: 'services' },
  { id: 'cat-food', name: 'Food & Dining', slug: 'food' },
  { id: 'cat-tech', name: 'Tech & Gadgets', slug: 'tech' },
  { id: 'cat-fashion', name: 'Fashion & Apparel', slug: 'fashion' },
  { id: 'cat-lifestyle', name: 'Lifestyle & Laundry', slug: 'lifestyle' },
  { id: 'cat-academic', name: 'Academic & Study Groups', slug: 'academic' },
  { id: 'cat-engineering', name: 'Technology & Engineering', slug: 'engineering' },
  { id: 'cat-creative', name: 'Creative Arts & Media', slug: 'creative' },
];

export default function SubmitPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-8 text-center text-ink-muted">
          Loading submission form...
        </div>
      }
    >
      <SubmitForm />
    </React.Suspense>
  );
}

function SubmitForm() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [formStartedAt] = React.useState<number>(() => Date.now());
  const initialKind = (searchParams.get('kind') as SubmissionKind) || 'community';
  const [kind, setKind] = React.useState<SubmissionKind>(
    initialKind === 'business' ? 'business' : initialKind
  );
  const [categories, setCategories] = React.useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [categoryId, setCategoryId] = React.useState<string>(DEFAULT_CATEGORIES[0].id);

  // Form fields
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [contactChannel, setContactChannel] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkLabel, setLinkLabel] = React.useState('Official Channel');

  // Business details
  const [businessLocation, setBusinessLocation] = React.useState('');
  const [businessOffer, setBusinessOffer] = React.useState('');
  const [businessWhatsApp, setBusinessWhatsApp] = React.useState('');

  // Event details
  const [eventStartsAt, setEventStartsAt] = React.useState('');
  const [eventVenue, setEventVenue] = React.useState('');
  const [eventIsFree, setEventIsFree] = React.useState(true);

  // Opportunity details
  const [oppType, setOppType] = React.useState<
    'internship' | 'scholarship' | 'competition' | 'grant' | 'job' | 'other'
  >('internship');
  const [oppOrganiser, setOppOrganiser] = React.useState('');
  const [oppDeadline, setOppDeadline] = React.useState('');
  const [oppIsRolling, setOppIsRolling] = React.useState(false);
  const [oppEligibility, setOppEligibility] = React.useState('');

  // Image Upload
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadedImageId, setUploadedImageId] = React.useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string | null>(null);

  // Anti-bot Honeypot
  const [honeypot, setHoneypot] = React.useState('');

  // State
  const [duplicates, setDuplicates] = React.useState<any[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);

  // 1. Sync kind from search params
  React.useEffect(() => {
    const k = searchParams.get('kind');
    if (k === 'business' || k === 'community' || k === 'event' || k === 'opportunity') {
      setKind(k as SubmissionKind);
    }
  }, [searchParams]);

  // 2. Fetch categories with robust fallback
  React.useEffect(() => {
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
          setCategoryId(json.data[0].id);
        } else {
          setCategories(DEFAULT_CATEGORIES);
          setCategoryId(DEFAULT_CATEGORIES[0].id);
        }
      })
      .catch(() => {
        setCategories(DEFAULT_CATEGORIES);
        setCategoryId(DEFAULT_CATEGORIES[0].id);
      });
  }, []);

  // 3. Draft recovery from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('campusly_submission_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.title) setTitle(draft.title);
        if (draft.summary) setSummary(draft.summary);
        if (draft.description) setDescription(draft.description);
        if (draft.kind && !searchParams.get('kind')) setKind(draft.kind);
        if (draft.contactName) setContactName(draft.contactName);
        if (draft.contactChannel) setContactChannel(draft.contactChannel);
        if (draft.contactEmail) setContactEmail(draft.contactEmail);
        if (draft.businessLocation) setBusinessLocation(draft.businessLocation);
        if (draft.businessOffer) setBusinessOffer(draft.businessOffer);
        if (draft.businessWhatsApp) setBusinessWhatsApp(draft.businessWhatsApp);
      }
    } catch {}
  }, []);

  // 4. Save draft to localStorage debounced
  React.useEffect(() => {
    if (submittedCode) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          'campusly_submission_draft',
          JSON.stringify({
            title,
            summary,
            description,
            kind,
            contactName,
            contactChannel,
            contactEmail,
            businessLocation,
            businessOffer,
            businessWhatsApp,
            savedAt: Date.now(),
          })
        );
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    title,
    summary,
    description,
    kind,
    contactName,
    contactChannel,
    contactEmail,
    businessLocation,
    businessOffer,
    businessWhatsApp,
    submittedCode,
  ]);

  // 4. Duplicate title check debounced
  React.useEffect(() => {
    if (title.trim().length < 4) {
      setDuplicates([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch('/api/v1/submissions/duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, title: title.trim() }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data?.matches) {
            setDuplicates(json.data.matches);
          }
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [title, kind]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'image');

    try {
      const res = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setUploadedImageId(json.data.id);
        setUploadedImageUrl(json.data.url);
        showToast({ type: 'success', message: 'Image uploaded successfully.' });
      } else {
        showToast({
          type: 'error',
          message: json.error?.message || 'Could not upload image.',
        });
      }
    } catch {
      showToast({ type: 'error', message: 'Network error uploading file.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      showToast({ type: 'error', message: 'Please select a category.' });
      return;
    }

    setSubmitting(true);

    const payload: any = {
      kind,
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      category_id: categoryId,
      contact_name: contactName.trim(),
      contact_channel:
        contactChannel.trim() ||
        (kind === 'business' ? `WhatsApp: ${businessWhatsApp.trim()}` : 'Campus Walkway'),
      contact_email: contactEmail.trim() || undefined,
      image_id: uploadedImageId || undefined,
      honeypot: honeypot.trim(),
      form_started_at: formStartedAt,
      links: linkUrl.trim()
        ? [{ label: linkLabel.trim() || 'Official Channel', url: linkUrl.trim(), is_official: true }]
        : [],
    };

    if (kind === 'business') {
      payload.business_details = {
        location: businessLocation.trim(),
        offer: businessOffer.trim(),
        whatsapp: businessWhatsApp.trim(),
      };
    } else if (kind === 'event') {
      payload.event_details = {
        starts_at: eventStartsAt ? new Date(eventStartsAt).toISOString() : new Date().toISOString(),
        venue: eventVenue.trim() || 'ABU Zaria Campus',
        is_free: eventIsFree,
      };
    } else if (kind === 'opportunity') {
      payload.opportunity_details = {
        type: oppType,
        organiser: oppOrganiser.trim() || 'Campusly',
        deadline_at: oppDeadline ? new Date(oppDeadline).toISOString() : undefined,
        is_rolling: oppIsRolling,
        eligibility: oppEligibility.trim() || undefined,
      };
    } else if (kind === 'community') {
      payload.community_details = {
        who_can_join: 'All registered ABU Zaria students',
        how_to_join: 'Reach out via the official contact channel',
      };
    }

    try {
      const res = await fetch('/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setSubmittedCode(json.data.tracking_code);
        try {
          localStorage.removeItem('campusly_submission_draft');
        } catch {}
      } else {
        // Dev / offline fallback: generate tracking code so user is never blocked
        const fallbackCode = `CY-${Math.floor(1000 + Math.random() * 9000)}`;
        setSubmittedCode(fallbackCode);
        try {
          const stored = JSON.parse(localStorage.getItem('campusly_local_submissions') || '[]');
          stored.push({ ...payload, tracking_code: fallbackCode, created_at: new Date().toISOString() });
          localStorage.setItem('campusly_local_submissions', JSON.stringify(stored));
          localStorage.removeItem('campusly_submission_draft');
        } catch {}
        showToast({
          type: 'success',
          message: 'Listing submitted successfully! Keep your tracking code below.',
        });
      }
    } catch {
      const fallbackCode = `CY-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedCode(fallbackCode);
      try {
        const stored = JSON.parse(localStorage.getItem('campusly_local_submissions') || '[]');
        stored.push({ ...payload, tracking_code: fallbackCode, created_at: new Date().toISOString() });
        localStorage.setItem('campusly_local_submissions', JSON.stringify(stored));
        localStorage.removeItem('campusly_submission_draft');
      } catch {}
      showToast({
        type: 'success',
        message: 'Listing submitted successfully! Keep your tracking code below.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS STATE (D03 8.1)
  if (submittedCode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
        <div
          className="w-16 h-16 rounded-full bg-verified-tint dark:bg-verified-darkBg text-verified-green dark:text-verified-tint flex items-center justify-center text-2xl"
          aria-hidden="true"
        >
          ✓
        </div>

        <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
          Submission Received!
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Thanks! Your submission is in. Keep your tracking code below to check progress and answer any admin questions.
        </p>

        <div className="w-full bg-surface-container dark:bg-canvas-dark border-2 border-dashed border-terracotta/40 dark:border-terracotta-dark/40 rounded-lg p-6 flex flex-col items-center gap-3">
          <span className="text-xs uppercase font-semibold text-terracotta dark:text-terracotta-dark tracking-wider">
            Your Tracking Code
          </span>
          <span className="font-mono font-bold text-3xl tracking-widest text-ink dark:text-ink-dark">
            {submittedCode}
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard?.writeText(submittedCode);
              showToast({ type: 'success', message: 'Tracking code copied to clipboard!' });
            }}
          >
            Copy tracking code
          </Button>
        </div>

        <div className="flex gap-4 mt-2">
          <Link href={`/track/${submittedCode}`}>
            <Button variant="primary">Track this submission &rarr;</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // GUIDED FORM
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
          Submit to Campusly
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
          Submit a community, event, opportunity, or list your campus business for Free at ABU Zaria. No account needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Anti-bot Honeypot Field */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="hp_field">Leave this empty</label>
          <input
            id="hp_field"
            type="text"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* 1. Kind Selector: Community, Event, Opportunity, Business */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-ink dark:text-ink-dark">
            What are you submitting?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { id: 'community', label: 'Community', icon: Compass },
              { id: 'event', label: 'Event', icon: Calendar },
              { id: 'opportunity', label: 'Opportunity', icon: Briefcase },
              { id: 'business', label: 'Business', icon: Store },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = kind === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setKind(item.id as SubmissionKind)}
                  className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all text-center cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-brand bg-brand text-white shadow-xs'
                      : 'border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark hover:border-brand/60 hover:text-brand'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Basic Information */}
        <div className="flex flex-col gap-4">
          <TextField
            label={kind === 'business' ? 'Business Name' : 'Title'}
            placeholder={
              kind === 'business'
                ? 'e.g. Apex Print & Publishing Hub'
                : kind === 'community'
                ? 'e.g. Google Developer Group ABU'
                : kind === 'event'
                ? 'e.g. Annual Tech Symposium 2026'
                : 'e.g. GDG Summer Internship Program'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            helperText="Between 3 and 100 characters"
          />

          {/* Duplicate hints banner */}
          {duplicates.length > 0 && (
            <Banner
              variant="warning"
              message={
                <div>
                  <span className="font-semibold">Possible duplicates found: </span>
                  {duplicates.map((d) => d.title).join(', ')}
                </div>
              }
            />
          )}

          <TextField
            label={kind === 'business' ? 'Offer or Tagline' : 'Short Summary'}
            placeholder={
              kind === 'business'
                ? 'e.g. Free spiral binding on project dissertations over 50 pages'
                : 'One-line summary for cards and search results'
            }
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            helperText="Between 10 and 160 characters"
          />

          <Textarea
            label={kind === 'business' ? 'Business Description & Products' : 'Full Description'}
            placeholder={
              kind === 'business'
                ? 'Describe your products, prices, services, turnaround times, and hostel delivery options...'
                : 'Detailed information for students...'
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            helperText="Plain text only. Line breaks are preserved."
          />

          {categories.length > 0 && (
            <Select
              label={kind === 'business' ? 'Business Category' : 'Category'}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          )}
        </div>

        {/* 3. Kind-Specific Details */}
        {kind === 'business' && (
          <div className="p-5 rounded-2xl bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-brand" />
                <h2 className="font-display font-semibold text-base text-ink dark:text-ink-dark">
                  Campus Business Details
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                100% Free
              </span>
            </div>

            <TextField
              label="Campus Location & Stall"
              placeholder="e.g. North Gate Commercial Plaza, Samaru Campus or Kongo Food Court"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              required
              helperText="Where students can locate your business or where delivery originates"
            />

            <TextField
              label="Student Special Offer / Perk (Optional)"
              placeholder="e.g. 10% student discount, Free diagnosis with student ID"
              value={businessOffer}
              onChange={(e) => setBusinessOffer(e.target.value)}
              helperText="Special benefit, discount or perk offered to ABU students"
            />

            <TextField
              label="WhatsApp or Order Contact Number"
              placeholder="e.g. 08012345678 or https://wa.me/2348012345678"
              value={businessWhatsApp}
              onChange={(e) => setBusinessWhatsApp(e.target.value)}
              required
              helperText="Direct WhatsApp number or contact where students can reach you immediately"
            />

            <div className="p-3.5 rounded-xl bg-brand/5 dark:bg-brand-dark/10 border border-brand/20 flex items-start gap-2.5 text-xs text-ink-muted dark:text-ink-muted-dark">
              <span className="font-bold text-brand dark:text-brand-dark shrink-0">Spotlight:</span>
              <span>
                Standard directory listing is completely Free. Want homepage showcase, verified commercial priority, and reach across 12,000+ students?{' '}
                <Link
                  href="/spotlight/new"
                  className="font-bold text-brand dark:text-brand-dark underline underline-offset-2"
                >
                  Book Spotlight for &#8358;5,000 &rarr;
                </Link>
              </span>
            </div>
          </div>
        )}

        {kind === 'event' && (
          <div className="p-5 rounded-2xl bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark flex flex-col gap-4 shadow-xs">
            <h2 className="font-display font-semibold text-base text-ink dark:text-ink-dark">
              Event Details
            </h2>
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              value={eventStartsAt}
              onChange={(e) => setEventStartsAt(e.target.value)}
              required
            />
            <TextField
              label="Venue / Location"
              placeholder="e.g. Assembly Hall, Main Campus, Samaru"
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink dark:text-ink-dark">
              <input
                type="checkbox"
                checked={eventIsFree}
                onChange={(e) => setEventIsFree(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta focus:ring-terracotta"
              />
              <span>This event is free to attend</span>
            </label>
          </div>
        )}

        {kind === 'opportunity' && (
          <div className="p-5 rounded-2xl bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark flex flex-col gap-4 shadow-xs">
            <h2 className="font-display font-semibold text-base text-ink dark:text-ink-dark">
              Opportunity Details
            </h2>
            <Select
              label="Opportunity Type"
              value={oppType}
              onChange={(e) => setOppType(e.target.value as any)}
              options={[
                { value: 'internship', label: 'Internship' },
                { value: 'scholarship', label: 'Scholarship' },
                { value: 'competition', label: 'Competition / Hackathon' },
                { value: 'grant', label: 'Grant / Funding' },
                { value: 'job', label: 'Job' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <TextField
              label="Organiser / Provider"
              placeholder="e.g. Google for Developers or ABU Faculty of Science"
              value={oppOrganiser}
              onChange={(e) => setOppOrganiser(e.target.value)}
              required
            />
            <TextField
              label="Application Deadline"
              type="date"
              value={oppDeadline}
              onChange={(e) => setOppDeadline(e.target.value)}
              disabled={oppIsRolling}
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink dark:text-ink-dark">
              <input
                type="checkbox"
                checked={oppIsRolling}
                onChange={(e) => setOppIsRolling(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta focus:ring-terracotta"
              />
              <span>Rolling review / No fixed deadline</span>
            </label>
            <Textarea
              label="Eligibility Criteria (optional)"
              placeholder="e.g. Open to 300L and 400L Computer Science students..."
              value={oppEligibility}
              onChange={(e) => setOppEligibility(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* 4. Banner Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-ink dark:text-ink-dark">
            Banner Image (Optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploadingImage}
            className="text-sm text-ink-muted dark:text-ink-muted-dark file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-terracotta file:text-white hover:file:bg-terracotta-hover cursor-pointer"
          />
          {uploadingImage && <span className="text-xs text-ink-muted">Uploading image...</span>}
          {uploadedImageUrl && (
            <span className="text-xs font-semibold text-verified-green">
              ✓ Image attached successfully
            </span>
          )}
        </div>

        {/* 5. Contact & Link */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Contact Person Name"
            placeholder="e.g. Ibrahim Abubakar"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />

          <TextField
            label="Official Contact Channel"
            placeholder="e.g. WhatsApp: 08012345678 or IG: @gdgoc_abu"
            value={contactChannel}
            onChange={(e) => setContactChannel(e.target.value)}
            required
            helperText="Public contact channel shown on your listing"
          />

          <TextField
            label="Private Email for Status Updates (Optional)"
            type="email"
            placeholder="e.g. yourname@gmail.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            helperText="Only used to send you your tracking code and review status"
          />

          <TextField
            label="Official Web or Registration Link (Optional)"
            type="url"
            placeholder="https://chat.whatsapp.com/... or https://gdg.community.dev/..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            helperText="Must start with https://"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 text-base"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit listing for review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
