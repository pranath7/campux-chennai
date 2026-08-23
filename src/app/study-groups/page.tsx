'use client';

import React, { useState, useEffect } from 'react';
import { StudyGroup } from '@/types/marketplace';
import { StudyGroupCard } from '@/components/study-groups/StudyGroupCard';
import { Video, PlusCircle, Users, Calendar, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function StudyGroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCollege, setFilterCollege] = useState('all');

  // Auth Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/study-groups');
    }
  }, [user, authLoading, router]);

  const fetchGroups = () => {
    setLoading(true);
    fetch('/api/study-groups')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStudyGroups(d.studyGroups);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filtered = filterCollege === 'my' && user?.profile?.collegeId
    ? studyGroups.filter((g) => g.collegeId === user?.profile?.collegeId)
    : studyGroups;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 text-[#121316] w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-block bg-[#E8E1D5] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
            Live Peer Learning
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] break-words leading-tight">
            Paid Live Study Groups
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Join small-batch, focused 60-90 minute problem-solving workshops led by verified university rank holders and top peer mentors. Meeting links unlock immediately upon enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-stone-200 shrink-0">
          <button
            onClick={() => setFilterCollege('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCollege === 'all' ? 'bg-[#121316] text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            All Chennai Sessions
          </button>
          <button
            onClick={() => setFilterCollege('my')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCollege === 'my' ? 'bg-[#121316] text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            My College Only
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="warm-card rounded-[26px] p-6 h-72 animate-pulse bg-stone-100/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="warm-card rounded-[26px] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">No active study sessions</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            There are no live study groups currently scheduled. Check back shortly for new revision workshops!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((group) => (
            <StudyGroupCard
              key={group.id}
              studyGroup={group}
              onJoinSuccess={fetchGroups}
            />
          ))}
        </div>
      )}
    </div>
  );
}
