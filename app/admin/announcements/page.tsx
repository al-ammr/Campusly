'use client';

import * as React from 'react';
import { Bell, Plus, Pin, CheckCircle2, AlertCircle, RefreshCw, Trash2, Eye } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  status: string;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = React.useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal State
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const [newPinned, setNewPinned] = React.useState(false);
  const [newEndsAt, setNewEndsAt] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setItems(data.announcements || []);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await fetch(`/api/v1/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({ pinned: !currentPinned }),
      });
      await fetchAnnouncements();
    } catch {
      // Error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this announcement?')) return;
    try {
      await fetch(`/api/v1/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'x-campusly-action': '1' },
      });
      await fetchAnnouncements();
    } catch {
      // Error
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/v1/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          pinned: newPinned,
          ends_at: newEndsAt ? new Date(newEndsAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to create notice.' });
        return;
      }

      setMessage({ type: 'success', text: 'Announcement published successfully.' });
      setShowCreateModal(false);
      setNewTitle('');
      setNewBody('');
      setNewPinned(false);
      setNewEndsAt('');
      await fetchAnnouncements();
    } catch {
      setMessage({ type: 'error', text: 'Network error creating announcement.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: '#E0D7C6' }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: '#2D1810' }}>
            <Bell className="w-5 h-5" style={{ color: '#7C4A27' }} />
            Campus Notices
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#8C7364' }}>
            Publish alerts and bulletins to students across Samaru and Kongo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAnnouncements}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
            style={{ borderColor: '#E0D7C6', color: '#6B5344', background: '#FFFFF0' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors hover:opacity-90"
            style={{ background: '#4A2E1B', color: '#FFFFF0' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Notice</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
            message.type === 'success'
              ? 'border-emerald-200 text-emerald-700'
              : 'border-rose-200 text-rose-700'
          }`}
          style={message.type === 'success' ? { background: '#f0fdf4' } : { background: '#fff1f2' }}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="rounded-xl shadow-sm overflow-hidden border" style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}>
        {loading ? (
          <div className="py-16 text-center text-xs space-y-2" style={{ color: '#8C7364' }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#7C4A27', borderTopColor: 'transparent' }} />
            <p>Loading notices...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-xs space-y-2" style={{ color: '#8C7364' }}>
            <Bell className="w-8 h-8 mx-auto opacity-40" style={{ color: '#7C4A27' }} />
            <p className="font-semibold" style={{ color: '#2D1810' }}>No active notices</p>
            <p>Publish a bulletin to broadcast alerts to students across Kongo and Samaru.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#E0D7C6' }}>
            {items.map((notice) => (
              <div
                key={notice.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:opacity-95"
                style={{ background: 'transparent' }}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: '#2D1810' }}>
                      {notice.title}
                    </span>
                    {notice.pinned && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border flex items-center gap-1" style={{ background: '#FFF3CD', color: '#7C4A27', borderColor: '#E0D7C6' }}>
                        <Pin className="w-3 h-3" style={{ color: '#7C4A27' }} />
                        Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase" style={{ background: '#F7F4EB', color: '#8C7364', borderColor: '#E0D7C6' }}>
                      {notice.status}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#6B5344' }}>
                    {notice.body}
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: '#8C7364' }}>
                    Published: {new Date(notice.starts_at).toLocaleDateString('en-NG')}
                    {notice.ends_at && ` • Expires: ${new Date(notice.ends_at).toLocaleDateString('en-NG')}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePin(notice.id, notice.pinned)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1`}
                    style={notice.pinned
                      ? { background: '#FFF3CD', color: '#7C4A27', borderColor: '#E0D7C6' }
                      : { background: '#F7F4EB', color: '#6B5344', borderColor: '#E0D7C6' }
                    }
                  >
                    <Pin className={`w-3.5 h-3.5`} />
                    <span>{notice.pinned ? 'Unpin' : 'Pin to Top'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notice.id)}
                    className="p-2 rounded-lg border cursor-pointer transition-colors hover:border-rose-300 hover:text-rose-600"
                    style={{ borderColor: '#E0D7C6', color: '#8C7364' }}
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 border" style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}>
            <h3 className="font-bold text-base flex items-center gap-2" style={{ color: '#2D1810' }}>
              <Bell className="w-5 h-5" style={{ color: '#7C4A27' }} />
              Publish Campus Notice
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: '#2D1810' }}>Title *</label>
                <input
                  type="text"
                  required
                  maxLength={128}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mid-Semester Break Notice"
                  className="w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 border"
                  style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: '#2D1810' }}>Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Notice content to broadcast to all students..."
                  className="w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 border"
                  style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: '#2D1810' }}>Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={newEndsAt}
                    onChange={(e) => setNewEndsAt(e.target.value)}
                    className="w-full p-2 rounded-lg text-xs focus:outline-none border"
                    style={{ background: '#F7F4EB', borderColor: '#E0D7C6', color: '#2D1810' }}
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="font-semibold" style={{ color: '#2D1810' }}>Pin to Top Bar</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: '#E0D7C6' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-lg border text-xs cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: '#E0D7C6', color: '#6B5344', background: '#F7F4EB' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim() || !newBody.trim()}
                  className="px-5 py-2 rounded-lg font-semibold text-xs cursor-pointer disabled:opacity-50 transition-colors hover:opacity-90"
                  style={{ background: '#4A2E1B', color: '#FFFFF0' }}
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
