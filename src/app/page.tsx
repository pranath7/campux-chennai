'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/lib/brandConfig';
import {
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Compass,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Building,
  GraduationCap,
  FileText,
  Video,
  ChevronDown,
  Lock,
  Layers,
  Search,
  Zap,
  Crown,
} from 'lucide-react';

export default function PublicLandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const colleges = [
    { name: 'DG Vaishnav College', short: 'DGVC', city: 'Arumbakkam' },
    { name: 'Loyola College', short: 'Loyola', city: 'Nungambakkam' },
    { name: 'Madras Christian College', short: 'MCC', city: 'Tambaram' },
    { name: 'SRM IST', short: 'SRM', city: 'Kattankulathur' },
    { name: 'VIT Chennai', short: 'VIT', city: 'Vandalur' },
    { name: 'Hindustan University', short: 'HITS', city: 'Padur' },
  ];

  const categories = [
    { title: 'Revision Notes', desc: 'Concise high-yield concept breakdowns' },
    { title: 'Handwritten Notes', desc: 'Legible lecture diagrams & worked steps' },
    { title: 'Important Questions', desc: 'Exam-focused expected 5 & 10 markers' },
    { title: 'Formula Sheets', desc: 'Quick-recall cheat sheets & ratios' },
    { title: 'PYQ Solutions', desc: 'Solved 5-year semester exam papers' },
    { title: 'Live Study Groups', desc: 'Peer-led interactive problem sessions' },
  ];

  const faqs = [
    {
      q: 'How do I access academic notes on Campux?',
      a: 'Click "Buy Notes" to register or login with your student mobile number. Browse your college subjects, select the note you need, make the payment, and upload your payment screenshot and UTR ID. Once verified, the notes unlock in My Purchases.',
    },
    {
      q: 'Can I access notes from other Chennai colleges?',
      a: 'Yes! Our Smart Cross-College Match enables students from DG Vaishnav, Loyola, MCC, SRM, and VIT to discover compatible notes for common university syllabi such as Financial Accounting, Costing, and Data Structures.',
    },
    {
      q: 'How does payment verification work?',
      a: 'Payments are made directly via UPI QR. After paying, you submit your 12-digit UTR transaction ID and payment screenshot. Our team verifies the transaction and instantly unlocks your high-resolution download.',
    },
    {
      q: 'How do I sell my own study notes?',
      a: 'After registering as a verified student, go to "Sell Notes", upload your PDF/document, set your fair student price (e.g. ₹29 - ₹99), and receive payouts directly to your UPI when classmates buy.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-24 pb-16 sm:pb-20 text-[#121316] w-full max-w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-20 text-center max-w-5xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
        {/* Institutional Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-300 bg-stone-100/80 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-stone-700">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
          <span>Chennai Verified Student Network</span>
        </div>

        {/* Large Editorial Headline */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 leading-[1.1] break-words">
          Your College. Your Community.{' '}
          <span className="block text-stone-500 font-medium">Your Academic Marketplace.</span>
        </h1>

        {/* Subheading */}
        <p className="text-xs sm:text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Buy, sell and discover academic resources from verified students across Chennai premier institutions.
        </p>

        {/* Primary CTA (Buy Notes) & Secondary (Sell Notes) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
          {user ? (
            <Link
              href="/app"
              className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white px-8 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
            >
              <span>Go to Student Hub</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          ) : (
            <Link
              href="/login?redirect=/app"
              className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white px-8 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
            >
              <span>Buy Notes</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          )}

          <Link
            href={user ? '/sell' : '/login?redirect=/sell'}
            className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 px-6 py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            Sell Notes
          </Link>
        </div>
      </section>

      {/* 2. CHENNAI CAMPUS TICKER */}
      <section className="border-y border-stone-200 bg-white/60 py-3 sm:py-5 overflow-hidden w-full max-w-full min-w-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-3 w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 text-stone-900 shrink-0 pr-2 border-r border-stone-200">
            <Building className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Campuses</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-8 overflow-x-auto no-scrollbar flex-1 min-w-0 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-600">
            {colleges.map((c) => (
              <span key={c.short} className="hover:text-black transition-colors whitespace-nowrap shrink-0 bg-stone-100 sm:bg-transparent px-2.5 py-0.5 sm:p-0 rounded-full">
                {c.short || c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#059669]">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-black text-stone-900">How Campux Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="warm-card rounded-[28px] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-black text-base text-stone-900">
              01
            </div>
            <h3 className="text-lg font-bold text-stone-900">1. Student Registration</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Identify your Chennai college, course, year, and section. Get instant access to peer-curated study material.
            </p>
          </div>

          <div className="warm-card rounded-[28px] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-black text-base text-stone-900">
              02
            </div>
            <h3 className="text-lg font-bold text-stone-900">2. Explore Verified Notes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Search by subject, formula sheets, or exam question papers. Preview summaries before purchasing.
            </p>
          </div>

          <div className="warm-card rounded-[28px] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-black text-base text-stone-900">
              03
            </div>
            <h3 className="text-lg font-bold text-stone-900">3. Pay & Download</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pay via UPI, upload your UTR ID, and get instant verified unlock to high-resolution notes in My Purchases.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ACADEMIC MARKETPLACE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#059669]">
              Curated by High Rankers
            </span>
            <h2 className="text-3xl font-black text-stone-900">Academic Marketplace</h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1"
          >
            <span>Browse All Resources</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="warm-card rounded-[24px] p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-800">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-stone-900">{cat.title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMING SOON: AI FLASHCARDS, SUMMARIES & MEMBERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-[32px] p-6 sm:p-10 lg:p-12 border border-stone-700 shadow-2xl relative overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Next-Gen AI Roadmap</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                AI Flashcards, Cheat Sheets & Monthly Membership.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                We are building automatic active-recall flashcard generation, instant module summaries, and an all-access monthly pass for Chennai students.
              </p>
            </div>

            <Link
              href="/coming-soon"
              className="bg-[#059669] hover:bg-[#047857] text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>Explore Roadmap & Join VIP Beta</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-700/60">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">AI Flashcard Maker</h4>
              <p className="text-xs text-stone-400">Transform any PDF notes into active-recall flashcard decks.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">AI Instant Summaries</h4>
              <p className="text-xs text-stone-400">1-page exam cheat sheets & key formula extractions.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-100">Monthly Pass</h4>
              <p className="text-xs text-stone-400">Unlimited downloads and AI tools for a single flat fee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST, SAFETY & VERIFICATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="warm-card rounded-[32px] p-8 sm:p-12 border border-stone-200 bg-white space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#059669]">
                Zero Spam • 100% Student Vetted
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
                Peer Credibility & Academic Trust
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every resource creator is verified using institutional identity, peer reviews, and syllabus accuracy ratings. Unverified or misleading uploads are removed by moderation.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Strict verification with student credentials</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Transparent UPI payment confirmation & admin verification</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Licensed digital downloads with student ownership</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-700">Verified Seller Standards</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                "Top students from DG Vaishnav, Loyola, and MCC upload their revision notes here to help their juniors ace university exams."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Chennai Academic Network</p>
                  <p className="text-[10px] text-stone-400">DGVC • Loyola • MCC • SRM • VIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#059669]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">Have Questions?</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="warm-card rounded-2xl p-5 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900">{faq.q}</h4>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="warm-card rounded-[36px] p-10 sm:p-16 border border-stone-200 bg-stone-900 text-white space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Join Your College Community Today
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Get instant access to top-ranking notes, syllabus-specific question banks, and live study groups from students in your batch.
          </p>
          <div className="pt-2">
            <Link
              href={user ? '/app' : '/login?redirect=/app'}
              className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg cursor-pointer"
            >
              <span>{user ? 'Open Student Platform' : 'Buy Notes Now'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
