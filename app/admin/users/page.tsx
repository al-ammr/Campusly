'use client';

import * as React from 'react';
import { Users, UserPlus, Shield, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react';

interface AdminAccount {
  id: string;
  email: string;
  role: string;
  active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newRole, setNewRole] = React.useState('reviewer');
  const [newPassword, setNewPassword] = React.useState('@Reviewer2026$');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setMessage({ type: 'error', text: 'Lead privilege required.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load admin accounts.' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to create admin.' });
        return;
      }

      setMessage({ type: 'success', text: `Created admin account for ${newEmail}.` });
      setShowAddModal(false);
      setNewEmail('');
      await fetchUsers();
    } catch {
      setMessage({ type: 'error', text: 'Network error creating account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 dark:border-border-dark/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-ink-dark flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              Administrative Roles &amp; Delegations
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cypress-green text-white font-bold">
              LEAD ACCESS ONLY
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            Role model Reviewer, Finance, and Lead per D08 Section 3 &amp; D07 BR-260 to BR-265.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-surface-raised text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cypress-green dark:bg-cypress-green-dark text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Administrator</span>
          </button>
        </div>
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

      {/* Users Table */}
      <div className="bg-surface dark:bg-surface-dark border border-border/80 dark:border-border-dark/80 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-sand-light/50 dark:bg-surface-raised-dark text-ink-muted uppercase tracking-wider font-mono border-b border-border/60">
            <tr>
              <th className="px-5 py-3">Administrator</th>
              <th className="px-5 py-3">Delegated Role</th>
              <th className="px-5 py-3">Account State</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3">Created On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 dark:divide-border-dark/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-ink-muted text-xs">
                  Loading accounts register...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-ink-muted text-xs">
                  No administrators returned.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-sand-light/20 dark:hover:bg-surface-raised/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-ink dark:text-ink-dark">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center font-mono text-xs">
                        {u.email[0].toUpperCase()}
                      </div>
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-surface-raised border border-border">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-ink-muted">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-NG') : 'Never'}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-ink-muted">
                    {new Date(u.created_at).toLocaleDateString('en-NG')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface dark:bg-surface-dark border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-ink dark:text-ink-dark flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" />
              Invite Administrative Member
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Creates a secure university administrator account with role-based restrictions.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">University Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. j.doe@abu.edu.ng"
                  className="w-full p-2.5 rounded-lg border border-border bg-surface-raised text-ink text-xs focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface-raised text-ink text-xs focus:ring-1 focus:ring-accent"
                >
                  <option value="reviewer">Reviewer (Queue moderation &amp; decisions)</option>
                  <option value="finance">Finance (Spotlight payments &amp; bank verifications)</option>
                  <option value="lead">Lead (Full permissions, settings, accounts)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Initial Password (min 12 chars)</label>
                <input
                  type="text"
                  required
                  minLength={12}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface-raised text-ink font-mono text-xs focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-cypress-green text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
