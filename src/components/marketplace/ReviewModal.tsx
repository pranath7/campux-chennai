'use client';

import React, { useState } from 'react';
import { Star, X, Check, Loader2, Sparkles, ArrowUpRight } from 'lucide-react';
import { Purchase } from '@/types/marketplace';

interface ReviewModalProps {
  purchase: Purchase;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  purchase,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [accuracyRating, setAccuracyRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId: purchase.id,
          rating,
          qualityRating,
          accuracyRating,
          valueRating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to submit review.');
      }
    } catch {
      setErrorMsg('Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[28px] max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden text-stone-900">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
              Verified Buyer Review
            </span>
            <h3 className="font-bold text-stone-900 text-sm">Review Academic Note</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <p className="text-stone-500">
              Note by <strong className="text-stone-900">{purchase.sellerName}</strong>
            </p>
            <h4 className="font-bold text-stone-900 text-sm truncate mt-0.5">
              {purchase.listingTitle}
            </h4>
          </div>

          {/* Overall Star Picker */}
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-4 text-center">
            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-2">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-115 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-stone-800 mt-2 block">
              {rating === 5 ? '5.0 ★ Exceptional Notes' : `${rating}.0 Stars`}
            </span>
          </div>

          {/* Feedback comment */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-stone-400 block">
              Written Feedback & Examination Coverage *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="How well did these notes help you study? Did the solutions match your university exam format?"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#121316] hover:bg-black text-white font-bold py-3.5 px-4 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Publish Verified Review</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
