'use client';

import React from 'react';
import { Listing } from '@/types/marketplace';
import { ShieldCheck, Star, FileText, Lock, Eye, ArrowUpRight, Building, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getCredibilityTier } from '@/lib/credibility';
import { triggerHaptic } from '@/lib/haptics';

interface ResourceCardProps {
  listing: Listing;
  onPreview?: (listing: Listing) => void;
  onBuy?: (listing: Listing) => void;
  isUnlocked?: boolean;
}

export function ResourceCard({ listing, onPreview, onBuy, isUnlocked = false }: ResourceCardProps) {
  const credibilityTier = getCredibilityTier(listing.sellerCredibilityScore || 80);

  // Subject thumbnail simulation
  const subjectCover =
    listing.subjectName.toLowerCase().includes('account')
      ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80'
      : listing.subjectName.toLowerCase().includes('data') || listing.subjectName.toLowerCase().includes('algo')
      ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80'
      : listing.subjectName.toLowerCase().includes('law')
      ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="warm-card rounded-[22px] sm:rounded-[26px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative group text-left border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 bg-white w-full max-w-full min-w-0">
      <div className="w-full min-w-0">
        {/* Top Visual Thumbnail Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
          <img
            src={subjectCover}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 min-w-0">
            <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs shrink-0">
              {listing.category}
            </span>

            <span className="bg-white/95 backdrop-blur-md text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 min-w-0 shrink">
              <Building className="w-3 h-3 text-[#059669] shrink-0" />
              <span className="truncate max-w-[90px]">{listing.sellerCollegeId}</span>
            </span>
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-[11px] font-bold drop-shadow truncate">
            {listing.subjectName} • {listing.courseName}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2 min-w-0">
          <Link
            href={`/resources/${listing.id}`}
            onClick={() => triggerHaptic('light')}
            className="block group-hover:text-[#059669] transition-colors"
          >
            <h3 className="font-bold text-[#121316] text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] break-words">
              {listing.title}
            </h3>
          </Link>

          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed break-words">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Seller & Action Row */}
      <div className="p-4 sm:p-5 pt-0 space-y-2.5 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-stone-100 min-w-0">
          {/* Seller details */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={listing.sellerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={listing.sellerName}
              className="w-5 h-5 rounded-full object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0 truncate">
              <p className="text-[11px] font-bold text-stone-900 truncate flex items-center gap-1">
                <span className="truncate">{listing.sellerName}</span>
                {listing.sellerVerified && (
                  <ShieldCheck className="w-3 h-3 text-[#059669] shrink-0" />
                )}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-900 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{listing.averageRating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400 font-normal">({listing.totalReviews})</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="flex items-center justify-between gap-2 pt-1 min-w-0">
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] text-stone-400 block uppercase font-bold tracking-wider">Note Package</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[#121316]">₹{listing.price}</span>
              <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium">({listing.pageCount} pgs)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onPreview && !isUnlocked && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onPreview(listing);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50 text-stone-700 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
                title="Preview Sample"
              >
                <Eye className="w-3.5 h-3.5 text-[#059669]" />
                <span>Sample</span>
              </button>
            )}

            {isUnlocked ? (
              <Link
                href={`/resources/${listing.id}`}
                onClick={() => triggerHaptic('medium')}
                className="px-3 py-1.5 rounded-xl bg-[#059669] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all min-h-[36px]"
              >
                <span>Unlocked</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('success');
                  if (onBuy) onBuy(listing);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#121316] hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer min-h-[36px]"
                title={`Buy for ₹${listing.price}`}
              >
                <span>Buy</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
