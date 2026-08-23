'use client';

import React, { useState, useRef } from 'react';
import { Listing } from '@/types/marketplace';
import { X, Lock, FileText, CheckCircle2, ShieldCheck, ArrowUpRight, BookOpen, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface PreviewModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (listing: Listing) => void;
}

export function PreviewModal({ listing, isOpen, onClose, onBuy }: PreviewModalProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const touchStartDist = useRef(0);

  if (!isOpen) return null;

  // Double tap to toggle 1.5x zoom
  const handleDoubleTap = () => {
    triggerHaptic('medium');
    setZoomScale((prev) => (prev > 1 ? 1 : 1.4));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist.current;
      setZoomScale((prev) => Math.min(2.5, Math.max(1, prev * (factor > 1 ? 1.03 : 0.97))));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                Watermarked Free Preview
              </span>
              <h3 className="font-bold text-stone-900 text-base leading-tight truncate max-w-xs sm:max-w-md">
                {listing.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-full p-0.5 border border-stone-200 mr-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setZoomScale((prev) => Math.max(1, prev - 0.2));
                }}
                className="p-1.5 text-stone-600 hover:text-black rounded-full"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-1 text-stone-700">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setZoomScale((prev) => Math.min(2.5, prev + 0.2));
                }}
                className="p-1.5 text-stone-600 hover:text-black rounded-full"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Content Area with Pinch / Double-Tap Zoom */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onDoubleClick={handleDoubleTap}
          className="p-6 overflow-y-auto space-y-6 flex-1 text-xs select-none touch-pan-y"
        >
          {/* Metadata bar */}
          <div className="grid grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 text-stone-700">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Subject</span>
              <span className="font-semibold text-stone-900">{listing.subjectName}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Pages</span>
              <span className="font-semibold text-stone-900">{listing.pageCount} Pages</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Format</span>
              <span className="font-semibold text-stone-900 uppercase">{listing.fileFormat || 'PDF'}</span>
            </div>
          </div>

          {/* Zoom Hint Banner for Mobile */}
          <div className="sm:hidden text-center">
            <span className="text-[10px] text-stone-400 font-medium">
              🔍 Double-tap or pinch to zoom preview
            </span>
          </div>

          {/* Watermarked Sample Text Box (Zoomable) */}
          <div
            style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
            className="transition-transform duration-100 ease-out relative rounded-2xl bg-stone-50 border border-stone-200 p-6 font-mono text-[11px] leading-relaxed text-stone-800 space-y-4"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none font-sans font-black text-4xl uppercase -rotate-12 text-black">
              SAMPLE PREVIEW ONLY
            </div>

            <p className="font-bold text-stone-900 font-sans text-xs">
              CHAPTER EXCERPT & FORMULA SUMMARY:
            </p>
            <p>
              1. Fundamental Principles & Definitions:
              <br />
              • Core accounting equations and accrual concept treatments.
              <br />
              • Ledger account balancing rules & journal entries for year-end closing.
            </p>

            <p>
              2. Exam Problem Illustration #1 (Step-by-Step Solved):
              <br />
              • Calculation of provision for doubtful debts and depreciation adjustments.
            </p>

            <div className="mt-4 pt-4 border-t border-dashed border-stone-300 text-stone-500 italic text-[10px] text-center">
              [... 🔒 The remaining {listing.pageCount ? listing.pageCount - 2 : 20} pages containing full diagrams, solved university past paper keys, and unit summaries are locked ...]
            </div>
          </div>

          {/* Verification Badge & Guarantee */}
          <div className="flex items-center gap-3 bg-[#E6F4EA] border border-[#A8DAB5] p-3 rounded-2xl text-[#059669]">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span className="font-medium text-xs">
              Verified author from {listing.sellerCollegeId}. Full high-resolution PDF unlocks immediately upon checkout.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Full PDF Price</span>
            <span className="text-xl font-black text-stone-900">₹{listing.price}</span>
          </div>

          {onBuy && (
            <button
              onClick={() => {
                triggerHaptic('success');
                onBuy(listing);
              }}
              className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold py-3 px-6 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Unlock Full PDF</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
