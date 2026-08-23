'use client';

import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types/marketplace';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { Megaphone, Building, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AnnouncementsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/announcements');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAnnouncements(d.announcements);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'my' && user?.profile?.collegeId
    ? announcements.filter((a) => !a.collegeId || a.collegeId === user?.profile?.collegeId)
    : announcements;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 text-[#121316] w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-block bg-[#E8E1D5] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-800">
            Campus Pulse
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121316] break-words leading-tight">
            Chennai Campus Events & Symposia
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Stay updated with inter-collegiate academic symposia, hackathons, guest lectures, and placement workshops across Chennai campuses.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-stone-200 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-[#121316] text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            All Chennai Notices
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'my' ? 'bg-[#121316] text-white' : 'text-stone-600 hover:text-black'
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
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">No active announcements</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Check back soon for new college symposia and event postings!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
    </div>
  );
}
