'use client';

import * as React from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle, RefreshCw, Lock, History } from 'lucide-react';

interface SettingItem {
  key: string;
  value: any;
  type: string;
  description: string;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<SettingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState<string>('');
  const [editNote, setEditNote] = React.useState<string>('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || []);
      } else {
        setMessage({ type: 'error', text: 'Lead permission required to view system settings.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleStartEdit = (item: SettingItem) => {
    setEditingKey(item.key);
    setEditValue(typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value));
    setEditNote('');
    setMessage(null);
  };

  const handleSave = async (key: string) => {
    setIsSaving(true);
    setMessage(null);

    let parsedValue: any = editValue;
    try {
      parsedValue = JSON.parse(editValue);
    } catch {
      // Keep as string or number if parsing fails
      if (!isNaN(Number(editValue))) {
        parsedValue = Number(editValue);
      }
    }

    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          key,
          value: parsedValue,
          note: editNote.trim() || 'Admin manual parameter update',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to update setting.' });
        return;
      }

      setMessage({ type: 'success', text: `Successfully updated "${key}".` });
      setEditingKey(null);
      await fetchSettings();
    } catch {
      setMessage({ type: 'error', text: 'Network error saving setting.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-border-dark/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-ink-dark flex items-center gap-2">
              <Sliders className="w-6 h-6 text-accent" />
              Runtime Business Rules &amp; Parameters
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cypress-green text-white font-bold">
              LEAD ACCESS ONLY
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Single authoritative register for caps, thresholds, and monetary fees per D07 &amp; D05 Section 7.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-surface-raised text-xs font-medium cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-danger/10 text-danger border border-danger/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Settings Table */}
      <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-ink-muted space-y-2">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading authoritative settings register...</p>
          </div>
        ) : settings.length === 0 ? (
          <div className="py-16 text-center text-xs text-ink-muted">
            No settings register entries found in database.
          </div>
        ) : (
          <div className="divide-y divide-border/60 dark:divide-border-dark/60">
            {settings.map((item) => {
              const isEditing = editingKey === item.key;

              return (
                <div
                  key={item.key}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-sand-light/20 dark:hover:bg-surface-raised/40 transition-colors"
                >
                  <div className="space-y-1 md:max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cypress-green dark:text-cypress-green-dark">
                        {item.key}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-raised border text-ink-muted uppercase">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                      {item.description || 'Configurable runtime constraint.'}
                    </p>
                    <p className="text-[10px] text-ink-muted/80 font-mono">
                      Last modified: {new Date(item.updated_at).toLocaleString('en-NG')}
                    </p>
                  </div>

                  {/* Value / Edit Panel */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-xs font-mono w-32 focus:ring-1 focus:ring-accent"
                          placeholder="Value"
                        />
                        <input
                          type="text"
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-xs w-48 focus:ring-1 focus:ring-accent"
                          placeholder="Audit change justification..."
                        />
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSave(item.key)}
                            className="px-3 py-1.5 rounded-lg bg-cypress-green text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingKey(null)}
                            className="px-2.5 py-1.5 rounded-lg border border-border text-xs text-ink-muted hover:text-ink cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-ink dark:text-ink-dark block">
                            {item.type === 'kobo'
                              ? `₦${(Number(item.value) / 100).toLocaleString()}`
                              : typeof item.value === 'object'
                              ? JSON.stringify(item.value)
                              : String(item.value)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-raised text-xs font-medium text-ink cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
