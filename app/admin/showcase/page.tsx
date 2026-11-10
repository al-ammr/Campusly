'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  ShowcaseBundle,
  ShowcaseCategory,
  ShowcaseIntro,
  ShowcaseGalleryItem,
  ShowcaseCta,
  TopBusinessItem,
} from '@/lib/showcase/types';
import { DEFAULT_SHOWCASE_BUNDLE } from '@/lib/showcase/defaults';
import {
  Compass,
  Grid,
  FileText,
  Image as ImageIcon,
  MousePointer,
  Store,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
} from 'lucide-react';

export default function AdminShowcasePage() {
  const [bundle, setBundle] = React.useState<ShowcaseBundle>(DEFAULT_SHOWCASE_BUNDLE);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [activeTab, setActiveTab] = React.useState<
    'categories' | 'intro' | 'gallery' | 'cta' | 'businesses'
  >('categories');

  // Load current showcase configuration from server
  const fetchBundle = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/showcase');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setBundle(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch showcase config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBundle();
  }, [fetchBundle]);

  // Save changes to API
  const handleSave = async (specificNote?: string) => {
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await fetch('/api/v1/admin/showcase', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bundle,
          note: specificNote || 'Admin updated showcase configuration',
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.details || 'Save operation failed');
      }

      const json = await res.json();
      if (json.data) {
        setBundle(json.data);
      }
      setStatusMessage({ type: 'success', text: 'Showcase updated successfully!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving changes' });
    } finally {
      setSaving(false);
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    const newCat: ShowcaseCategory = {
      id: `cat-${Date.now()}`,
      slug: `custom-${bundle.categories.length + 1}`,
      title: 'New Exploration Category',
      subtitle: 'Category Subtitle',
      description: 'Describe what students and scholars can explore in this category.',
      icon: 'Grid',
      badge: 'New',
      href: '/explore',
      featuredCount: '10+ Items',
    };
    setBundle((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
  };

  const handleUpdateCategory = (id: string, updates: Partial<ShowcaseCategory>) => {
    setBundle((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const handleDeleteCategory = (id: string) => {
    if (bundle.categories.length <= 1) {
      alert('You must keep at least 1 exploration category.');
      return;
    }
    setBundle((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  // --- Gallery Handlers ---
  const handleAddGalleryItem = () => {
    const newItem: ShowcaseGalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'New Campus Visual',
      caption: 'Brief caption describing the showcase visual.',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      categoryTag: 'general',
      order: bundle.gallery.length + 1,
    };
    setBundle((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newItem],
    }));
  };

  const handleUpdateGalleryItem = (id: string, updates: Partial<ShowcaseGalleryItem>) => {
    setBundle((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (bundle.gallery.length <= 1) {
      alert('You must keep at least 1 gallery slide.');
      return;
    }
    setBundle((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  };

  const handleMoveGalleryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bundle.gallery.length) return;

    const copy = [...bundle.gallery];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setBundle((prev) => ({
      ...prev,
      gallery: copy.map((item, i) => ({ ...item, order: i + 1 })),
    }));
  };

  // --- Business Ranking Handlers ---
  const handleAddBusiness = () => {
    if (bundle.topBusinesses.length >= 10) {
      alert('Maximum 10 businesses allowed in the Top 10 ranking list.');
      return;
    }
    const newRank = bundle.topBusinesses.length + 1;
    const newBiz: TopBusinessItem = {
      id: `biz-${Date.now()}`,
      rank: newRank,
      name: 'New Campus Venture',
      category: 'General Services',
      score: 9.0,
      scoreMax: 10,
      reviewCount: 10,
      verified: true,
      featuredOffer: 'Student discount available',
      location: 'Samaru Campus, ABU',
      description: 'Describe this verified campus enterprise and its core offerings for students.',
      actionButton: {
        label: 'Contact on WhatsApp',
        link: 'https://wa.me/2348000000000',
        behavior: '_blank',
      },
    };
    setBundle((prev) => ({
      ...prev,
      topBusinesses: [...prev.topBusinesses, newBiz],
    }));
  };

  const handleUpdateBusiness = (id: string, updates: Partial<TopBusinessItem>) => {
    setBundle((prev) => ({
      ...prev,
      topBusinesses: prev.topBusinesses.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  };

  const handleDeleteBusiness = (id: string) => {
    setBundle((prev) => {
      const filtered = prev.topBusinesses.filter((b) => b.id !== id);
      return {
        ...prev,
        topBusinesses: filtered.map((b, i) => ({ ...b, rank: i + 1 })),
      };
    });
  };

  const handleMoveBusiness = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bundle.topBusinesses.length) return;

    const copy = [...bundle.topBusinesses];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setBundle((prev) => ({
      ...prev,
      topBusinesses: copy.map((item, i) => ({ ...item, rank: i + 1 })),
    }));
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <p className="text-xs uppercase font-mono text-ink-muted">Loading Showcase Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: '#E0D7C6' }}>
        <div>
          <h1 className="font-bold text-xl sm:text-2xl tracking-tight" style={{ color: '#2D1810' }}>
            Homepage Showcase Manager
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#8C7364' }}>
            Manage the 5 exploration categories, intro write-up, gallery slides, explore CTA, and ranked businesses.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSave('Manual admin save')}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer hover:opacity-90"
            style={{ background: '#4A2E1B' }}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/80 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'categories'
              ? 'bg-brand text-white shadow-xs'
              : 'text-ink-muted hover:text-ink hover:bg-surface-container'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>1. Categories ({bundle.categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intro')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'intro'
              ? 'bg-brand text-white shadow-xs'
              : 'text-ink-muted hover:text-ink hover:bg-surface-container'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Write-Up &amp; Intro</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'gallery'
              ? 'bg-brand text-white shadow-xs'
              : 'text-ink-muted hover:text-ink hover:bg-surface-container'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>3. Sliding Gallery ({bundle.gallery.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cta')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'cta'
              ? 'bg-brand text-white shadow-xs'
              : 'text-ink-muted hover:text-ink hover:bg-surface-container'
          }`}
        >
          <MousePointer className="w-4 h-4" />
          <span>4. Explore Button CTA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'businesses'
              ? 'bg-brand text-white shadow-xs'
              : 'text-ink-muted hover:text-ink hover:bg-surface-container'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>5. Top 10 Businesses ({bundle.topBusinesses.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: CATEGORIES MANAGER
         ======================================================== */}
      {activeTab === 'categories' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Exploration Categories Cards
              </h2>
              <p className="text-xs text-ink-muted">
                Manage the visually distinct category cards displayed on the home page showcase.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-border hover:border-brand text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bundle.categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 flex flex-col gap-4 shadow-xs"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center font-mono text-xs font-bold text-ink-muted">
                      {idx + 1}
                    </span>
                    <span className="font-display font-bold text-base text-ink dark:text-ink-dark">
                      {cat.title}
                    </span>
                    {cat.badge && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand/10 text-brand font-bold border border-brand/20">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => handleUpdateCategory(cat.id, { title: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={cat.subtitle}
                      onChange={(e) => handleUpdateCategory(cat.id, { subtitle: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={cat.href}
                      onChange={(e) => handleUpdateCategory(cat.id, { href: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={cat.badge || ''}
                      onChange={(e) => handleUpdateCategory(cat.id, { badge: e.target.value })}
                      placeholder="e.g. 150+ Active"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={2}
                    value={cat.description}
                    onChange={(e) => handleUpdateCategory(cat.id, { description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: WRITE-UP & INTRO CONTENT
         ======================================================== */}
      {activeTab === 'intro' && (
        <div className="p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 flex flex-col gap-6">
          <div>
            <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
              Showcase Write-Up &amp; Introduction
            </h2>
            <p className="text-xs text-ink-muted">
              Edit the descriptive text that introduces the showcase section and explains what each category offers.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">Main Heading</label>
              <input
                type="text"
                value={bundle.intro.title}
                onChange={(e) =>
                  setBundle((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, title: e.target.value },
                  }))
                }
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface-container text-sm text-ink dark:text-ink-dark font-display font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">Subtitle / Punchline</label>
              <input
                type="text"
                value={bundle.intro.subtitle}
                onChange={(e) =>
                  setBundle((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, subtitle: e.target.value },
                  }))
                }
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm text-ink dark:text-ink-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Body Narrative / Descriptive Write-up
              </label>
              <textarea
                rows={4}
                value={bundle.intro.body}
                onChange={(e) =>
                  setBundle((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, body: e.target.value },
                  }))
                }
                className="w-full p-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm text-ink dark:text-ink-dark leading-relaxed"
              />
            </div>
          </div>

          {/* Feature Highlight Items */}
          <div className="space-y-3 pt-4 border-t border-border/70">
            <h3 className="font-display font-bold text-sm text-ink dark:text-ink-dark">
              Three Feature Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bundle.intro.features.map((feat, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-container border border-border space-y-2">
                  <span className="text-[10px] font-mono font-bold text-brand uppercase">
                    Feature {i + 1}
                  </span>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const updated = [...bundle.intro.features];
                      updated[i] = { ...updated[i], title: e.target.value };
                      setBundle((prev) => ({
                        ...prev,
                        intro: { ...prev.intro, features: updated },
                      }));
                    }}
                    placeholder="Feature title"
                    className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => {
                      const updated = [...bundle.intro.features];
                      updated[i] = { ...updated[i], description: e.target.value };
                      setBundle((prev) => ({
                        ...prev,
                        intro: { ...prev.intro, features: updated },
                      }));
                    }}
                    placeholder="Feature description"
                    className="w-full p-2 rounded-lg border border-border bg-surface text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SLIDING GALLERY
         ======================================================== */}
      {activeTab === 'gallery' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Sliding Image Gallery Slides
              </h2>
              <p className="text-xs text-ink-muted">
                Upload image URLs, set captions, reorder slides, and delete visuals.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-border hover:border-brand text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bundle.gallery.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 flex flex-col md:flex-row gap-5 items-start md:items-center shadow-xs"
              >
                {/* Image Thumbnail */}
                <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden bg-canvas-dark shrink-0 border border-border">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] font-bold">
                    {idx + 1}
                  </span>
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Slide Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateGalleryItem(item.id, { title: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={item.categoryTag}
                      onChange={(e) =>
                        handleUpdateGalleryItem(item.id, { categoryTag: e.target.value })
                      }
                      placeholder="e.g. communities, events, businesses"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Image URL (CDN / Unsplash / Upload)
                    </label>
                    <input
                      type="url"
                      value={item.imageUrl}
                      onChange={(e) =>
                        handleUpdateGalleryItem(item.id, { imageUrl: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Caption Description
                    </label>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) =>
                        handleUpdateGalleryItem(item.id, { caption: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                </div>

                {/* Order & Delete Actions */}
                <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveGalleryItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface-container disabled:opacity-30"
                    title="Move Slide Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveGalleryItem(idx, 'down')}
                    disabled={idx === bundle.gallery.length - 1}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface-container disabled:opacity-30"
                    title="Move Slide Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: EXPLORE BUTTON CTA
         ======================================================== */}
      {activeTab === 'cta' && (
        <div className="p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 flex flex-col gap-6 max-w-2xl">
          <div>
            <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
              Explore Button Call-to-Action Settings
            </h2>
            <p className="text-xs text-ink-muted">
              Configure the primary &quot;Explore&quot; button label and destination link placed beneath the gallery.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={bundle.cta.label}
                onChange={(e) =>
                  setBundle((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, label: e.target.value },
                  }))
                }
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm text-ink dark:text-ink-dark font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Primary Destination Link
              </label>
              <input
                type="text"
                value={bundle.cta.href}
                onChange={(e) =>
                  setBundle((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, href: e.target.value },
                  }))
                }
                placeholder="e.g. /explore"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm font-mono text-ink dark:text-ink-dark"
              />
            </div>

            <div className="pt-3 border-t border-border/70 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Optional Secondary Action Button
              </span>
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Secondary Label
                </label>
                <input
                  type="text"
                  value={bundle.cta.secondaryLabel || ''}
                  onChange={(e) =>
                    setBundle((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, secondaryLabel: e.target.value },
                    }))
                  }
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm text-ink dark:text-ink-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Secondary Destination Link
                </label>
                <input
                  type="text"
                  value={bundle.cta.secondaryHref || ''}
                  onChange={(e) =>
                    setBundle((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, secondaryHref: e.target.value },
                    }))
                  }
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-surface-container text-xs sm:text-sm font-mono text-ink dark:text-ink-dark"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: TOP 10 BUSINESSES MANAGER
         ======================================================== */}
      {activeTab === 'businesses' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Top 10 Businesses Ranking &amp; Action Buttons
              </h2>
              <p className="text-xs text-ink-muted">
                Reorder rankings, adjust satisfaction scores, toggle verification, and configure each business&apos;s direct action button.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBusiness}
              disabled={bundle.topBusinesses.length >= 10}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-border hover:border-brand text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Business (Max 10)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {bundle.topBusinesses.map((biz, idx) => (
              <div
                key={biz.id}
                className="p-5 sm:p-6 rounded-2xl bg-surface dark:bg-surface-dark border border-border/80 flex flex-col gap-4 shadow-xs"
              >
                {/* Header row: Rank pod + Name + Score + Reorder/Delete */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs text-white ${
                        biz.rank === 1
                          ? 'bg-amber-500'
                          : biz.rank === 2
                          ? 'bg-slate-400'
                          : biz.rank === 3
                          ? 'bg-amber-700'
                          : 'bg-brand'
                      }`}
                    >
                      {biz.rank}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-ink dark:text-ink-dark">
                        {biz.name}
                      </h3>
                      <span className="text-[11px] text-ink-muted">{biz.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveBusiness(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-container disabled:opacity-30"
                      title="Promote Rank"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBusiness(idx, 'down')}
                      disabled={idx === bundle.topBusinesses.length - 1}
                      className="p-1.5 rounded-lg border border-border hover:bg-surface-container disabled:opacity-30"
                      title="Demote Rank"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBusiness(biz.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Business"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={biz.name}
                      onChange={(e) => handleUpdateBusiness(biz.id, { name: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={biz.category}
                      onChange={(e) => handleUpdateBusiness(biz.id, { category: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Rating Score (out of 10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={biz.score}
                      onChange={(e) =>
                        handleUpdateBusiness(biz.id, { score: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Campus Location
                    </label>
                    <input
                      type="text"
                      value={biz.location}
                      onChange={(e) => handleUpdateBusiness(biz.id, { location: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>
                </div>

                {/* Offer & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Special Offer / Deal for Students
                    </label>
                    <input
                      type="text"
                      value={biz.featuredOffer || ''}
                      onChange={(e) => handleUpdateBusiness(biz.id, { featuredOffer: e.target.value })}
                      placeholder="e.g. 10% off with ABU ID"
                      className="w-full h-9 px-3 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink dark:text-ink-dark">
                      <input
                        type="checkbox"
                        checked={biz.verified}
                        onChange={(e) => handleUpdateBusiness(biz.id, { verified: e.target.checked })}
                        className="rounded border-border text-brand focus:ring-brand w-4 h-4"
                      />
                      <span>Verified Business Badge</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={biz.description}
                    onChange={(e) => handleUpdateBusiness(biz.id, { description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-surface-container text-xs text-ink dark:text-ink-dark leading-relaxed"
                  />
                </div>

                {/* Action Button Configuration Box */}
                <div className="p-4 rounded-xl bg-surface-container/60 border border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand dark:text-brand-dark">
                      Action Button Settings
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      Determines what happens when a user clicks the business button
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-ink-muted mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={biz.actionButton.label}
                        onChange={(e) =>
                          handleUpdateBusiness(biz.id, {
                            actionButton: { ...biz.actionButton, label: e.target.value },
                          })
                        }
                        placeholder="e.g. Contact on WhatsApp"
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-ink-muted mb-1">
                        Destination Link (URL / WhatsApp / Phone)
                      </label>
                      <input
                        type="text"
                        value={biz.actionButton.link}
                        onChange={(e) =>
                          handleUpdateBusiness(biz.id, {
                            actionButton: { ...biz.actionButton, link: e.target.value },
                          })
                        }
                        placeholder="https://wa.me/234..."
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-surface text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-ink-muted mb-1">
                        Link Behavior
                      </label>
                      <select
                        value={biz.actionButton.behavior}
                        onChange={(e) =>
                          handleUpdateBusiness(biz.id, {
                            actionButton: {
                              ...biz.actionButton,
                              behavior: e.target.value as '_self' | '_blank',
                            },
                          })
                        }
                        className="w-full h-8 px-2 rounded-lg border border-border bg-surface text-xs"
                      >
                        <option value="_blank">Open in New Tab (_blank)</option>
                        <option value="_self">Open in Same Tab (_self)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
