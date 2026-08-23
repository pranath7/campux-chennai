'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Listing, Review } from '@/types/marketplace';
import {
  ShieldCheck,
  Star,
  Download,
  Lock,
  Eye,
  FileText,
  Building,
  Flag,
  Share2,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { CheckoutModal } from '@/components/marketplace/CheckoutModal';
import { PreviewModal } from '@/components/marketplace/PreviewModal';
import { ReportModal } from '@/components/marketplace/ReportModal';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ResourceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [previewSample, setPreviewSample] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchDetail = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setListing(d.listing);
          setReviews(d.reviews || []);
          setIsPurchased(d.isPurchased || false);
          setPreviewSample(d.samplePreview || '');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-stone-500">
        Loading verified academic resource...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Resource not found</h2>
        <Link href="/marketplace" className="text-[#059669] font-bold text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#121316]">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link href="/marketplace" className="hover:text-black">
          Marketplace
        </Link>
        <span>/</span>
        <span>{listing.courseName}</span>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Watermarked Preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="warm-card rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-stone-100 text-stone-800 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-stone-200">
                {listing.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <Building className="w-3.5 h-3.5" />
                <span>{listing.sellerCollegeId}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {listing.title}
            </h1>

            <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block font-bold uppercase">Subject</span>
                <span className="font-bold text-stone-900">{listing.subjectName}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-bold uppercase">Pages</span>
                <span className="font-bold text-stone-900">{listing.pageCount} Pages</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-bold uppercase">Format</span>
                <span className="font-bold text-stone-900 uppercase">{listing.fileFormat || 'PDF'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm text-stone-900">About this Resource</h3>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line font-normal">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Locked Preview / Watermark Box */}
          <div className="warm-card rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#059669]" />
                <h3 className="font-bold text-base text-stone-900">Sample Preview & Outline</h3>
              </div>
              {!isPurchased && (
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Full File Locked
                </span>
              )}
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 font-mono text-xs leading-relaxed text-stone-800 whitespace-pre-line">
              {previewSample}
            </div>
          </div>

          {/* Student Reviews Section */}
          <div className="warm-card rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-bold text-base text-stone-900">
                Verified Student Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{listing.averageRating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-400 py-4">No reviews yet for this resource.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{r.buyerName}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 italic leading-relaxed">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Checkout / Download Box */}
        <div className="space-y-6">
          <div className="warm-card rounded-[32px] p-8 space-y-6 sticky top-28">
            <div>
              <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">
                Digital Resource Price
              </span>
              <div className="text-4xl font-black text-stone-900">₹{listing.price}</div>
            </div>

            {isPurchased ? (
              <div className="space-y-3">
                <div className="bg-[#E6F4EA] border border-[#A8DAB5] p-3.5 rounded-2xl text-xs text-[#059669] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You have unlocked this resource</span>
                </div>

                <a
                  href={`/api/resources/${listing.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Deliverable</span>
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="w-full bg-[#121316] hover:bg-black text-white font-bold py-4 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Buy & Unlock Instantly</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Sample Preview</span>
                </button>
              </div>
            )}

            {/* Author Credibility Box */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={listing.sellerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={listing.sellerName}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1">
                    {listing.sellerName}
                    {listing.sellerVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />}
                  </h4>
                  <p className="text-[11px] text-stone-500">{listing.sellerCollegeId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <span className="text-stone-500">Credibility Score</span>
                <span className="font-black text-[#059669]">
                  {listing.sellerCredibilityScore || 94}/100 Trust
                </span>
              </div>
            </div>

            {/* Report */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-[11px] text-stone-400 hover:text-rose-600 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <Flag className="w-3 h-3" /> Report Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBuyModal && (
        <CheckoutModal
          listing={listing}
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            setShowBuyModal(false);
            fetchDetail();
          }}
        />
      )}

      {showPreviewModal && (
        <PreviewModal
          listing={listing}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onBuy={() => {
            setShowPreviewModal(false);
            setShowBuyModal(true);
          }}
        />
      )}

      {showReportModal && (
        <ReportModal
          targetType="listing"
          targetId={listing.id}
          targetTitle={listing.title}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
