'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  User,
  Lock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLoginPage() {
  // Never auto-populate credentials - start completely blank
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error?.message || 'Authentication failed. Please check credentials.');
        return;
      }

      // Successful sign in -> navigate to review console
      window.location.href = '/admin/review';
    } catch {
      setError('Network connection failed. Please check connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2D1810] via-[#3D2214] to-[#1A0D07] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Centered Floating Card - Pure Ivory background with warm brown accents */}
      <div className="w-full max-w-4xl rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl bg-[#FFFFF0] border border-[#E5DEC9] grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
        {/* ========================================================
            LEFT SIDE: WELCOME PANEL (Shades of Warm Brown & Ivory)
           ======================================================== */}
        <div className="relative bg-gradient-to-b from-[#3D2214] via-[#2D1810] to-[#1A0D07] p-8 sm:p-12 text-[#FFFFF0] flex flex-col justify-between overflow-hidden">
          {/* Organic 3D Floating Spheres in Warm Brown, Caramel & Bronze */}
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-[#1A0D07] via-[#4A2E1B] to-[#7C4A27] shadow-2xl pointer-events-none opacity-90 blur-[1px]"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-8 right-6 w-44 h-44 rounded-full bg-gradient-to-tr from-[#2D1810] via-[#5C3317] to-[#A06030] shadow-xl pointer-events-none opacity-90 blur-[1px]"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-[#5C3317] to-[#D97706] opacity-35 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[#D4A373]/30 shadow-xs shrink-0 bg-[#2D1810]">
              <Image
                src="/inverted_logo.jfif"
                alt="Campusly Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[#FFFFF0]">
              Campusly
            </span>
          </div>

          {/* Center Welcome Copy */}
          <div className="relative z-10 space-y-3 my-auto py-8">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-wide text-[#FFFFF0] leading-tight">
              WELCOME
            </h1>
            <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#D4A373]">
              Campusly Admin Console
            </p>
            <p className="text-xs sm:text-sm text-[#FAF6EE]/80 leading-relaxed max-w-sm pt-2">
              Review and approve campus club registrations, verify student events, and manage verified commercial listings across Samaru and Kongo campuses.
            </p>
          </div>

          {/* Bottom Trust Tag */}
          <div className="relative z-10 pt-4 flex items-center gap-2 text-[11px] font-medium text-[#FAF6EE]/75">
            <ShieldCheck className="w-4 h-4 text-[#D4A373] shrink-0" strokeWidth={2} />
            <span>Ahmadu Bello University • Secured by GDGOC</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: SIGN IN FORM (Ivory Canvas with Brown Accents)
           ======================================================== */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#FFFFF0]">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2D1810] tracking-tight">
                Sign in
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5344] leading-relaxed">
                Enter your administrative credentials to continue.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Name / Email Input */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-xl bg-[#F7F4EB] px-4 py-3 border border-[#E0D7C6] focus-within:border-[#7C4A27] focus-within:bg-[#FFFFF0] transition-all">
                  <User className="w-4 h-4 text-[#8C7364] shrink-0 mr-3" strokeWidth={2} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="User Name / Email"
                    autoComplete="username"
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#2D1810] placeholder:text-[#A08C7D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative flex items-center rounded-xl bg-[#F7F4EB] px-4 py-3 border border-[#E0D7C6] focus-within:border-[#7C4A27] focus-within:bg-[#FFFFF0] transition-all">
                  <Lock className="w-4 h-4 text-[#8C7364] shrink-0 mr-3" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#2D1810] placeholder:text-[#A08C7D] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-[11px] font-bold text-[#7C4A27] hover:text-[#4A2E1B] uppercase tracking-wider cursor-pointer"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#5C4535] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0C5B0] text-[#4A2E1B] focus:ring-[#7C4A27]"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-xs text-[#8C7364]">
                  Contact lead admin if lost
                </span>
              </div>

              {/* Primary Action Button - Rich Brown with Ivory Text */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#4A2E1B] hover:bg-[#381F12] text-[#FFFFF0] font-bold text-sm tracking-wide shadow-md shadow-[#2D1810]/20 transition-all duration-150 hover:shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-[#FFFFF0] border-t-transparent animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
