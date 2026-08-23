'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, ArrowUpRight, Loader2, Building, CheckCircle2, User, Phone, Lock } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/app';
  const { user, login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [colleges, setColleges] = useState<any[]>([]);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('student123');

  // Register Form
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('dgvaishnav');
  const [selectedCourse, setSelectedCourse] = useState('dgvc_bcom_gen');
  const [selectedYear, setSelectedYear] = useState('2');
  const [selectedSection, setSelectedSection] = useState('B');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, redirectPath, router]);

  useEffect(() => {
    fetch('/api/colleges')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setColleges(d.colleges);
      })
      .catch(console.error);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const ok = await login(loginIdentifier || '9876543210', loginPassword);
      if (ok) {
        router.push(redirectPath);
      } else {
        setErrorMsg('Invalid mobile number or credentials. Please check or register.');
      }
    } catch {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const ok = await register({
        fullName,
        mobile,
        collegeId: selectedCollege,
        courseId: selectedCourse,
        year: parseInt(selectedYear, 10),
        section: selectedSection,
      });

      if (ok) {
        router.push(redirectPath);
      } else {
        setErrorMsg('Registration failed. Please check your details.');
      }
    } catch {
      setErrorMsg('Registration error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-3 sm:px-4 py-8 sm:py-16 space-y-6 sm:space-y-8 text-[#121316] w-full min-w-0">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full border border-stone-900 flex items-center justify-center text-stone-900 mx-auto bg-stone-50">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">
          {mode === 'login' ? 'Student Login' : 'Student Registration'}
        </h1>
        <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
          {mode === 'login'
            ? 'Access your Chennai college academic notes, marketplace, and study groups.'
            : 'Join your Chennai college community to buy and sell verified notes.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer ${
            mode === 'login' ? 'bg-[#121316] text-white shadow-xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer ${
            mode === 'register' ? 'bg-[#121316] text-white shadow-xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          New Student Register
        </button>
      </div>

      {/* Login Box */}
      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="warm-card rounded-[28px] p-8 space-y-5 text-xs text-stone-800">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Mobile Number or Email *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 9876543210 or student@dgvaishnav.edu.in"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Login to Platform</span> <ArrowUpRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>
      ) : (
        // Register Form
        <form onSubmit={handleRegisterSubmit} className="warm-card rounded-[28px] p-8 space-y-4 text-xs text-stone-800">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium focus:outline-hidden focus:border-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              College *
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-hidden"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.shortName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Course / Group *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-2 text-xs text-stone-900 font-semibold focus:outline-hidden"
              >
                <option value="dgvc_bcom_gen">B.Com</option>
                <option value="loyola_bsc_cs">B.Sc CS</option>
                <option value="srm_btech_cse">B.Tech</option>
                <option value="mcc_bcom">BBA / BCA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Year *
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-2 text-xs text-stone-900 font-semibold focus:outline-hidden"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Section *
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value.toUpperCase())}
                placeholder="B"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2 py-2 text-xs text-stone-900 font-bold text-center focus:outline-hidden"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#121316] hover:bg-black text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Register & Enter Marketplace</span> <ArrowUpRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-stone-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
