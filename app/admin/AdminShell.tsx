'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Inbox,
  Award,
  Store,
  Bell,
  ShieldAlert,
  BarChart3,
  LogOut,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';

interface AdminData {
  id: string;
  email: string;
  role: 'lead' | 'finance' | 'reviewer';
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [admin, setAdmin] = React.useState<AdminData | null>({
    id: '00000000-0000-0000-0000-000000000001',
    email: 'dscabudevs@gmail.com',
    role: 'lead',
  });
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const isLoginPage = pathname === '/admin/login';

  const checkAuth = React.useCallback(async () => {
    if (isLoginPage) return;
    try {
      const res = await fetch('/api/v1/auth/me');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.authenticated && data.admin) {
        setAdmin(data.admin);
      }
    } catch {
      // Keep state in dev mode
    }
  }, [isLoginPage, router]);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSignOut = React.useCallback(async () => {
    try {
      await fetch('/api/v1/auth/sign-out', { method: 'POST' });
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  }, [router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/review', label: 'Directory Submissions', icon: Inbox, count: 10 },
    { href: '/admin/spotlight', label: 'Spotlight (₦5,000)', icon: Award },
    { href: '/admin/showcase', label: 'Homepage Showcase', icon: Store },
    { href: '/admin/announcements', label: 'Campus Notices', icon: Bell },
    { href: '/admin/reports', label: 'Moderation Reports', icon: ShieldAlert },
    { href: '/admin/metrics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased" style={{ background: '#F5F0E8' }}>
      {/* ── TOP HEADER ── */}
      <header
        className="h-14 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 border-b"
        style={{ background: '#FFFFF0', borderColor: '#E0D7C6' }}
      >
        {/* Left: Sidebar Toggle Icon + Campusly Brand */}
        <div className="flex items-center gap-3">
          {/* ICON TO OPEN AND CLOSE SIDEPANEL */}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-[#F7F4EB] flex items-center justify-center border shadow-2xs cursor-pointer hover:shadow-xs"
            style={{ background: '#FFFFF0', borderColor: '#E0D7C6', color: '#4A2E1B' }}
            title={sidebarOpen ? 'Close sidepanel' : 'Open sidepanel'}
            aria-label={sidebarOpen ? 'Close sidepanel' : 'Open sidepanel'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <Link href="/admin/review" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#D4A373]/40 bg-[#2D1810] shadow-xs">
              <Image
                src="/inverted_logo.jpg"
                alt="Campusly"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-display font-bold text-sm tracking-tight leading-none group-hover:text-[#7C4A27] transition-colors"
                style={{ color: '#2D1810' }}
              >
                Campusly
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A06030] leading-none mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Live site link + sign out */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 hover:opacity-85"
            style={{ borderColor: '#E0D7C6', background: '#F7F4EB', color: '#6B5344' }}
            title="Open Live Public Site"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="p-1.5 rounded-lg transition-colors hover:opacity-75 cursor-pointer"
            style={{ color: '#6B5344' }}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── BODY: Sidebar + Main Content ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEPANEL: smooth collapsible transition */}
        <aside
          className={`
            flex flex-col shrink-0 transition-all duration-300 ease-in-out
            fixed md:static inset-y-14 left-0 z-30 md:z-auto
            ${
              sidebarOpen
                ? 'w-60 opacity-100 shadow-2xl md:shadow-none'
                : 'w-0 -translate-x-full md:translate-x-0 opacity-0 pointer-events-none p-0 border-none overflow-hidden'
            }
          `}
          style={{ background: '#2D1810', borderRight: sidebarOpen ? '1px solid #3D2214' : 'none' }}
        >
          {/* Sidepanel top controls: Section label & close icon */}
          <div className="p-3.5 flex items-center justify-between border-b" style={{ borderColor: '#3D2214' }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-[#D4A373]/30 bg-[#1A0D07]">
                <Image
                  src="/inverted_logo.jpg"
                  alt="Campusly Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#FFFFF0' }}
              >
                Campusly
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md transition-colors hover:bg-[#3D2214] cursor-pointer"
              style={{ color: '#D4A373' }}
              title="Close sidepanel"
              aria-label="Close sidepanel"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150
                    ${isActive ? 'shadow-sm' : 'hover:bg-[#3D2214]'}
                  `}
                  style={
                    isActive
                      ? { background: '#FFFFF0', color: '#2D1810' }
                      : { color: '#D4A373' }
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: isActive ? '#2D1810' : '#D4A373' }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: '#3D2214', color: '#D4A373' }}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Sign Out */}
          <div className="p-3 border-t" style={{ borderColor: '#3D2214' }}>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-[#3D2214] cursor-pointer"
              style={{ color: '#D4A373' }}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300"
          style={{ background: '#F5F0E8' }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
