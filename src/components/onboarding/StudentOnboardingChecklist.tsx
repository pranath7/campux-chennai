'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '@/lib/haptics';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  X,
  GraduationCap,
  FileText,
  Search,
  CreditCard,
  PlusCircle,
  Trophy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isComplete: boolean;
  category: 'onboarding' | 'academic' | 'creator';
}

export function StudentOnboardingChecklist() {
  const { user } = useAuth();
  const router = useRouter();

  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Initialize task completion based on user real data & localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = localStorage.getItem('campux_checklist_dismissed') === 'true';
    setIsDismissed(dismissed);

    const savedTasks = JSON.parse(localStorage.getItem('campux_checklist_tasks') || '{}');

    // Auto-detect completed tasks from user profile & live state
    const currentTasks: Record<string, boolean> = {
      profile_setup: !!user?.profile?.collegeId,
      explore_notes: savedTasks.explore_notes || false,
      preview_sample: savedTasks.preview_sample || false,
      payout_setup: !!user?.profile?.payoutDetails?.isConfigured || savedTasks.payout_setup || false,
      publish_note: (user?.profile?.resourcesListedCount || 0) > 0 || savedTasks.publish_note || false,
    };

    setCompletedTasks(currentTasks);
  }, [user]);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'profile_setup',
      title: 'Confirm College & Semester',
      description: `${user?.college?.name || user?.profile?.collegeName || 'DG Vaishnav College'} • Year ${user?.profile?.year || 1}`,
      href: '/profile',
      icon: GraduationCap,
      isComplete: !!completedTasks.profile_setup,
      category: 'onboarding',
    },
    {
      id: 'explore_notes',
      title: 'Explore Syllabus Notes for Your Course',
      description: 'Find verified formulas, unit summaries, and solved papers',
      href: '/marketplace',
      icon: Search,
      isComplete: !!completedTasks.explore_notes,
      category: 'academic',
    },
    {
      id: 'preview_sample',
      title: 'Test Free Watermarked Preview',
      description: 'Open any note card and inspect sample excerpts',
      href: '/marketplace',
      icon: FileText,
      isComplete: !!completedTasks.preview_sample,
      category: 'academic',
    },
    {
      id: 'payout_setup',
      title: 'Link Creator Payout Account (UPI/Bank)',
      description: 'Enable instant weekly earnings for your notes',
      href: '/seller',
      icon: CreditCard,
      isComplete: !!completedTasks.payout_setup,
      category: 'creator',
    },
    {
      id: 'publish_note',
      title: 'Publish Your First Academic Note',
      description: 'Upload handwritten notes or PYQs to start earning',
      href: '/sell',
      icon: PlusCircle,
      isComplete: !!completedTasks.publish_note,
      category: 'creator',
    },
  ];

  const totalTasks = checklistItems.length;
  const completedCount = checklistItems.filter((i) => i.isComplete).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  // Trigger celebration once 100% is reached
  useEffect(() => {
    if (completedCount === totalTasks && !hasCelebrated && !isDismissed) {
      setHasCelebrated(true);
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [completedCount, totalTasks, hasCelebrated, isDismissed]);

  const handleTaskClick = (item: ChecklistItem) => {
    triggerHaptic('selection');
    // Mark as completed in local state
    const updated = { ...completedTasks, [item.id]: true };
    setCompletedTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campux_checklist_tasks', JSON.stringify(updated));
    }
    router.push(item.href);
  };

  const handleDismiss = () => {
    triggerHaptic('light');
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campux_checklist_dismissed', 'true');
    }
  };

  const handleRestore = () => {
    triggerHaptic('light');
    setIsDismissed(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('campux_checklist_dismissed', 'false');
    }
  };

  if (isDismissed) {
    return (
      <div className="flex items-center justify-end pb-2">
        <button
          type="button"
          onClick={handleRestore}
          className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full border border-stone-200 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Getting Started Checklist ({completedCount}/{totalTasks})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="warm-card rounded-[28px] p-6 border border-stone-200/90 shadow-sm bg-white dark:bg-stone-900 transition-all mb-6">
      {/* Header with Progress Ring & Task Count */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center shrink-0">
            {/* Circular Progress Indicator */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs">
              {progressPercent}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {completedCount} of {totalTasks} Completed
              </span>
              {completedCount === totalTasks && (
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> All Set!
                </span>
              )}
            </div>
            <h3 className="text-base font-black text-stone-900 dark:text-white mt-1">
              Welcome to Campux, {user?.fullName?.split(' ')[0] || 'Student'}!
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Complete these steps to unlock full verified student & creator privileges.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsCollapsed(!isCollapsed);
            }}
            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 flex items-center justify-center"
            title={isCollapsed ? 'Expand Checklist' : 'Collapse Checklist'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center"
            title="Dismiss Checklist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden mt-4">
        <div
          className="bg-gradient-to-r from-[#059669] to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Tasks List */}
      {!isCollapsed && (
        <div className="mt-5 space-y-2.5">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleTaskClick(item)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.isComplete
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 text-stone-700 dark:text-stone-300'
                    : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100/80 dark:hover:bg-stone-800 border-stone-200/70 dark:border-stone-700/60 text-stone-900 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {item.isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-[#059669] fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        item.isComplete ? 'line-through text-stone-500 dark:text-stone-400' : ''
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                      item.isComplete
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40'
                        : 'text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-700 group-hover:bg-black group-hover:text-white shadow-xs'
                    }`}
                  >
                    <span>{item.isComplete ? 'Done' : 'Start'}</span>
                    {!item.isComplete && <ArrowRight className="w-3 h-3" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
