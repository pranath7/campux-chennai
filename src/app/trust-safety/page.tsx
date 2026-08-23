'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight, Lock } from 'lucide-react';

export default function TrustSafetyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 text-[#121316]">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-block bg-[#E8E1D5] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800">
          Academic Integrity
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900">
          Trust, Safety & Academic Standards
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          How we ensure 100% genuine student-created study aids, legitimate UPI transactions, and academic honesty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">Identity Verification</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All seller accounts must verify their institutional email or student ID badge before listing any study materials.
          </p>
        </div>

        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">Manual Payment Verification</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Payments are checked against bank UTR references. Digital files remain securely locked until admin confirmation.
          </p>
        </div>

        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">Zero Plagiarism Policy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pirated textbooks and commercial test series are strictly prohibited and immediately removed by platform moderators.
          </p>
        </div>
      </div>

      <div className="warm-card rounded-[32px] p-8 sm:p-12 space-y-6 bg-white border border-stone-200 text-xs text-stone-700 leading-relaxed">
        <h2 className="text-2xl font-black text-stone-900">The Student Academic Integrity Pledge</h2>
        <p>
          Campux study guides and revision notes are created to assist individual student learning, clarify difficult textbook derivations, and provide worked examples. They are intended for ethical exam preparation and revision.
        </p>
      </div>
    </div>
  );
}
