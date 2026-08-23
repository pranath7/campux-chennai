'use client';

import React, { useState } from 'react';
import { Listing } from '@/types/marketplace';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  UploadCloud,
  FileImage,
  Sparkles,
  Clock,
  FileText,
  User,
  Phone,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  listing: Listing;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({ listing, isOpen = true, onClose, onSuccess }: CheckoutModalProps) {
  const { user } = useAuth();
  const [utrId, setUtrId] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<'idle' | 'confirming' | 'submitted_pending'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Student details
  const uniqueStudentId = user?.id ? user.id.toUpperCase().replace('USER_', 'CMPX-') : 'CMPX-STUDENT';
  const registeredPhone = user?.mobile || 'Registered Mobile';

  // Pricing calculations
  const basePrice = listing.price;
  const convenienceFee = Math.max(Math.round(basePrice * 0.05 + 2), 2);
  const totalAmount = basePrice + convenienceFee;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!utrId || utrId.trim().length < 6) {
      setErrorMessage('Please enter a valid UPI UTR / Transaction Reference ID (at least 6-12 digits).');
      return false;
    }
    if (!screenshotPreview) {
      setErrorMessage('Please upload a screenshot of your successful UPI payment.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmPopup(true);
    }
  };

  const handleFinalConfirm = async () => {
    setShowConfirmPopup(false);
    setSubmissionStep('confirming');

    try {
      // Step 1: Smooth "Confirming your payment..." animation
      await new Promise((r) => setTimeout(r, 1000));

      // Step 2: API call & server submission
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          utrId: utrId.trim(),
          screenshotUrl: screenshotPreview,
        }),
      });

      const data = await res.json();
      await new Promise((r) => setTimeout(r, 500));

      if (res.ok && data.success) {
        setSubmissionStep('submitted_pending');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        setSubmissionStep('idle');
        setErrorMessage(data.error || 'Payment submission failed. Please try again.');
      }
    } catch {
      setSubmissionStep('idle');
      setErrorMessage('Network error while submitting payment.');
    }
  };

  const handleFinish = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[22px] sm:rounded-[28px] max-w-lg w-full max-w-[calc(100vw-24px)] border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
              {submissionStep === 'submitted_pending' ? 'Payment Status' : 'UPI Direct Checkout'}
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {submissionStep === 'submitted_pending' ? 'Verification In Progress' : 'Unlock Academic Resource'}
            </h3>
          </div>

          <button
            onClick={handleFinish}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {submissionStep === 'confirming' ? (
            // Processing Screen: "Confirming your payment..."
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-[#059669]">
                  <Loader2 className="w-10 h-10 animate-spin text-[#059669]" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-stone-900">Confirming your payment...</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Securely recording your 12-digit UTR ID and transmitting payment screenshot for verification.
                </p>
              </div>
            </div>
          ) : submissionStep === 'submitted_pending' ? (
            // Explicit Success & Verification Pending Confirmation View
            <div className="py-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E6F4EA] border-2 border-[#A8DAB5] text-[#059669] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  ✓ Payment Submitted
                </span>
                <h4 className="text-2xl font-black text-stone-900 pt-1">
                  Waiting for Admin Approval
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your payment has been successfully submitted! Our team is verifying your payment screenshot against the banking gateway.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full font-bold mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verification usually takes 15–20 minutes</span>
                </div>
              </div>

              {/* Student Unique ID & Account Details Box */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-200/60 pb-1.5">
                  Receipt & Account Reference
                </p>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-400" />
                    <span>Unique Student ID:</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900">{uniqueStudentId}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>Registered Phone:</span>
                  </span>
                  <span className="font-bold text-stone-900">{registeredPhone}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Resource:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[200px]">{listing.title}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>UTR ID:</span>
                  <span className="font-mono font-bold text-stone-900">{utrId}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Amount Paid:</span>
                  <span className="font-black text-stone-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-stone-600 border-t border-stone-200/60 pt-2 font-bold">
                  <span>Current Access:</span>
                  <span className="text-amber-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked (Pending Admin Approval)
                  </span>
                </div>
              </div>

              {/* Lifecycle explanation */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl text-left text-[11px] text-emerald-900 leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Where can I find my notes?</span>
                </p>
                <p>
                  You can view this purchase anytime in <strong>My Purchases</strong>. As soon as the admin verifies your payment, the download button will activate automatically.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/my-purchases"
                  onClick={handleFinish}
                  className="w-full bg-[#121316] hover:bg-black text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all block text-center cursor-pointer"
                >
                  <span>View in My Purchases</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Standard Checkout Form
            <form onSubmit={handleInitialSubmit} className="space-y-5">
              {/* Student Identification Snippet */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-stone-400">Purchasing As</p>
                  <p className="font-bold text-stone-900">{user?.fullName || 'Student'}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md block">
                    {uniqueStudentId}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">{registeredPhone}</span>
                </div>
              </div>

              {/* Resource snippet */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs truncate">{listing.title}</h4>
                  <p className="text-[11px] text-stone-500 truncate">{listing.subjectName} • {listing.sellerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-stone-900">₹{totalAmount}</span>
                  <span className="text-[10px] text-stone-400 block">incl. ₹{convenienceFee} fee</span>
                </div>
              </div>

              {/* UPI Payment Instructions & QR Box */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">Payment Instructions</span>
                  <span className="text-[10px] font-bold text-[#059669] uppercase">UPI Instant</span>
                </div>

                <div className="flex items-center gap-4 bg-white border border-stone-200 p-3.5 rounded-xl">
                  <div className="w-16 h-16 bg-stone-100 border border-stone-300 rounded-lg flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-stone-800" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-[11px] text-stone-500">Scan QR or transfer exact amount to:</p>
                    <p className="font-mono font-bold text-xs text-stone-900 select-all">campux@okaxis</p>
                    <p className="text-[10px] text-[#059669] font-bold">Exact Amount: ₹{totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* File Upload for Payment Screenshot */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  1. Upload Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-4 text-center bg-stone-50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {screenshotPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot"
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="text-left">
                        <p className="font-bold text-xs text-stone-900">Screenshot Attached ✓</p>
                        <p className="text-[10px] text-stone-400">Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-6 h-6 text-stone-400 mx-auto" />
                      <p className="text-xs font-bold text-stone-800">Click to upload UPI screenshot</p>
                      <p className="text-[10px] text-stone-400">JPEG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* UTR ID Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  2. Enter 12-Digit UTR ID / UPI Ref Number *
                </label>
                <input
                  type="text"
                  required
                  value={utrId}
                  onChange={(e) => setUtrId(e.target.value)}
                  placeholder="e.g. 423190881234 or UPI-9840-X1"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 font-semibold"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Confirm Payment</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Modal Pop-up */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-5 text-stone-900">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto font-black text-lg">
              ?
            </div>

            <div className="text-center space-y-2">
              <h4 className="font-black text-base text-stone-900">Confirm Submission</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Have you completed the UPI transfer of ₹{totalAmount} and verified your 12-digit UTR ID?
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Student ID:</span>
                <span className="font-mono font-bold text-stone-900">{uniqueStudentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">UTR ID:</span>
                <span className="font-mono font-bold text-stone-900">{utrId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount:</span>
                <span className="font-bold text-stone-900">₹{totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmPopup(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
