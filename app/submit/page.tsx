'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Banner } from '@/components/ui/banner';
import { useToast } from '@/components/ui/toast';
import { t } from '@/lib/copy/strings';

type SubmissionKind = 'community' | 'event' | 'opportunity';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function SubmitPage() {
  const { showToast } = useToast();

  const [formStartedAt] = React.useState<number>(() => Date.now());
  const [kind, setKind] = React.useState<SubmissionKind>('community');
  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = React.useState<string>('');

  // Form fields
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [contactChannel, setContactChannel] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkLabel, setLinkLabel] = React.useState('Official Channel');

  // Event details
  const [eventStartsAt, setEventStartsAt] = React.useState('');
  const [eventVenue, setEventVenue] = React.useState('');
  const [eventIsFree, setEventIsFree] = React.useState(true);

  // Opportunity details
  const [oppType, setOppType] = React.useState<'internship' | 'scholarship' | 'competition' | 'grant' | 'job' | 'other'>('internship');
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

  // 1. Fetch categories
  React.useEffect(() => {
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          setCategories(json.data);
          if (json.data.length > 0) {
            setCategoryId(json.data[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 2. Draft recovery from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('campusly_submission_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.title) setTitle(draft.title);
        if (draft.summary) setSummary(draft.summary);
        if (draft.description) setDescription(draft.description);
        if (draft.kind) setKind(draft.kind);
        if (draft.contactName) setContactName(draft.contactName);
        if (draft.contactChannel) setContactChannel(draft.contactChannel);
        if (draft.contactEmail) setContactEmail(draft.contactEmail);
      }
    } catch {}
  }, []);

  // 3. Save draft to localStorage debounced
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
            savedAt: Date.now(),
          })
        );
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, summary, description, kind, contactName, contactChannel, contactEmail, submittedCode]);

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
      contact_channel: contactChannel.trim(),
      contact_email: contactEmail.trim() || undefined,
      image_id: uploadedImageId || undefined,
      honeypot: honeypot.trim(),
      form_started_at: formStartedAt,
      links: linkUrl.trim() ? [{ label: linkLabel.trim() || 'Link', url: linkUrl.trim(), is_official: true }] : [],
    };

    if (kind === 'event') {
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
        showToast({
          type: 'error',
          message: json.error?.message || 'Submission failed. Please check form details.',
        });
      }
    } catch {
      showToast({ type: 'error', message: 'Network error submitting listing.' });
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS STATE (D03 8.1)
  if (submittedCode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-verified-tint dark:bg-verified-darkBg text-verified-green dark:text-verified-tint flex items-center justify-center text-2xl" aria-hidden="true">
          ✓
        </div>

        <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
          Submission Received!
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Thanks! Your submission is in. Keep your tracking code below to check progress and answer any admin questions.
        </p>

        <div className="w-full bg-sand-light dark:bg-sand-light-dark border-2 border-dashed border-terracotta/40 dark:border-terracotta-dark/40 rounded-2xl p-6 flex flex-col items-center gap-3">
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
            <Button variant="primary">
              Track this submission &rarr;
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">
              Back to Home
            </Button>
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
          Submit a community, event, or student opportunity at ABU Zaria. No account needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Anti-bot Honeypot Field (Hidden from real users, SEC-410) */}
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

        {/* 1. Kind Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-ink dark:text-ink-dark">
            What are you submitting?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['community', 'event', 'opportunity'] as SubmissionKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition-all text-center ${
                  kind === k
                    ? 'border-terracotta bg-terracotta text-white shadow-sm'
                    : 'border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark hover:border-sand-dark'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Basic Information */}
        <div className="flex flex-col gap-4">
          <TextField
            label="Title"
            placeholder={
              kind === 'community'
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
            label="Short Summary"
            placeholder="One-line summary for cards and search results"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            helperText="Between 10 and 160 characters"
          />

          <Textarea
            label="Full Description"
            placeholder="Detailed information for students..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            helperText="Plain text only. Line breaks are preserved."
          />

          {categories.length > 0 && (
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          )}
        </div>

        {/* 3. Kind-Specific Details */}
        {kind === 'event' && (
          <div className="p-5 rounded-2xl bg-sand-light dark:bg-sand-light-dark border border-sand-dark dark:border-sand-dark-dark flex flex-col gap-4">
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
          <div className="p-5 rounded-2xl bg-sand-light dark:bg-sand-light-dark border border-sand-dark dark:border-sand-dark-dark flex flex-col gap-4">
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
            className="text-sm text-ink-muted dark:text-ink-muted-dark file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-terracotta file:text-white hover:file:bg-terracotta-hover cursor-pointer"
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
