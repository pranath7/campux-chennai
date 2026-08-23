'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Purchase, Listing } from '@/types/marketplace';
import {
  Download,
  Star,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  ShoppingBag,
  Clock,
  AlertCircle,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ReviewModal } from '@/components/marketplace/ReviewModal';
import { CheckoutModal } from '@/components/marketplace/CheckoutModal';
import Link from 'next/link';

export default function MyPurchasesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewPurchase, setSelectedReviewPurchase] = useState<Purchase | null>(null);
  const [retryListing, setRetryListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'waiting' | 'rejected'>('all');

  // Authentication Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/my-purchases');
    }
  }, [user, authLoading, router]);

  const fetchPurchases = () => {
    setLoading(true);
    fetch('/api/purchases')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPurchases(d.purchases);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-stone-400">
        Loading Purchases...
      </div>
    );
  }

  const filteredPurchases = purchases.filter((p) => {
    if (activeTab === 'verified') return p.paymentStatus === 'verified' || p.paymentStatus === 'successful';
    if (activeTab === 'waiting') return p.paymentStatus === 'submitted' || p.paymentStatus === 'pending';
    if (activeTab === 'rejected') return p.paymentStatus === 'rejected';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 text-[#121316]">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="inline-block bg-[#E8E1D5] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
          Student Resource Library
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] leading-tight">
          My Purchases
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
          Permanent digital access to your verified study materials. In accordance with platform security, files unlock automatically once admin verification is complete.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-bold">
        {[
          { id: 'all', label: `All Resources (${purchases.length})` },
          { id: 'verified', label: `Verified (${purchases.filter((p) => p.paymentStatus === 'verified' || p.paymentStatus === 'successful').length})` },
          { id: 'waiting', label: `Waiting for Verification (${purchases.filter((p) => p.paymentStatus === 'submitted' || p.paymentStatus === 'pending').length})` },
          { id: 'rejected', label: `Rejected (${purchases.filter((p) => p.paymentStatus === 'rejected').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#121316] text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="warm-card rounded-[26px] p-6 h-64 animate-pulse bg-stone-100/70" />
          ))}
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="warm-card rounded-[28px] p-10 sm:p-14 text-center space-y-4 border border-stone-200/80">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">No resources found in this category</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {activeTab === 'all'
              ? "You haven't purchased any notes yet. Browse peer guides and revision papers curated for your college."
              : `You have no resources matching "${activeTab}".`}
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121316] hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <span>Explore Marketplace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((p) => {
            const isVerified = p.paymentStatus === 'verified' || p.paymentStatus === 'successful';
            const isSubmitted = p.paymentStatus === 'submitted' || p.paymentStatus === 'pending';
            const isRejected = p.paymentStatus === 'rejected';

            return (
              <div
                key={p.id}
                className="warm-card rounded-[28px] p-6 flex flex-col justify-between space-y-5 text-left border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3.5">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    {isVerified ? (
                      <span className="bg-[#E6F4EA] border border-[#A8DAB5] text-[#059669] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>WAITING FOR VERIFICATION</span>
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>REJECTED</span>
                      </span>
                    )}

                    <span className="text-stone-400 font-medium shrink-0">
                      {new Date(p.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 leading-snug line-clamp-2">
                    {p.listingTitle}
                  </h3>

                  <div className="text-xs text-stone-500 space-y-1">
                    <p className="truncate">
                      Subject: <strong className="text-stone-800">{p.listingSubject}</strong>
                    </p>
                    <p className="truncate">
                      Seller: <strong className="text-stone-800">{p.sellerName}</strong>
                    </p>
                  </div>

                  {/* Financial & UTR details */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70 text-[11px] text-stone-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold text-stone-900">₹{p.totalAmountPaid}</span>
                    </div>
                    {p.utrId && (
                      <div className="flex justify-between">
                        <span>UTR Reference:</span>
                        <span className="font-mono text-stone-800 font-semibold">{p.utrId}</span>
                      </div>
                    )}
                  </div>

                  {/* Waiting Message (Requirement 15) */}
                  {isSubmitted && (
                    <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-2xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Verification In Progress</span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                        Your payment is being verified. Once approved, your notes will appear here.
                      </p>
                    </div>
                  )}

                  {/* Rejection Message */}
                  {isRejected && p.rejectionReason && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs space-y-1">
                      <p className="font-bold">Rejection Reason:</p>
                      <p className="text-[11px] text-rose-700">{p.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-stone-100">
                  {isVerified ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`/api/resources/${p.listingId}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#059669]" />
                          <span>VIEW NOTES</span>
                        </a>

                        <a
                          href={`/api/resources/${p.listingId}/download`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>DOWNLOAD</span>
                        </a>
                      </div>

                      {p.hasReviewed ? (
                        <div className="text-center text-[11px] text-stone-500 font-medium py-1">
                          ★ Review Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedReviewPurchase(p)}
                          className="w-full border border-stone-200 hover:border-black text-stone-700 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Rate & Review Note
                        </button>
                      )}
                    </div>
                  ) : isSubmitted ? (
                    <div className="bg-stone-100/70 border border-stone-200/80 p-3 rounded-2xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-600">
                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Download Locked until Approved</span>
                      </div>
                      <p className="text-[10px] text-stone-500">
                        Estimated time: 15–20 minutes
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        fetch(`/api/listings/${p.listingId}`)
                          .then((r) => r.json())
                          .then((d) => {
                            if (d.success && d.listing) setRetryListing(d.listing);
                          })
                          .catch(console.error);
                      }}
                      className="w-full bg-[#121316] hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Payment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedReviewPurchase && (
        <ReviewModal
          purchase={selectedReviewPurchase}
          isOpen={!!selectedReviewPurchase}
          onClose={() => setSelectedReviewPurchase(null)}
          onSuccess={() => {
            setSelectedReviewPurchase(null);
            fetchPurchases();
          }}
        />
      )}

      {/* Retry Checkout Modal */}
      {retryListing && (
        <CheckoutModal
          listing={retryListing}
          isOpen={!!retryListing}
          onClose={() => setRetryListing(null)}
          onSuccess={() => {
            setRetryListing(null);
            fetchPurchases();
          }}
        />
      )}
    </div>
  );
}
