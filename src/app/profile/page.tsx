'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Star,
  Award,
  BookOpen,
  Calendar,
  Building,
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  Phone,
  Mail,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { VerificationModal } from '@/components/verification/VerificationModal';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { getCredibilityTier } from '@/lib/credibility';
import { StudentOnboardingChecklist } from '@/components/onboarding/StudentOnboardingChecklist';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-stone-400">
        Loading Student Profile...
      </div>
    );
  }

  const profile = user.profile;
  const isVerified = !!profile?.verifiedBadge;
  const score = profile?.credibilityScore ?? (isVerified ? 80 : 50);
  const tier = getCredibilityTier(score);
  const totalSales = profile?.resourcesSoldCount ?? 0;
  const totalReviews = profile?.reviewCount ?? 0;
  const ratingDisplay = totalReviews > 0 ? `${profile?.rating || 5.0} ★` : 'No reviews';

  const uniqueStudentId = user.id ? user.id.toUpperCase().replace('USER_', 'CMPX-') : 'CMPX-STUDENT';

  const handleCopyId = () => {
    navigator.clipboard.writeText(uniqueStudentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 text-[#121316]">
      {/* Interactive Getting Started Checklist */}
      <StudentOnboardingChecklist />

      {/* Header Profile Box */}
      <div className="warm-card rounded-[32px] p-6 sm:p-10 space-y-8 border border-stone-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-stone-200 shadow-md"
          />

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900">{user.fullName}</h1>
              {isVerified ? (
                <span className="bg-[#E6F4EA] border border-[#A8DAB5] text-[#059669] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                </span>
              ) : (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Verify ID Now
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              {user.college?.name || profile?.collegeName || 'DG Vaishnav College'} • {profile?.courseName || 'B.Com'} (Year {profile?.year || 2}{profile?.section ? `, Sec ${profile.section}` : ''})
            </p>

            {/* Unique Student ID and Phone Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 max-w-full">
              <button
                onClick={handleCopyId}
                className="bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer max-w-full"
                title="Click to copy Unique Student ID"
              >
                <User className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">ID: {uniqueStudentId}</span>
                {copiedId ? <Check className="w-3 h-3 text-[#059669] shrink-0" /> : <Copy className="w-3 h-3 text-stone-400 shrink-0" />}
              </button>

              <div className="bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 shrink-0">
                <Phone className="w-3 h-3 text-stone-500 shrink-0" />
                <span>{user.mobile}</span>
              </div>

              {user.email && (
                <div className="bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-xl text-[11px] font-medium text-stone-600 flex items-center gap-1.5 max-w-full">
                  <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credibility Score Breakdown Meter */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/70 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Trust & Verification Score
              </span>
              <h3 className="font-bold text-base text-stone-900">
                Seller Credibility: {score}/100 ({tier.tier} Tier)
              </h3>
            </div>
            <span className="text-3xl font-black text-[#059669]">{score}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#059669] rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-center">
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 block font-bold">Rating</span>
              <span className="font-bold text-stone-900">{ratingDisplay}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 block font-bold">Total Sales</span>
              <span className="font-bold text-stone-900">{totalSales}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 block font-bold">Reviews</span>
              <span className="font-bold text-stone-900">{totalReviews}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 block font-bold">Disputes</span>
              <span className="font-bold text-[#059669]">0 (Clean)</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href="/my-purchases"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-black transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="font-bold text-xs text-stone-900">Purchased Notes Library</h4>
              <p className="text-[11px] text-stone-500">Access and download verified note deliverables</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-black" />
          </Link>

          <Link
            href="/seller"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-black transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="font-bold text-xs text-stone-900">Creator Earnings & Settlements</h4>
              <p className="text-[11px] text-stone-500">View weekly Friday settlement ledger and stats</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-black" />
          </Link>
        </div>
      </div>

      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerifiedSuccess={() => setShowVerifyModal(false)}
      />
    </div>
  );
}
