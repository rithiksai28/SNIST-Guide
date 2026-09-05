// ============================================================================
// SNIST GUIDE - Administrator Authentication Portal
// File: /src/components/admin/AdminLogin.tsx
// ============================================================================

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, KeyRound, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { adminLogin } from '../../lib/api';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: AdminUser) => void;
  onBackToPublic: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToPublic }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(email.trim(), password);
      if (res.success && res.token && res.user) {
        onLoginSuccess(res.token, res.user);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setErrorMessage('A network error occurred while connecting to the admin service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Geometric background dot grid */}
      <div className="pointer-events-none absolute inset-0 geometric-dot-grid opacity-60" />

      {/* Top Bar with back to public button */}
      <div className="relative mx-auto w-full max-w-md flex items-center justify-between">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          id="btn-back-to-public"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Public Platform
        </button>

        <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
          SECURE PORTAL
        </span>
      </div>

      {/* Main Login Card */}
      <div className="relative mx-auto w-full max-w-md mt-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#0A192F] text-white shadow-md">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>

            <h2 className="font-display mt-5 text-2xl font-black tracking-tight text-[#0A192F] sm:text-3xl">
              SNIST GUIDE ADMIN
            </h2>
            <p className="mt-1 font-mono text-[11px] font-bold tracking-widest uppercase text-blue-600">
              STUDY SMART. SCORE BETTER.
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Authorized administrator access only. Sign-up and public registrations are restricted.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Demo / Admin Credentials Helper Card */}
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-900">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Default Admin Credentials
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@snistguide.edu');
                  setPassword('admin123');
                }}
                className="rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white transition hover:bg-blue-700"
              >
                Auto-fill
              </button>
            </div>
            <div className="mt-2 font-mono text-[11px] text-slate-700 space-y-0.5">
              <p><span className="text-slate-400">Email:</span> admin@snistguide.edu</p>
              <p><span className="text-slate-400">Password:</span> admin123</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>
              <div className="relative mt-1.5 flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@snistguide.edu"
                  className="w-full rounded border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <div className="relative mt-1.5 flex items-center">
                <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded bg-[#0A192F] py-3 text-xs font-bold tracking-widest uppercase text-white shadow-md transition hover:bg-blue-600 disabled:opacity-50"
              id="btn-admin-login"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  AUTHENTICATING...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <p className="text-[11px] text-slate-400">
              All administrative operations are encrypted and audited. Public visitors do not require accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative mt-8 text-center text-[11px] text-slate-400">
        <p>© 2026 SNIST GUIDE • Academic Content Management System</p>
      </div>
    </div>
  );
}
