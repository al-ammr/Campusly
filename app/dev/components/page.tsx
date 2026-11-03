'use client';

import * as React from 'react';
import {
  Button,
  TextField,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  FileUpload,
  SearchField,
  CategoryChip,
  FilterChip,
  Badge,
  CardShell,
  BottomSheet,
  Dialog,
  useToast,
  Banner,
  Skeleton,
  CardSkeleton,
  EmptyState,
  ErrorState,
  StarControl,
} from '@/components/ui';
import { useTheme } from '@/lib/theme/theme-provider';
import { Share2, Heart, Download } from 'lucide-react';

export default function ComponentShowcasePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();

  // State for interactive modals
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogLoading, setDialogLoading] = React.useState(false);

  // Trigger refs for focus restoration
  const sheetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogTriggerRef = React.useRef<HTMLButtonElement>(null);

  // State for interactive form controls
  const [selectedRadio, setSelectedRadio] = React.useState('tech');
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [filterActive, setFilterActive] = React.useState(false);
  const [starCount, setStarCount] = React.useState(42);
  const [isStarred, setIsStarred] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-12">
      {/* Header & Theme Control */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border dark:border-border-dark pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand dark:text-brand-dark">
            Developer Design System Spec
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark mt-1">
            Component Showcase
          </h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">
            Visual inspection & accessibility verification for all 19 Campusly base components.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">
            Theme ({resolvedTheme}):
          </span>
          <div className="inline-flex rounded-md border border-border dark:border-border-dark p-0.5 bg-surface dark:bg-surface-dark">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-3 py-1 text-xs font-semibold rounded capitalize transition-colors duration-fast ${
                  theme === t
                    ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 1. BUTTONS */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          1. Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="tertiary">Tertiary Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button
            variant="icon"
            aria-label="Share listing"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="primary"
            loading={buttonLoading}
            onClick={() => {
              setButtonLoading(true);
              setTimeout(() => setButtonLoading(false), 2000);
            }}
          >
            {buttonLoading ? 'Submitting…' : 'Tap to test loading'}
          </Button>
          <Button variant="primary" disabled>
            Disabled Button
          </Button>
        </div>
      </section>

      {/* 2. TEXT FIELDS & TEXTAREA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          2. Form Inputs (Text Field, Textarea, Select, Search)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Community Name"
            placeholder="e.g. Google Developer Group ABU"
            helperText="Enter the official registered or common name."
            isRequired
          />

          <TextField
            label="Contact Email"
            placeholder="contact@example.com"
            errorMessage="Please enter a valid email address."
            isRequired
          />

          <Textarea
            label="Description"
            placeholder="Describe what your community or event is about..."
            maxLength={300}
            showCharacterCount
            isRequired
          />

          <Select
            label="Primary Category"
            isRequired
            options={[
              { value: 'tech', label: 'Technology & Digital Skills' },
              { value: 'academic', label: 'Academic & Professional' },
              { value: 'business', label: 'Entrepreneurship & Business' },
            ]}
          />

          <SearchField
            label="Search demo"
            placeholder="Search with auto-suggestions..."
            suggestions={[
              { id: '1', label: 'GDGOC ABU Zaria', category: 'Technology' },
              { id: '2', label: 'Faculty of Engineering Society', category: 'Academic' },
              { id: '3', label: 'Zaria Tech Meetup', category: 'Technology' },
            ]}
          />

          <FileUpload
            label="Society Logo or Verification Proof"
            allowedTypesLabel="PNG, JPEG, WebP or PDF up to 5 MB"
            helperText="Used on community profile headers."
          />
        </div>
      </section>

      {/* 3. SELECTION CONTROLS (Checkbox, Radio, Switch) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          3. Selection Controls (Checkbox, Radio, Switch)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              Checkboxes
            </span>
            <Checkbox
              label="I agree to community standards"
              defaultChecked
            />
            <Checkbox
              label="Request official Verified seal"
              helperText="Requires proof of faculty affiliation."
            />
            <Checkbox
              label="Disabled option"
              disabled
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              Radio Group
            </span>
            <RadioGroup
              name="campus"
              value={selectedRadio}
              onChange={setSelectedRadio}
              options={[
                { value: 'samaru', label: 'Samaru Campus', hint: 'Main campus faculties' },
                { value: 'kongo', label: 'Kongo Campus', hint: 'Law and Administration' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              Switches
            </span>
            <Switch
              label="Email updates"
              description="Notify me when review completes"
              checked={switchChecked}
              onChange={setSwitchChecked}
            />
            <Switch
              label="Disabled switch"
              disabled
            />
          </div>
        </div>
      </section>

      {/* 4. CHIPS & BADGES */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          4. Category Chips, Filter Chips & Badges
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              All 10 Category Chips
            </span>
            <div className="flex flex-wrap gap-2">
              <CategoryChip category="technology" />
              <CategoryChip category="business" />
              <CategoryChip category="sustainability" />
              <CategoryChip category="academic" />
              <CategoryChip category="leadership" />
              <CategoryChip category="creative" />
              <CategoryChip category="sports" />
              <CategoryChip category="science" />
              <CategoryChip category="health" />
              <CategoryChip category="culture" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              Filter Chips
            </span>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="Free Admission"
                isSelected={filterActive}
                onToggle={setFilterActive}
              />
              <FilterChip
                label="Samaru Campus"
                isSelected={true}
                onRemove={() => {}}
              />
              <FilterChip
                label="Verified Only"
                isSelected={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark uppercase">
              Badges & Statuses
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="verified" />
              <Badge variant="closing-soon" />
              <Badge variant="paid-listing" />
              <Badge variant="new" />
              <Badge variant="pending" />
              <Badge variant="needs-info" />
              <Badge variant="approved" />
              <Badge variant="rejected" />
              <Badge variant="expired" />
              <Badge variant="awaiting-payment" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARDS & STAR CONTROL */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          5. Card Shells & Star Control
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Community Card Shell */}
          <CardShell
            href="#"
            title="GDGOC ABU Zaria"
            category="technology"
            headerBadge={<Badge variant="verified" />}
            topRightAction={
              <StarControl
                count={starCount}
                isStarred={isStarred}
                listingTitle="GDGOC ABU Zaria"
                onStar={() => {
                  setIsStarred(true);
                  setStarCount((c) => c + 1);
                }}
              />
            }
          >
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark line-clamp-2 mt-1">
              Google Developer Groups on Campus at Ahmadu Bello University. Building peer-to-peer tech solutions.
            </p>
          </CardShell>

          {/* Event Card Shell */}
          <CardShell
            href="#"
            title="Annual Tech Symposium 2026"
            category="academic"
            headerBadge={<Badge variant="closing-soon" />}
          >
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs font-semibold text-brand dark:text-brand-dark">
                Friday, 14 Nov 2026 · 4:00 PM WAT
              </span>
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Assembly Hall, Samaru Main Campus
              </span>
            </div>
          </CardShell>

          {/* Spotlight Featured Card Shell */}
          <CardShell
            href="#"
            title="Zaria Campus Bookstore"
            category="business"
            isFeatured
            headerBadge={<Badge variant="paid-listing" />}
          >
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark line-clamp-2 mt-1">
              15% discount on all engineering textbooks and project materials with student ID.
            </p>
          </CardShell>
        </div>
      </section>

      {/* 6. OVERLAYS (Bottom Sheet & Dialog) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          6. Overlays (Bottom Sheet & Confirmation Dialog)
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            ref={sheetTriggerRef}
            variant="secondary"
            onClick={() => setIsSheetOpen(true)}
          >
            Open Bottom Sheet Demo
          </Button>

          <Button
            ref={dialogTriggerRef}
            variant="destructive"
            onClick={() => setIsDialogOpen(true)}
          >
            Open Confirm Dialog Demo
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              showToast({
                type: 'success',
                message: 'Listing starred successfully.',
                action: {
                  label: 'Undo',
                  onClick: () => {},
                },
              })
            }
          >
            Show Success Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              showToast({
                type: 'error',
                message: 'Could not connect to server. Saved pages still work.',
              })
            }
          >
            Show Error Toast (8s)
          </Button>
        </div>

        {/* Sheet Instance */}
        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="Filter Communities"
          description="Select categories and meeting locations"
          triggerRef={sheetTriggerRef}
        >
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
              This sheet traps focus, closes on Escape, scrim click, or close button, and returns focus to the trigger button.
            </p>
            <TextField label="Filter by name" placeholder="Type to filter..." />
            <Button
              variant="primary"
              onClick={() => setIsSheetOpen(false)}
              className="w-full mt-2"
            >
              Apply Filters
            </Button>
          </div>
        </BottomSheet>

        {/* Dialog Instance */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={() => {
            setDialogLoading(true);
            setTimeout(() => {
              setDialogLoading(false);
              setIsDialogOpen(false);
              showToast({
                type: 'success',
                message: 'Draft discarded successfully.',
              });
            }, 1000);
          }}
          title="Discard unsaved changes?"
          consequence="You will lose any details you have entered in this submission form."
          confirmLabel="Discard draft"
          cancelLabel="Keep editing"
          isDestructive
          isLoading={dialogLoading}
          triggerRef={dialogTriggerRef}
        />
      </section>

      {/* 7. BANNERS & FEEDBACK */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          7. Banners
        </h2>
        <div className="flex flex-col gap-3">
          <Banner
            variant="offline"
            message="You are offline. Saved pages still work."
          />
          <Banner
            variant="announcement"
            message="Orientation for fresh students begins Monday 17th November at Kongo Campus."
            action={{
              label: 'Read notice',
              onClick: () => {},
            }}
            onDismiss={() => {}}
          />
          <Banner
            variant="warning"
            message="Submission limit reached for today. You can submit again tomorrow."
          />
        </div>
      </section>

      {/* 8. SKELETONS, EMPTY & ERROR STATES */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark border-b border-border/60 pb-2">
          8. Skeletons, Empty State & Error State
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />

          <div className="p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
            <EmptyState
              title="No saved items yet"
              description="Tap the star icon on any community or event to keep track of it here."
              actionLabel="Discover communities"
              onAction={() => {}}
            />
          </div>

          <div className="p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
            <ErrorState
              title="Failed to load events"
              message="We could not reach the server. Please check your data connection."
              errorCode="ERR-NET-TIMEOUT"
              onRetry={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
