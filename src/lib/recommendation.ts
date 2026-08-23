/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageEngine } from '@/lib/storage';
import { SubjectId, TaskType } from '@/types';

export interface StudyRecommendation {
  subjectId: SubjectId;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  taskType: TaskType;
  durationMinutes: number;
  priorityScore: number;
  reason: string;
  bulletPoints: string[];
}

export function calculateWhatShouldIStudyNow(): StudyRecommendation {
  const subjects: any[] = StorageEngine.getSubjects() || [];
  const revisions: any[] = StorageEngine.getRevisions() || [];

  // 1. Check if there are overdue/due revisions
  const overdueRevision = revisions.find(
    (r: any) => r.status === 'overdue' || r.status === 'due_today'
  );

  if (overdueRevision) {
    const subject = subjects.find((s: any) => s.id === overdueRevision.subjectId);
    const chapter = subject?.chapters?.find((c: any) => c.id === overdueRevision.chapterId);

    return {
      subjectId: overdueRevision.subjectId,
      subjectName: subject?.name || 'Business Laws',
      chapterId: overdueRevision.chapterId,
      chapterName: overdueRevision.chapterName || 'The Indian Contract Act, 1872',
      taskType: 'revision',
      durationMinutes: 45,
      priorityScore: 98,
      reason: `Your topic "${overdueRevision.chapterName}" is due for spaced-repetition revision today to build long-term retention.`,
      bulletPoints: [
        'Spaced-repetition review due today to retain long-term memory',
        `Carries ~${chapter?.weightageEstimatedMarks || 20} marks weightage in ${subject?.name}`,
        'High frequency of repeated concept questions in past papers',
        'Review summary notes & test active recall for 15 minutes',
      ],
    };
  }

  // 2. Check uncompleted chapters starting with highest weightage
  const allUncompletedChapters: {
    subjectId: SubjectId;
    subjectName: string;
    chapter: any;
  }[] = [];

  subjects.forEach((sub: any) => {
    sub.chapters?.forEach((ch: any) => {
      if (ch.status === 'not_started' || ch.status === 'learning') {
        allUncompletedChapters.push({
          subjectId: sub.id,
          subjectName: sub.name,
          chapter: ch,
        });
      }
    });
  });

  if (allUncompletedChapters.length > 0) {
    // Sort by marks weightage descending
    allUncompletedChapters.sort(
      (a, b) => b.chapter.weightageEstimatedMarks - a.chapter.weightageEstimatedMarks
    );
    const topPick = allUncompletedChapters[0];

    return {
      subjectId: topPick.subjectId,
      subjectName: topPick.subjectName,
      chapterId: topPick.chapter.id,
      chapterName: topPick.chapter.name,
      taskType: 'study',
      durationMinutes: 45,
      priorityScore: 95,
      reason: `"${topPick.chapter.name}" carries the highest weightage (~${topPick.chapter.weightageEstimatedMarks} Marks) in ${topPick.subjectName}. Completing this foundation chapter gives you the highest ROI on Day 1.`,
      bulletPoints: [
        `Carries ~${topPick.chapter.weightageEstimatedMarks} Marks in ICAI exam`,
        'Highest priority foundational chapter',
        'Recommended study session: 45 minutes focused time',
        'Solve 10 practice questions immediately after reading',
      ],
    };
  }

  // 3. Fallback default recommendation
  return {
    subjectId: 'law',
    subjectName: 'Business Laws',
    chapterId: 'law-ch-2',
    chapterName: 'The Indian Contract Act, 1872',
    taskType: 'study',
    durationMinutes: 45,
    priorityScore: 90,
    reason: 'Highest weightage chapter in Paper 2 (~25 Marks). Master Section 10 essentials on Day 1.',
    bulletPoints: [
      'Carries ~25 Marks in Paper 2 Business Laws',
      'Foundation for all subsequent business law statutes',
      'Recommended: Study 45m with Pomodoro focus timer',
      'Review landmark court precedents (Carlill, Balfour)',
    ],
  };
}
