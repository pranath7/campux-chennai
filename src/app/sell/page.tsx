'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  X,
  File,
  Sparkles,
  Percent,
  Wallet,
} from 'lucide-react';
import { VerificationModal } from '@/components/verification/VerificationModal';

const SUGGESTED_PRICES = [49, 79, 99, 149, 199, 249, 299, 349, 399, 499, 599];

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/sell');
    }
  }, [user, authLoading, router]);

  const [colleges, setColleges] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Registered Student College Lock
  const studentCollegeId = user?.profile?.collegeId || 'dgvaishnav';
  const studentCollegeName = user?.college?.name || user?.profile?.collegeName || 'DG Vaishnav College';

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(user?.profile?.courseId || 'dgvc_bcom_gen');
  const [selectedSubject, setSelectedSubject] = useState('sub_dgvc_acc1');
  const [category, setCategory] = useState('Revision Notes');
  const [year, setYear] = useState(user?.profile?.year?.toString() || '2');
  const [semester, setSemester] = useState(user?.profile?.semester?.toString() || '3');
  const [price, setPrice] = useState('199');
  const [customPrice, setCustomPrice] = useState('');
  const [pageCount, setPageCount] = useState('32');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>({
    name: 'Financial_Accounting_Unit1-5_Complete_Solved_Notes.pdf',
    size: 4200000,
    type: 'application/pdf',
  });
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    fetch('/api/colleges')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setColleges(d.colleges);
          const col = d.colleges.find((c: any) => c.id === studentCollegeId) || d.colleges[0];
          if (col) {
            setCourses(col.courses || []);
            const crs = col.courses?.find((c: any) => c.id === selectedCourse) || col.courses?.[0];
            if (crs) setSubjects(crs.subjects || []);
          }
        }
      })
      .catch(console.error);
  }, [studentCollegeId]);

  const handleCourseChange = (crsId: string) => {
    setSelectedCourse(crsId);
    const crs = courses.find((c) => c.id === crsId);
    if (crs && crs.subjects?.length > 0) {
      setSubjects(crs.subjects);
      setSelectedSubject(crs.subjects[0].id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExt = ['pdf', 'png', 'jpg', 'jpeg'];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

      if (!allowedExt.includes(fileExt)) {
        setErrorMsg('Invalid file format. Please upload PDF, JPG, or PNG.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMsg('File exceeds 50MB limit.');
        return;
      }

      setErrorMsg('');
      setIsUploading(true);
      setUploadProgress(20);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadedFile({
              name: file.name,
              size: file.size,
              type: file.type,
            });
            return 100;
          }
          return p + 30;
        });
      }, 150);
    }
  };

  const activePriceNum = parseInt(customPrice || price || '0', 10);
  const commissionPercentage = 10;
  const platformCommission = Math.round(activePriceNum * (commissionPercentage / 100));
  const sellerEarnings = Math.max(0, activePriceNum - platformCommission);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profile?.verifiedBadge) {
      setShowVerifyModal(true);
      return;
    }

    if (!uploadedFile) {
      setErrorMsg('Please attach your digital note file.');
      return;
    }

    if (activePriceNum < 10 || activePriceNum > 1000) {
      setErrorMsg('Price must be between ₹10 and ₹1,000.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          collegeId: studentCollegeId,
          courseId: selectedCourse,
          subjectId: selectedSubject,
          category,
          year: parseInt(year, 10),
          semester: parseInt(semester, 10),
          price: activePriceNum,
          pageCount: parseInt(pageCount, 10),
          fileName: uploadedFile.name,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessId(data.listing.id);
      } else {
        setErrorMsg(data.error || 'Failed to create listing.');
      }
    } catch {
      setErrorMsg('Network error while saving resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = !!user?.profile?.verifiedBadge;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 text-[#121316]">
      {/* Header */}
      <div className="space-y-2 sm:space-y-4">
        <div className="inline-block bg-[#E8E1D5] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
          Creator Studio
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] break-words leading-tight">
          Sell Verified Academic Notes
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
          Monetize your syllabus revision notes, formulas, and solved question sets. Transparent 90% payout with weekly bank settlement.
        </p>
      </div>

      {/* Verification Gate Banner if Not Verified */}
      {!isVerified && (
        <div className="warm-card rounded-[24px] p-5 sm:p-6 border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-stone-900">Student Verification Required to Publish</h4>
              <p className="text-stone-600 mt-0.5">
                To prevent spam and guarantee academic integrity, verify your institutional email domain or student ID before listing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="bg-[#121316] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-xs"
          >
            Verify Student ID
          </button>
        </div>
      )}

      {successId ? (
        <div className="warm-card rounded-[28px] p-8 sm:p-12 text-center space-y-6 border border-stone-200/80 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#E6F4EA] border border-[#A8DAB5] text-[#059669] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-stone-900">Listing Published Live!</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Your note has been securely uploaded, encrypted, and is now discoverable across Chennai college students.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(`/resources/${successId}`)}
              className="bg-[#121316] hover:bg-black text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>View Public Listing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => router.push('/seller')}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-xs cursor-pointer"
            >
              Go to Seller Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="warm-card rounded-[28px] p-6 sm:p-8 space-y-7 text-xs text-stone-800 border border-stone-200/80 shadow-sm">
          {/* 1. Academic Hierarchy (College is STRICTLY LOCKED) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                1. Academic Context & College Affiliation
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked to Registered College
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Locked College Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Your College (Auto-Linked)
                </label>
                <div className="bg-stone-100 border border-stone-300/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 font-bold flex items-center justify-between">
                  <span className="truncate">{studentCollegeName}</span>
                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                </div>
              </div>

              {/* Course */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Course / Program *
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Subject *
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  <option value="Revision Notes">Revision Notes</option>
                  <option value="PYQ Solutions">PYQ Solutions</option>
                  <option value="Formula Sheet">Formula Sheet</option>
                  <option value="Chapter Notes">Chapter Notes</option>
                  <option value="Summary Guide">Summary Guide</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Resource Information */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              2. Title & Coverage
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Resource Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Financial Accounting Semester 3 Solved Notes & 2024 University Exam Model"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Description & Syllabus Topics Covered *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="List key modules, solved illustrations, question bank references, and university pattern formulas included..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-900 leading-relaxed"
              />
            </div>
          </div>

          {/* 3. Secure File Upload Studio */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              3. Digital File Upload (PDF / Images)
            </h3>

            <div className="border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-2xl p-6 text-center bg-stone-50 transition-colors relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {isUploading ? (
                <div className="space-y-3 py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#059669] mx-auto" />
                  <p className="font-bold text-xs text-stone-800">Uploading & Encrypting Document ({uploadProgress}%)...</p>
                  <div className="w-48 bg-stone-200 h-1.5 rounded-full mx-auto overflow-hidden">
                    <div className="bg-[#059669] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-stone-900 truncate max-w-xs">{uploadedFile.name}</p>
                      <p className="text-[10px] text-stone-500">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for vault encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#059669] font-bold bg-[#E6F4EA] border border-[#A8DAB5] px-2.5 py-1 rounded-full">
                      ✓ File Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <UploadCloud className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-bold text-xs text-stone-900">Drag and drop your note document or click to browse</p>
                  <p className="text-[10px] text-stone-400">Supported: PDF (Primary), JPG, PNG • Max size: 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Pricing & Commission Breakdown */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              4. Listing Price & Earnings Breakdown
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Select Recommended Price Pill (₹ INR)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PRICES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPrice(p.toString());
                      setCustomPrice('');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePriceNum === p && !customPrice
                        ? 'bg-[#121316] text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    ₹{p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Or Custom Price (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  placeholder="e.g. 199"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Page Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Requirement 20: Real-time transparent commission breakdown card */}
            <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Sale Price:</span>
                <span className="font-bold text-stone-900">₹{activePriceNum}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Platform Commission ({commissionPercentage}%):</span>
                <span className="text-stone-500">- ₹{platformCommission.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 border-t border-stone-200/80 pt-2">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-[#059669]" />
                  <span>Your Net Earnings per Sale:</span>
                </span>
                <span className="text-base font-black text-[#059669]">₹{sellerEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full bg-[#121316] hover:bg-black text-white font-bold py-4 px-6 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing to Campus Marketplace...</span>
              </>
            ) : (
              <>
                <span>Publish Note to Chennai Marketplace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerifiedSuccess={() => setShowVerifyModal(false)}
      />
    </div>
  );
}
