'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Star,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen,
  QrCode,
  Edit2,
  Save,
  Loader2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

export default function SellerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'settlements' | 'payout'>('listings');

  // Payout Form States
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi');
  const [upiId, setUpiId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isEditingPayout, setIsEditingPayout] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');
  const [payoutErrorMsg, setPayoutErrorMsg] = useState('');

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/seller');
    }
  }, [user, authLoading, router]);

  const loadData = () => {
    fetch('/api/seller/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setData(d);
          if (d.bankDetails?.isConfigured) {
            setPayoutMethod(d.bankDetails.payoutMethod || 'upi');
            setUpiId(d.bankDetails.upiId || '');
            setAccountHolder(d.bankDetails.accountHolder || user?.fullName || '');
            setBankName(d.bankDetails.bankName || '');
            setIfsc(d.bankDetails.ifsc || '');
          } else {
            setAccountHolder(user?.fullName || '');
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSavePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayout(true);
    setPayoutErrorMsg('');
    setPayoutSuccessMsg('');

    try {
      const res = await fetch('/api/seller/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutMethod,
          upiId,
          accountHolder,
          bankName,
          accountNumber,
          ifsc,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setPayoutSuccessMsg(result.message || 'Payout details saved successfully!');
        setIsEditingPayout(false);
        loadData();
      } else {
        setPayoutErrorMsg(result.error || 'Failed to save payout details.');
      }
    } catch {
      setPayoutErrorMsg('Network error while saving payout details.');
    } finally {
      setSavingPayout(false);
    }
  };

  const stats = data?.stats;
  const listings = data?.listings || [];
  const settlements = data?.settlementHistory || [];
  const bankDetails = data?.bankDetails;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 text-[#121316] w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full min-w-0">
        <div className="space-y-2 sm:space-y-4 min-w-0 flex-1">
          <div className="inline-block bg-[#E8E1D5] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
            Creator Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] leading-tight break-words">
            Seller Studio & Weekly Settlement
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Track verified sales, weekly Friday payouts, credibility trust metrics, and manage your published note catalog.
          </p>
        </div>

        <Link
          href="/sell"
          className="w-full sm:w-auto bg-[#121316] hover:bg-black text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-md transition-all cursor-pointer text-center"
        >
          <span>List New Resource</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-stone-400">
          Loading Creator Metrics...
        </div>
      ) : (
        <>
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
            <div className="warm-card rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 space-y-1.5 sm:space-y-2 border border-stone-200/80 shadow-sm w-full min-w-0">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                Gross GMV Sales
              </span>
              <p className="text-xl sm:text-3xl font-black text-stone-900">₹{stats?.totalGrossSales || 0}</p>
              <p className="text-[10px] text-stone-500 font-medium">{stats?.totalSalesCount || 0} Total Orders</p>
            </div>

            <div className="warm-card rounded-[24px] p-5 sm:p-6 space-y-2 border border-stone-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                Net Payout (90%)
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[#059669]">₹{stats?.totalNetEarnings || 0}</p>
              <p className="text-[10px] text-emerald-700 font-bold">10% Platform fee deducted</p>
            </div>

            <div className="warm-card rounded-[24px] p-5 sm:p-6 space-y-2 border border-stone-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                Credibility Score
              </span>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl sm:text-3xl font-black text-stone-900">{stats?.credibilityScore || 80}/100</p>
                <ShieldCheck className="w-5 h-5 text-[#059669]" />
              </div>
              <p className="text-[10px] text-stone-500 font-medium">★ {stats?.averageRating || 4.8} ({stats?.reviewCount || 0} reviews)</p>
            </div>

            <div className="warm-card rounded-[24px] p-5 sm:p-6 space-y-2 border border-stone-200/80 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                Active Deliverables
              </span>
              <p className="text-2xl sm:text-3xl font-black text-stone-900">{stats?.totalResources || 0}</p>
              <p className="text-[10px] text-stone-500 font-medium">Published notes & guides</p>
            </div>
          </div>

          {/* Weekly Friday Settlement Schedule Card */}
          <div className="warm-card rounded-[32px] p-6 sm:p-8 space-y-6 border border-stone-200/80 shadow-sm bg-gradient-to-br from-stone-50 via-white to-stone-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
                    Weekly Friday Settlement Schedule
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">Payout Ledger & Balances</h3>
              </div>

              <div className="flex items-center gap-2 bg-white border border-stone-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-800 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                <span>Next Cycle: {stats?.nextSettlementDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Available Balance
                </span>
                <p className="text-2xl font-black text-[#059669]">₹{stats?.availableBalance || 0}</p>
                <p className="text-[10px] text-stone-500">Ready for upcoming Friday deposit</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Pending Balance
                </span>
                <p className="text-2xl font-black text-amber-700">₹{stats?.pendingSettlement || 0}</p>
                <p className="text-[10px] text-stone-500">Awaiting admin transaction verification</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Best Selling Resource
                </span>
                <p className="font-bold text-stone-900 text-xs truncate max-w-[200px]">
                  {stats?.bestSellerTitle}
                </p>
                <p className="text-[10px] text-stone-500">★ {stats?.averageRating} rating</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'listings' ? 'bg-[#121316] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              My Listings ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab('settlements')}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'settlements' ? 'bg-[#121316] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Settlement History ({settlements.length})
            </button>
            <button
              onClick={() => setActiveTab('payout')}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'payout' ? 'bg-[#121316] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Payout Settings {bankDetails?.isConfigured ? '✓' : '(Action Required)'}
            </button>
          </div>

          {/* Tab 1: Listings Table & Mobile Cards */}
          {activeTab === 'listings' && (
            <div className="warm-card rounded-[28px] p-6 sm:p-8 space-y-6 border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">Your Published Resource Catalog</h3>
                <span className="text-xs text-stone-500 font-medium">{listings.length} Active Notes</span>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-12 text-stone-400 space-y-3">
                  <BookOpen className="w-8 h-8 mx-auto" />
                  <p className="text-xs">No listings published yet. Upload your first exam guide!</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-400">
                          <th className="pb-3 font-bold">Resource</th>
                          <th className="pb-3 font-bold">Subject</th>
                          <th className="pb-3 font-bold">Price</th>
                          <th className="pb-3 font-bold">Sales</th>
                          <th className="pb-3 font-bold">Net Revenue</th>
                          <th className="pb-3 font-bold">Rating</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {listings.map((l: any) => (
                          <tr key={l.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-4 font-bold text-stone-900 max-w-xs truncate">{l.title}</td>
                            <td className="py-4 text-stone-600 truncate">{l.subjectName}</td>
                            <td className="py-4 font-bold text-stone-900">₹{l.price}</td>
                            <td className="py-4 text-stone-700 font-semibold">{l.purchasesCount || 0}</td>
                            <td className="py-4 font-bold text-[#059669]">₹{Math.round((l.price * 0.9) * (l.purchasesCount || 0))}</td>
                            <td className="py-4 text-stone-700">★ {l.rating || 5.0}</td>
                            <td className="py-4">
                              <span className="bg-[#E6F4EA] text-[#059669] border border-[#A8DAB5] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                Active
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <Link
                                href={`/resources/${l.id}`}
                                className="text-xs font-bold text-stone-900 hover:text-[#059669] transition-colors"
                              >
                                View Listing →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {listings.map((l: any) => (
                      <div key={l.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 truncate">{l.title}</h4>
                            <p className="text-[10px] text-stone-500 truncate">{l.subjectName}</p>
                          </div>
                          <span className="bg-[#E6F4EA] text-[#059669] border border-[#A8DAB5] px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 text-[11px]">
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase">Price</span>
                            <span className="font-bold text-stone-900">₹{l.price}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase">Sales</span>
                            <span className="font-bold text-stone-900">{l.purchasesCount || 0}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase">Net Payout</span>
                            <span className="font-bold text-[#059669]">
                              ₹{Math.round((l.price * 0.9) * (l.purchasesCount || 0))}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/resources/${l.id}`}
                            className="text-xs font-bold text-stone-900 hover:text-[#059669]"
                          >
                            View Listing →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 2: Settlement History Ledger */}
          {activeTab === 'settlements' && (
            <div className="warm-card rounded-[28px] p-6 sm:p-8 space-y-6 border border-stone-200/80 shadow-sm">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">Friday Payout Settlement Ledger</h3>
                <p className="text-xs text-stone-500">Automated NEFT wire transfers processed to your registered account.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-400">
                      <th className="pb-3 font-bold">Settlement ID</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold">Amount Paid</th>
                      <th className="pb-3 font-bold">Sales Count</th>
                      <th className="pb-3 font-bold">Bank Reference</th>
                      <th className="pb-3 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {settlements.map((s: any) => (
                      <tr key={s.id} className="hover:bg-stone-50">
                        <td className="py-4 font-mono font-bold text-stone-900">{s.id}</td>
                        <td className="py-4 text-stone-600">{s.date}</td>
                        <td className="py-4 font-black text-[#059669]">₹{s.amount}</td>
                        <td className="py-4 text-stone-700">{s.salesCount} notes</td>
                        <td className="py-4 font-mono text-[11px] text-stone-500">{s.bankRef}</td>
                        <td className="py-4 text-right">
                          <span className="bg-[#E6F4EA] text-[#059669] border border-[#A8DAB5] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Creator Payout Account Configuration */}
          {activeTab === 'payout' && (
            <div className="warm-card rounded-[28px] p-6 sm:p-8 space-y-6 border border-stone-200/80 shadow-sm max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#059669] flex items-center justify-center font-bold shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Creator Payout Configuration</h3>
                    <p className="text-xs text-stone-500">
                      Enter where you would like your weekly Friday earnings deposited.
                    </p>
                  </div>
                </div>

                {bankDetails?.isConfigured && !isEditingPayout && (
                  <button
                    onClick={() => setIsEditingPayout(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                )}
              </div>

              {payoutSuccessMsg && (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
                  <span>{payoutSuccessMsg}</span>
                </div>
              )}

              {payoutErrorMsg && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{payoutErrorMsg}</span>
                </div>
              )}

              {/* View 1: If configured & not editing -> Show linked details */}
              {bankDetails?.isConfigured && !isEditingPayout ? (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
                      <span className="text-stone-500">Payout Method:</span>
                      <span className="font-bold text-stone-900 uppercase bg-stone-200/60 px-2.5 py-0.5 rounded-md text-[10px]">
                        {bankDetails.payoutMethod === 'upi' ? 'UPI Instant Transfer' : 'Direct Bank NEFT/IMPS'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-stone-200/60 pb-2.5">
                      <span className="text-stone-500">Account Holder Name:</span>
                      <span className="font-bold text-stone-900">{bankDetails.accountHolder || user?.fullName}</span>
                    </div>

                    {bankDetails.payoutMethod === 'upi' ? (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2.5">
                        <span className="text-stone-500">Linked UPI ID:</span>
                        <span className="font-mono font-bold text-emerald-700">{bankDetails.upiId}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between border-b border-stone-200/60 pb-2.5">
                          <span className="text-stone-500">Bank Name:</span>
                          <span className="font-bold text-stone-900">{bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-200/60 pb-2.5">
                          <span className="text-stone-500">IFSC Code:</span>
                          <span className="font-mono font-bold text-stone-900">{bankDetails.ifsc}</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-200/60 pb-2.5">
                          <span className="text-stone-500">Account Number:</span>
                          <span className="font-mono font-black text-stone-900 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{bankDetails.accountNumberMasked}</span>
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between pt-1">
                      <span className="text-stone-500">Verification Status:</span>
                      <span className="text-[#059669] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Friday Payout
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed italic">
                    🔒 Bank and UPI details are securely encrypted and masked in accordance with RBI financial compliance regulations.
                  </p>
                </div>
              ) : (
                /* View 2: Configuration Form for Creator to Enter Details */
                <form onSubmit={handleSavePayout} className="space-y-5 text-xs">
                  {/* Method Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      Select Payout Transfer Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod('upi')}
                        className={`p-3.5 rounded-2xl border flex items-center gap-2.5 font-bold transition-all cursor-pointer ${
                          payoutMethod === 'upi'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-[#059669]" />
                        <span>UPI ID (Fastest)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayoutMethod('bank')}
                        className={`p-3.5 rounded-2xl border flex items-center gap-2.5 font-bold transition-all cursor-pointer ${
                          payoutMethod === 'bank'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <Building className="w-4 h-4 text-[#059669]" />
                        <span>Bank Account (NEFT)</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Form Inputs */}
                  {payoutMethod === 'upi' ? (
                    <div className="space-y-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Your UPI ID (VPA) *
                        </label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okaxis, mobile@paytm, or username@oksbi"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 font-semibold"
                        />
                        <p className="text-[10px] text-stone-400">
                          Friday sales earnings will be directly transferred to this UPI VPA.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Account Holder Full Name
                        </label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="As registered in your bank/UPI app"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Account Holder Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Bank Account Number *
                        </label>
                        <input
                          type="password"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Enter your 9-18 digit account number"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 font-semibold"
                        />
                        <p className="text-[10px] text-stone-400">
                          Encrypted and masked upon saving for RBI compliance.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          11-Digit IFSC Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={ifsc}
                          onChange={(e) => setIfsc(e.target.value)}
                          placeholder="e.g. SBIN0001234 or HDFC0001824"
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-mono uppercase focus:outline-none focus:border-stone-900 font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    {bankDetails?.isConfigured && (
                      <button
                        type="button"
                        onClick={() => setIsEditingPayout(false)}
                        className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={savingPayout}
                      className="flex-1 bg-[#059669] hover:bg-[#047857] text-white py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingPayout ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Payout Details...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save & Link Payout Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
