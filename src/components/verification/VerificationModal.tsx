'use client';

import React, { useState } from 'react';
import { ShieldCheck, X, Mail, UploadCloud, CheckCircle2, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifiedSuccess?: () => void;
}

export function VerificationModal({ isOpen, onClose, onVerifiedSuccess }: VerificationModalProps) {
  const { user, refreshSession } = useAuth();
  const [method, setMethod] = useState<'college_email' | 'student_id'>('college_email');
  const [collegeEmail, setCollegeEmail] = useState(user?.email || '');
  const [idDocUrl, setIdDocUrl] = useState('https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          collegeEmail: method === 'college_email' ? collegeEmail : undefined,
          studentIdDocUrl: method === 'student_id' ? idDocUrl : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        if (data.status === 'verified') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
        await refreshSession();
        if (onVerifiedSuccess) onVerifiedSuccess();
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.error || 'Verification submission failed.');
      }
    } catch {
      setErrorMsg('Failed to process verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden text-stone-900">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            <h3 className="font-bold text-stone-900 text-sm">Student Identity Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p className="text-stone-600 leading-relaxed">
            Verified students receive the <strong className="text-[#059669]">✓ Verified Student</strong> badge, unlock note publishing privileges, and gain a +15 pts credibility boost.
          </p>

          {/* Verification Method Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod('college_email')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                method === 'college_email'
                  ? 'bg-[#E6F4EA] border-[#059669] text-[#059669] font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-black'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>College Email</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('student_id')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                method === 'student_id'
                  ? 'bg-[#E6F4EA] border-[#059669] text-[#059669] font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-black'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Student ID Card</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {method === 'college_email' ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 block">
                  Official Institutional Email (.edu.in / .ac.in)
                </label>
                <input
                  type="email"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  placeholder="e.g. yourname@dgvaishnav.edu.in"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-mono focus:outline-hidden focus:border-stone-900"
                  required
                />
                <p className="text-[10px] text-stone-500">
                  Approved domains: @dgvaishnav.edu.in, @loyolacollege.edu, @mcc.edu.in, @srmist.edu.in, @vit.ac.in
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 block">Upload Student ID Photo</label>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center bg-stone-50 cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-1.5" />
                  <p className="text-xs text-stone-900 font-bold">Student ID Document Attached</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">JPEG / PNG / PDF (Up to 5MB)</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-[#059669] text-xs flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#121316] hover:bg-black text-white font-bold py-3.5 px-4 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify Student Identity</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
