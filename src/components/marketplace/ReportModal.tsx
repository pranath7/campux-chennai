'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, Check, Loader2 } from 'lucide-react';
import { ReportReason } from '@/types/marketplace';

interface ReportModalProps {
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({
  targetType,
  targetId,
  targetTitle,
  isOpen,
  onClose,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('copyright_violation');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedListingId: targetType === 'listing' ? targetId : undefined,
          reportedUserId: targetType === 'user' ? targetId : undefined,
          reason,
          description,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Failed to file report.');
      }
    } catch {
      setErrorMsg('Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden text-stone-900">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-stone-900 text-sm">Trust & Safety Report</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E6F4EA] text-[#059669] flex items-center justify-center mx-auto border border-[#A8DAB5]">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">Report Filed Successfully</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our Trust & Safety moderation team reviews flagged items within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {targetTitle && (
              <p className="text-stone-500">
                Flagging: <strong className="text-stone-900">{targetTitle}</strong>
              </p>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-stone-400 block">
                Violation Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-semibold focus:outline-hidden"
              >
                <option value="copyright_violation">Copyright / Commercial Textbook Scan</option>
                <option value="academic_misconduct">Academic Misconduct / Cheating Material</option>
                <option value="misleading_resource">Misleading / Blank / Corrupt File</option>
                <option value="scam">Fraudulent Seller / Pricing Misuse</option>
                <option value="spam">Spam / Duplicate Posting</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-stone-400 block">
                Detailed Explanation *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Explain why this content violates academic integrity or copyright rules..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900 leading-relaxed"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
