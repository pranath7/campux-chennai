'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ShieldCheck, QrCode, FileText, Download, Users } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 text-[#121316]">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-block bg-[#E8E1D5] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800">
          Student Guide
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900">
          How Campux Chennai Works
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          The verified peer-to-peer academic marketplace built specifically for Chennai collegiate students.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center justify-center font-black text-lg">
            1
          </div>
          <h3 className="text-xl font-bold text-stone-900">Register with Your College</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Enter your Name, Mobile Number, College (e.g. DG Vaishnav, Loyola, MCC), Course, Year, and Section. We verify and align you with your syllabus cohort.
          </p>
        </div>

        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center justify-center font-black text-lg">
            2
          </div>
          <h3 className="text-xl font-bold text-stone-900">Discover Verified Notes</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Search formula sheets, handwritten revision guides, and solved 5-year university exam question papers uploaded by top batch rankers.
          </p>
        </div>

        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center justify-center font-black text-lg">
            3
          </div>
          <h3 className="text-xl font-bold text-stone-900">Pay via UPI & Submit UTR</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Scan the UPI QR code, pay the exact student fee, upload your payment screenshot, and submit the 12-digit transaction UTR reference.
          </p>
        </div>

        <div className="warm-card rounded-[28px] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center justify-center font-black text-lg">
            4
          </div>
          <h3 className="text-xl font-bold text-stone-900">Admin Verifies & Note Unlocks</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our verification team checks the transaction reference. Once verified, permanent access and high-resolution PDF download activate in your library.
          </p>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          href="/login?redirect=/app"
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md"
        >
          <span>Get Started — Buy Notes</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
