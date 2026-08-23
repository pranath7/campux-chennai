import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#121316]">
      <div className="space-y-3">
        <div className="inline-block bg-[#E8E1D5] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800">
          Trust & Safety Foundation
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316]">
          Academic Integrity & Digital Rights Policy
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          Effective Date: August 2026 • Geographic Scope: Chennai, Tamil Nadu, India
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-stone-700">
        <div className="warm-card rounded-[26px] p-8 space-y-3">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            1. Allowed Academic Resources
          </h2>
          <p>The platform welcomes peer-created study materials authored by enrolled college students:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
            <li>Original handwritten revision notes and concept diagrams.</li>
            <li>Summary sheets, formula keys, and mnemonic study aids.</li>
            <li>Step-by-step solved solutions for publicly available past university question papers.</li>
            <li>Interactive online peer study sessions and group revision workshops.</li>
          </ul>
        </div>

        <div className="warm-card rounded-[26px] p-8 space-y-3 border-rose-200 bg-rose-50/20">
          <h2 className="text-base font-bold text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            2. Strictly Prohibited Content & Academic Misconduct
          </h2>
          <p>The platform enforces a zero-tolerance policy against:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-800/80">
            <li><strong>Commercial Textbook Piracy:</strong> Scans, PDFs, or unlicensed reproductions of published textbooks.</li>
            <li><strong>Examination Cheating:</strong> Live exam assistance, answer key leaks, or proxy test-taking.</li>
            <li><strong>Contract Cheating:</strong> Selling completed assignments intended for graded institutional submission.</li>
            <li><strong>Misleading Content:</strong> Uploading blank, corrupt, or irrelevant files under false titles.</li>
          </ul>
        </div>

        <div className="warm-card rounded-[26px] p-8 space-y-3">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-stone-700" />
            3. Digital Resource Security & Licensing
          </h2>
          <p>
            When a student purchases a digital resource, they are granted a personal, non-transferable individual license for study and revision purposes. Uploading purchased files to external file-sharing sites or commercial repositories is strictly prohibited.
          </p>
        </div>

        <div className="warm-card rounded-[26px] p-8 space-y-3">
          <h2 className="text-base font-bold text-stone-900">4. Reporting & Moderation</h2>
          <p>
            Any student or institution can flag listings through the built-in <strong>Report</strong> feature. Our Trust & Safety team investigates all reports within 24 hours and reserves the right to suspend accounts or remove infringing content.
          </p>
        </div>
      </div>
    </div>
  );
}
