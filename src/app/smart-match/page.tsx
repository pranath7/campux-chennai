'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Building, ArrowUpRight, BookOpen, Search } from 'lucide-react';
import { ResourceCard } from '@/components/marketplace/ResourceCard';
import { PreviewModal } from '@/components/marketplace/PreviewModal';
import { CheckoutModal } from '@/components/marketplace/CheckoutModal';
import { Listing } from '@/types/marketplace';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SmartMatchPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState('dgvaishnav');
  const [selectedSubject, setSelectedSubject] = useState('sub_dgvc_fa');
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/smart-match');
    }
  }, [user, authLoading, router]);

  // Modals
  const [selectedPreview, setSelectedPreview] = useState<Listing | null>(null);
  const [selectedBuy, setSelectedBuy] = useState<Listing | null>(null);

  useEffect(() => {
    fetch('/api/colleges')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setColleges(d.colleges);
          const allSubs: any[] = [];
          d.colleges.forEach((c: any) => {
            c.courses?.forEach((course: any) => {
              course.subjects?.forEach((s: any) => {
                allSubs.push({ ...s, collegeId: c.id, collegeName: c.shortName || c.name });
              });
            });
          });
          setSubjects(allSubs);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCollege || !selectedSubject) return;
    setLoading(true);
    fetch(`/api/smart-match?collegeId=${selectedCollege}&subjectId=${selectedSubject}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMatchData(d);
      })
      .finally(() => setLoading(false));
  }, [selectedCollege, selectedSubject]);

  const filteredSubjects = subjects.filter((s) => s.collegeId === selectedCollege);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#121316]">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-block bg-[#E8E1D5] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800">
          Curriculum Equivalency Engine
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316]">
          Cross-College Smart Discovery
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
          Our deterministic semantic curriculum mapper connects equivalent academic modules across Chennai universities (DG Vaishnav, Loyola, MCC, SRM, VIT) so you can discover peer-tested revision guides from top scorers citywide.
        </p>
      </div>

      {/* College & Subject Selector Panel */}
      <div className="warm-card rounded-[26px] p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              1. Your Chennai College
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => {
                setSelectedCollege(e.target.value);
                const sub = subjects.find((s) => s.collegeId === e.target.value);
                if (sub) setSelectedSubject(sub.id);
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-semibold focus:outline-hidden"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.shortName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              2. Select Your Current Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 font-semibold focus:outline-hidden"
            >
              {filteredSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.courseName || 'Core Subject'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {matchData?.currentSubject && (
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-800 font-bold text-xs">
                #
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  Canonical Curriculum Node
                </span>
                <p className="font-bold text-stone-900">
                  {matchData.currentSubject.canonicalSubjectKey}
                </p>
              </div>
            </div>

            <div className="text-stone-600 font-medium">
              Matched across <strong>{matchData.matchedCollegesCount || 3} other Chennai campuses</strong>
            </div>
          </div>
        )}
      </div>

      {/* Cross-College Matched Resources Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              High-Yield Matches
            </span>
            <h2 className="text-2xl font-bold text-stone-900 mt-0.5">
              Students studying this at other Chennai colleges are using:
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="warm-card rounded-[24px] p-6 h-64 animate-pulse bg-stone-100/70" />
            ))}
          </div>
        ) : !matchData?.listings || matchData.listings.length === 0 ? (
          <div className="warm-card rounded-[24px] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">No cross-college notes found</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              No verified peers have listed notes for this specific subject at other Chennai colleges yet. Be the first creator to upload and earn!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchData.listings.map((listing: Listing) => (
              <ResourceCard
                key={listing.id}
                listing={listing}
                onPreview={(item) => setSelectedPreview(item)}
                onBuy={(item) => setSelectedBuy(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedPreview && (
        <PreviewModal
          listing={selectedPreview}
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          onBuy={(item) => {
            setSelectedPreview(null);
            setSelectedBuy(item);
          }}
        />
      )}

      {selectedBuy && (
        <CheckoutModal
          listing={selectedBuy}
          isOpen={!!selectedBuy}
          onClose={() => setSelectedBuy(null)}
        />
      )}
    </div>
  );
}
