'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, KeyRound, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('admin@campux.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMsg('Failed to connect to admin authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E131F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#059669] to-emerald-400 p-0.5 shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-[#121827] rounded-[14px] flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-9 h-9" />
            </div>
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black tracking-tight text-white">
          Admin Portal Authentication
        </h2>
        <p className="mt-2 text-center text-xs text-stone-400 font-medium max-w-xs mx-auto">
          Authorized administrative access only. All actions are logged and audited.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#161D2F] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-stone-800">
          <form className="space-y-6" onSubmit={handleAdminLogin}>
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                Admin Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@campux.in or Mobile"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D121F] border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                Master Security Key / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D121F] border border-stone-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-stone-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-black bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating Master Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
            ← Return to Public Student Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
