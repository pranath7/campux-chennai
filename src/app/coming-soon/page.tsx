'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '@/lib/haptics';
import {
  Sparkles,
  Zap,
  BookOpen,
  Crown,
  CheckCircle2,
  ArrowRight,
  Clock,
  Send,
  MessageCircle,
  Share2,
  GraduationCap,
  ShieldCheck,
  Flame,
  Layers,
} from 'lucide-react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<'flashcards' | 'summary' | 'membership'>('flashcards');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          featureInterest: selectedInterest,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        triggerHaptic('success');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(data.error || 'Failed to join waitlist.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingFeatures = [
    {
      id: 'flashcards',
      badge: 'AI Smart Engine',
      title: 'AI Flashcard Maker from Notes',
      tagline: 'Turn 40-page PDFs into interactive active-recall decks in 10 seconds.',
      icon: Zap,
      accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500',
      timeline: 'Q2 2026 (Beta in May)',
      highlights: [
        'Automatic definition & key theorem extraction',
        'Spaced repetition algorithm tailored for semester exams',
        'Interactive flip & self-assessment quiz mode',
        'Export to Anki / Mobile Flashcard Player',
      ],
    },
    {
      id: 'summary',
      badge: 'AI Synthesis',
      title: 'AI Instant Summary & Key Drivers',
      tagline: 'Get 1-page executive cheat sheets and formula tables before entering the exam hall.',
      icon: Sparkles,
      accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500',
      timeline: 'Q2 2026 (Beta in June)',
      highlights: [
        '5-minute cram summaries of full university modules',
        'Formula & ledger adjustment extraction tables',
        'Past-year exam question frequency analysis',
        'Downloadable quick-revision PDF sheets',
      ],
    },
    {
      id: 'membership',
      badge: 'All-Access Pass',
      title: 'Monthly Unlimited Student Membership',
      tagline: 'Unlimited note downloads, AI doubt solving, and priority peer cohorts for one flat monthly price.',
      icon: Crown,
      accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-500',
      timeline: 'Q3 2026 (Launch in July)',
      highlights: [
        'Zero individual download fees across all Chennai college notes',
        'Unlimited AI Flashcard & Summary generations',
        'Complimentary entry to all live peer study groups',
        'Early access to university semester question bank solutions',
      ],
    },
  ];

  return (
    <div className="min-h-screen text-[#121316] py-8 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 sm:space-y-16 w-full min-w-0">
      {/* 1. HERO & PRODUCT DIRECTION */}
      <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-stone-900 text-emerald-400 text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full border border-stone-700 shadow-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Product Roadmap & Next Generation Features</span>
        </div>

        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-tight break-words">
          The Future of Student Learning is Coming to Chennai.
        </h1>

        <p className="text-xs sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
          We are expanding Campux beyond note trading. Experience AI-powered active recall, instant syllabus synthesis, and unlimited academic memberships designed specifically for your semester curriculum.
        </p>

        {/* Timeline Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-stone-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-700 border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-[#059669]" />
            <span>Target Beta: Summer 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-[#059669] px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Chennai Campus Exclusive</span>
          </div>
        </div>
      </div>

      {/* 2. THREE UPCOMING FEATURE DEEP-DIVES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingFeatures.map((feat) => {
          const Icon = feat.icon;
          const isSelected = selectedInterest === feat.id;

          return (
            <div
              key={feat.id}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedInterest(feat.id as 'flashcards' | 'summary' | 'membership');
              }}
              className={`warm-card rounded-[32px] p-7 flex flex-col justify-between border transition-all duration-300 relative cursor-pointer ${
                isSelected
                  ? 'border-stone-900 shadow-2xl scale-[1.02] bg-white ring-2 ring-stone-900/10'
                  : 'border-stone-200/80 hover:border-stone-400 bg-white/80'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${feat.accentColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full border border-stone-200">
                    {feat.timeline}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                    {feat.badge}
                  </span>
                  <h3 className="text-xl font-black text-stone-900 leading-snug mt-1">
                    {feat.title}
                  </h3>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed">
                  {feat.tagline}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <div
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                  }`}
                >
                  {isSelected ? '✓ Selected for Early VIP Beta' : 'Click to Reserve Early Access'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. EMAIL CAPTURE WITH TANGIBLE INCENTIVE */}
      <div className="bg-stone-900 text-white rounded-[36px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10 mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <GiftIcon className="w-3.5 h-3.5" />
            <span>Tangible Waitlist Reward: 3 Months Free VIP AI Tier</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Be the First in Your College to Test Drive AI Tools.
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Join the waitlist today. Early students receive **3 months of free unlimited AI Flashcards & Summaries** and invitations to private beta testing cohorts before public launch.
          </p>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-1.5 rounded-2xl sm:rounded-full border border-white/20 backdrop-blur-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email or Gmail..."
                  className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl sm:rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Joining...' : 'Get Early Access'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              <p className="text-[11px] text-stone-400">
                🔒 Strictly no spam. Unsubscribe at any time with one click.
              </p>
            </form>
          ) : (
            <div className="bg-emerald-500/20 border border-emerald-500/40 p-6 rounded-2xl max-w-md mx-auto text-center space-y-2 animate-scale-up">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-base">You are on the VIP Beta List!</h4>
              <p className="text-xs text-emerald-200">
                We reserved your 3 Months Free AI Pass. Watch your inbox ({email}) for early beta access keys!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. SOCIAL & COMMUNITY LINKS */}
      <div className="text-center space-y-6 pt-4">
        <h3 className="text-lg font-black text-stone-900">
          Join the Official Chennai College Community
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Connect with 12,000+ students across DGVC, Loyola, MCC, SRM, and VIT for study groups and exam updates.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('selection')}
            className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs px-5 py-3 rounded-full border border-[#25D366]/30 transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Community</span>
          </a>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('selection')}
            className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs px-5 py-3 rounded-full border border-sky-200 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Telegram Channel</span>
          </a>

          <Link
            href="/marketplace"
            onClick={() => triggerHaptic('selection')}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-5 py-3 rounded-full border border-stone-200 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Browse Current Notes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
