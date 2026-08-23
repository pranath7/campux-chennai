'use client';

import React from 'react';
import { ExamCountdownCard } from '@/components/dashboard/ExamCountdownCard';
import { TodaysProgressCard } from '@/components/dashboard/TodaysProgressCard';
import { WhatShouldIStudyCard } from '@/components/dashboard/WhatShouldIStudyCard';
import { TodaysPlanCard } from '@/components/dashboard/TodaysPlanCard';
import { SyllabusOverviewCard } from '@/components/dashboard/SyllabusOverviewCard';
import { RevisionDueCard } from '@/components/dashboard/RevisionDueCard';
import { ExamReadinessSnapshot } from '@/components/dashboard/ExamReadinessSnapshot';

export function HomeDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Large Top Exam Countdown Card */}
      <ExamCountdownCard />

      {/* 2. Today's Progress */}
      <TodaysProgressCard />

      {/* 3. Intelligent "What Should I Study Now?" Card */}
      <WhatShouldIStudyCard />

      {/* 4. Today's Study Plan & Tasks */}
      <TodaysPlanCard />

      {/* 5. 4-Subject Syllabus Completion Bars */}
      <SyllabusOverviewCard />

      {/* 6. Spaced Repetition Due Today */}
      <RevisionDueCard />

      {/* 7. Exam Readiness & Performance Snapshot */}
      <ExamReadinessSnapshot />
    </div>
  );
}
