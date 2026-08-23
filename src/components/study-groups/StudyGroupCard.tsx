'use client';

import React, { useState } from 'react';
import { StudyGroup } from '@/types/marketplace';
import { Calendar, Clock, Users, Video, ShieldCheck, ArrowUpRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyGroupCardProps {
  studyGroup: StudyGroup & { isUnlocked?: boolean; hasJoined?: boolean; isHost?: boolean; availableSeats?: number; isFull?: boolean };
  onJoinSuccess?: () => void;
}

export function StudyGroupCard({ studyGroup, onJoinSuccess }: StudyGroupCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [unlockedLink, setUnlockedLink] = useState<string | null>(studyGroup.isUnlocked ? studyGroup.meetingLink : null);
  const [instructions, setInstructions] = useState<string | null>(studyGroup.isUnlocked ? studyGroup.meetingInstructions || null : null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoin = async () => {
    setIsJoining(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/study-groups/${studyGroup.id}/join`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUnlockedLink(data.meetingLink);
        setInstructions(data.meetingInstructions);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
        if (onJoinSuccess) onJoinSuccess();
      } else {
        setErrorMsg(data.error || 'Failed to join session.');
      }
    } catch {
      setErrorMsg('Failed to join study session.');
    } finally {
      setIsJoining(false);
    }
  };

  const seatsLeft = Math.max(0, studyGroup.maxParticipants - studyGroup.currentParticipantsCount);

  // Subject academic thumbnail mapping
  const subjectThumbnail =
    studyGroup.subjectName.toLowerCase().includes('account')
      ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
      : studyGroup.subjectName.toLowerCase().includes('data') || studyGroup.subjectName.toLowerCase().includes('algo')
      ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
      : studyGroup.subjectName.toLowerCase().includes('law')
      ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="warm-card rounded-[22px] sm:rounded-[28px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative group text-left border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 w-full max-w-full min-w-0">
      <div>
        {/* Visual Thumbnail Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
          <img
            src={subjectThumbnail}
            alt={studyGroup.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Platform & Participants overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Video className="w-3 h-3 text-emerald-400" />
              {studyGroup.meetingPlatform}
            </span>

            <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Users className="w-3 h-3 text-[#059669]" />
              <span>{studyGroup.currentParticipantsCount}/{studyGroup.maxParticipants} joined</span>
            </span>
          </div>

          {/* Prominent Date & Time inside banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-bold drop-shadow">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{studyGroup.date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold drop-shadow bg-black/50 px-2 py-0.5 rounded-lg text-[11px]">
              <Clock className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{studyGroup.startTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] truncate">
              {studyGroup.subjectName}
            </span>
            <span className="text-[10px] text-stone-400 font-semibold shrink-0">
              {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Session Full'}
            </span>
          </div>

          <h3 className="font-bold text-[#121316] text-base leading-snug line-clamp-2 min-h-[2.5rem]">
            {studyGroup.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {studyGroup.description}
          </p>

          {/* Host Info */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={studyGroup.hostAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={studyGroup.hostName}
                className="w-6 h-6 rounded-full object-cover border border-stone-200 shrink-0"
              />
              <span className="text-xs font-bold text-stone-800 truncate flex items-center gap-1">
                {studyGroup.hostName}
                {studyGroup.hostVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-bold bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
              {studyGroup.hostCredibilityScore}/100 Trust
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Unlock State */}
      <div className="p-5 pt-0">
        {unlockedLink ? (
          <div className="bg-[#E6F4EA] border border-[#A8DAB5] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#059669] font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Live Session Unlocked
              </span>
              <span className="text-[10px] text-stone-500">Seat Confirmed</span>
            </div>
            {instructions && (
              <p className="text-[11px] text-stone-700 leading-relaxed">{instructions}</p>
            )}
            <a
              href={unlockedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Join {studyGroup.meetingPlatform}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {errorMsg && <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>}
            <div className="flex items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
              <div>
                <span className="text-[9px] text-stone-400 block uppercase font-bold tracking-wider">Session Fee</span>
                <span className="text-lg font-black text-[#121316]">
                  {studyGroup.price === 0 ? 'FREE' : `₹${studyGroup.price}`}
                </span>
              </div>

              <button
                onClick={handleJoin}
                disabled={isJoining || studyGroup.isFull}
                className="px-4 py-2.5 rounded-xl bg-[#121316] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-102 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>JOIN SESSION</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
