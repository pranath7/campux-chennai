'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/lib/brandConfig';
import {
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Compass,
  Sparkles,
  CreditCard,
  Video,
  Star,
  CheckCircle2,
  Building,
  GraduationCap,
  Search,
  FileText,
  Calendar,
  Layers,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';
import { ResourceCard } from '@/components/marketplace/ResourceCard';
import { PreviewModal } from '@/components/marketplace/PreviewModal';
import { CheckoutModal } from '@/components/marketplace/CheckoutModal';
import { StudyGroupCard } from '@/components/study-groups/StudyGroupCard';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { StudentOnboardingChecklist } from '@/components/onboarding/StudentOnboardingChecklist';
import { Listing, StudyGroup, Announcement } from '@/types/marketplace';

export default function StudentAppHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Listing | null>(null);
  const [selectedBuy, setSelectedBuy] = useState<Listing | null>(null);

  // Authentication Route Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/app');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch listings
    fetch('/api/listings')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAllListings(d.listings);
      })
      .catch(console.error);

    // Fetch study groups
    fetch('/api/study-groups')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudyGroups(d.studyGroups);
      })
      .catch(console.error);

    // Fetch announcements
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAnnouncements(d.announcements);
      })
      .catch(console.error);
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-stone-400">
        Loading Student Platform...
      </div>
    );
  }

  const userCollegeId = user.profile?.collegeId || 'dgvaishnav';
  const userCourseId = user.profile?.courseId || 'dgvc_bcom_gen';
  const userCollegeName = user.college?.name || user.profile?.collegeName || 'DG Vaishnav College';

  // 1. Trending Resources across Chennai
  const trendingListings = allListings.slice(0, 4);

  // 2. STRICTLY PERSONALIZED: Recommended for You (Same College + Same Course)
  const recommendedListings = allListings
    .filter((l) => l.collegeId === userCollegeId && (!userCourseId || l.courseId === userCourseId))
    .slice(0, 4);

  // Fallback same college if strict course has fewer notes
  const collegeNotes = (recommendedListings.length > 0
    ? recommendedListings
    : allListings.filter((l) => l.collegeId === userCollegeId)
  ).slice(0, 4);

  // 3. PERSONALIZED: Session Revision Notes (Student's College & Course Focus)
  const sessionNotes = allListings
    .filter((l) => l.collegeId === userCollegeId && (l.category === 'Revision Notes' || l.category === 'Chapter Notes'))
    .slice(0, 4);

  // 4. IMPORTANT QUESTIONS & PYQ SOLUTIONS
  const importantQuestions = allListings
    .filter((l) => l.category === 'Important Questions' || l.category === 'PYQ Solutions' || l.category === 'Previous-Year Question Papers')
    .slice(0, 4);

  // 5. DISCOVERY: Explore Resources from Other Colleges (Strictly Other Institutions)
  const otherCollegeListings = allListings
    .filter((l) => l.collegeId !== userCollegeId)
    .slice(0, 4);

  // Top Sellers across Chennai dynamically aggregated from active database listings
  const sellerMap = new Map<string, any>();
  allListings.forEach((l) => {
    if (!sellerMap.has(l.sellerId)) {
      sellerMap.set(l.sellerId, {
        name: l.sellerName,
        college: l.sellerCollegeId,
        subject: l.subjectName,
        rating: l.sellerRating,
        score: l.sellerCredibilityScore,
        sales: l.purchasesCount || 0,
        avatar: l.sellerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    } else {
      const existing = sellerMap.get(l.sellerId);
      existing.sales += l.purchasesCount || 0;
    }
  });
  const topSellers = Array.from(sellerMap.values()).sort((a, b) => b.sales - a.sales).slice(0, 3);

  return (
    <div className="space-y-8 sm:space-y-16 pb-16 sm:pb-24 text-[#121316] max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* 1. STUDENT WELCOME & SEARCH BANNER */}
      <section className="bg-stone-900 text-white rounded-[22px] sm:rounded-[36px] p-4 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
        <div className="max-w-4xl space-y-4 sm:space-y-6 relative z-10">
          {/* Student Status Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-emerald-400 max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              {userCollegeName} • {user.profile?.courseName || 'B.Com'} {user.profile?.year ? `(Yr ${user.profile.year}` : ''}
              {user.profile?.section ? `, Sec ${user.profile.section})` : ')'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight break-words">
            Welcome back, {user.fullName.split(' ')[0]} 👋
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Personalized academic marketplace for your semester curriculum. Access faculty-aligned notes, exam revisions, and peer study circles.
          </p>

          {/* Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="Search notes by subject (e.g. Financial Accounting, Costing, DSA)..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl sm:rounded-full pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-emerald-400 font-medium"
              />
            </div>
            <button
              onClick={() => router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`)}
              className="bg-[#059669] hover:bg-[#047857] text-white px-7 py-3.5 rounded-2xl sm:rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>Search Notes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick topic tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-400">
            <span className="font-semibold text-stone-300">Popular:</span>
            {['#FinancialAccounting', '#CostAccounting', '#BusinessLaw', '#DSA', '#FormulaSheets'].map((t) => (
              <button
                key={t}
                onClick={() => router.push(`/marketplace?q=${encodeURIComponent(t.replace('#', ''))}`)}
                className="hover:text-emerald-400 transition-colors cursor-pointer bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ONBOARDING & GETTING STARTED CHECKLIST */}
      <StudentOnboardingChecklist />

      {/* 2. PERSONALIZED: RECOMMENDED FOR YOU (STRICTLY OWN COLLEGE + COURSE) */}
      {collegeNotes.length > 0 && (
        <section className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized for {userCollegeName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Recommended for You</h2>
            </div>
            <Link
              href={`/marketplace?collegeId=${userCollegeId}`}
              className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All from {user.college?.shortName || 'My College'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collegeNotes.map((listing) => (
              <ResourceCard
                key={listing.id}
                listing={listing}
                onPreview={(l) => setSelectedPreview(l)}
                onBuy={(l) => setSelectedBuy(l)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. TRENDING RESOURCES ACROSS CHENNAI */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-600">
              <Flame className="w-3.5 h-3.5" />
              <span>Most Popular This Week</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Trending Resources</h2>
          </div>
          <Link
            href="/marketplace?sort=popularity"
            className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingListings.map((listing) => (
            <ResourceCard
              key={listing.id}
              listing={listing}
              onPreview={(l) => setSelectedPreview(l)}
              onBuy={(l) => setSelectedBuy(l)}
            />
          ))}
        </div>
      </section>

      {/* 4. PERSONALIZED: REVISION & CHAPTER NOTES */}
      {sessionNotes.length > 0 && (
        <section className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
                High-Yield Concept Compilations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Semester Revision Notes</h2>
            </div>
            <Link
              href="/marketplace?category=Revision+Notes"
              className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>All Revision Notes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionNotes.map((listing) => (
              <ResourceCard
                key={listing.id}
                listing={listing}
                onPreview={(l) => setSelectedPreview(l)}
                onBuy={(l) => setSelectedBuy(l)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. IMPORTANT QUESTIONS & PYQ SOLUTIONS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
              Exam 5 & 10-Mark Solved Packs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Important Questions & PYQs</h2>
          </div>
          <Link
            href="/marketplace?category=Important+Questions"
            className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore PYQs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {importantQuestions.map((listing) => (
            <ResourceCard
              key={listing.id}
              listing={listing}
              onPreview={(l) => setSelectedPreview(l)}
              onBuy={(l) => setSelectedBuy(l)}
            />
          ))}
        </div>
      </section>

      {/* 6. DISCOVERY: EXPLORE RESOURCES FROM OTHER COLLEGES */}
      {otherCollegeListings.length > 0 && (
        <section className="space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">
                <Compass className="w-3.5 h-3.5" />
                <span>Inter-Collegiate Academic Discovery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                Explore Resources from Other Chennai Colleges
              </h2>
            </div>
            <Link
              href="/smart-match"
              className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Smart Match Syllabus</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCollegeListings.map((listing) => (
              <ResourceCard
                key={listing.id}
                listing={listing}
                onPreview={(l) => setSelectedPreview(l)}
                onBuy={(l) => setSelectedBuy(l)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. TOP SELLERS */}
      <section className="space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
            Peer Rankers & Top Notetakers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Top Rated Sellers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topSellers.map((seller, idx) => (
            <div key={idx} className="warm-card rounded-[26px] p-6 space-y-4 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-stone-900 truncate">{seller.name}</h4>
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium truncate">{seller.college}</p>
                </div>
              </div>

              <div className="text-xs text-stone-600 bg-stone-50 border border-stone-200/60 rounded-2xl p-3.5 space-y-1.5">
                <p className="font-semibold text-stone-800 truncate">{seller.subject}</p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/50">
                  <span>Credibility: <strong className="text-emerald-700 font-bold">{seller.score}/100</strong></span>
                  <span><strong>{seller.sales}</strong> sales</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. UPCOMING LIVE STUDY SESSIONS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
              <Video className="w-3.5 h-3.5" />
              <span>Small-Batch Problem Solving</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Upcoming Live Study Sessions</h2>
          </div>
          <Link
            href="/study-groups"
            className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All Study Groups</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyGroups.slice(0, 3).map((group) => (
            <StudyGroupCard key={group.id} studyGroup={group} />
          ))}
        </div>
      </section>

      {/* 9. CAMPUS OPPORTUNITIES & ANNOUNCEMENTS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
              Campus Pulse & Inter-College Symposia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">Campus Opportunities</h2>
          </div>
          <Link
            href="/announcements"
            className="text-xs font-bold uppercase tracking-wider text-[#059669] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All Announcements</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.slice(0, 3).map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </section>

      {/* Preview Modal */}
      {selectedPreview && (
        <PreviewModal
          listing={selectedPreview}
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          onBuy={(l) => {
            setSelectedPreview(null);
            setSelectedBuy(l);
          }}
        />
      )}

      {/* Checkout Modal */}
      {selectedBuy && (
        <CheckoutModal
          listing={selectedBuy}
          onClose={() => setSelectedBuy(null)}
          onSuccess={() => {
            setSelectedBuy(null);
          }}
        />
      )}
    </div>
  );
}
