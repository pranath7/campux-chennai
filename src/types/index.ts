export type SubjectId = 'accounting' | 'law' | 'qa' | 'economics';

export type PaperCode = 'Paper-1' | 'Paper-2' | 'Paper-3' | 'Paper-4';

export type ChapterStatus = 'not_started' | 'learning' | 'completed' | 'revised' | 'mastered';

export type TaskType = 'study' | 'revision' | 'practice' | 'pyq' | 'mock' | 'flashcards' | 'mistake_review';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export type MistakeType =
  | 'conceptual'
  | 'calculation'
  | 'careless'
  | 'memory'
  | 'question_interpretation'
  | 'time_pressure';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionSource = 'ICAI' | 'PYQ' | 'Mock' | 'RTP' | 'MTP' | 'Self-created' | 'Other';

export type FlashcardMastery = 'learning' | 'familiar' | 'mastered';

export interface UserProfile {
  id: string;
  name: string;
  attempt: 'January' | 'June' | 'December';
  examDate: string; // ISO date string
  dailyTargetHours: number; // e.g. 4.0
  preferredStudyHours: string; // e.g. "Morning (6 AM - 10 AM)"
  onboardingCompleted: boolean;
  theme: 'dark' | 'light' | 'system';
  confidenceBySubject: Record<SubjectId, number>; // 1-5
  createdAt: string;
  apiKey?: string; // Gemini API Key
}

export interface Subtopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
  completed: boolean;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  code: string;
  name: string;
  weightageEstimatedMarks: number; // Estimated marks in ICAI exam (e.g. 10-15)
  status: ChapterStatus;
  topics: Topic[];
  firstStudiedAt?: string;
  lastStudiedAt?: string;
  lastRevisedAt?: string;
  nextRevisionAt?: string;
  revisionCount: number;
  questionsSolved: number;
  accuracy: number; // 0 - 100
  confidenceScore: number; // 1 - 5
  notesCount?: number;
}

export interface Subject {
  id: SubjectId;
  name: string;
  paperCode: PaperCode;
  description: string;
  color: string;
  accentBg: string;
  chapters: Chapter[];
  isSubjective: boolean; // Law & Accounts have subjective questions; QA & Eco are objective MCQs
}

export interface StudySession {
  id: string;
  subjectId: SubjectId;
  chapterId?: string;
  chapterName?: string;
  taskType: TaskType;
  durationMinutes: number;
  startedAt: string;
  endedAt: string;
  notes?: string;
  efficiencyScore?: number; // 1-100
}

export interface DailyTask {
  id: string;
  title: string;
  subjectId: SubjectId;
  chapterId?: string;
  chapterName?: string;
  taskType: TaskType;
  estimatedMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  recommendedReason?: string;
  scheduledTime?: string; // e.g. "09:00 - 09:45"
  completedAt?: string;
}

export interface RevisionItem {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  intervalIndex: number; // 0 (1d), 1 (3d), 2 (7d), 3 (15d), 4 (30d), 5 (60d)
  dueDate: string; // YYYY-MM-DD
  status: 'due_today' | 'upcoming' | 'overdue' | 'completed';
  completedAt?: string;
  missedCount: number;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  topic?: string;
  questionText: string;
  options?: string[]; // 4 options for MCQ
  correctAnswer: string; // "A" | "B" | "C" | "D" or text for subjective
  explanation: string;
  difficulty: QuestionDifficulty;
  source: QuestionSource;
  year?: string; // e.g. "Nov 2023"
  marks: number;
  tags: string[];
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  subjectId: SubjectId;
  chapterId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  attemptedAt: string;
  sourceType: 'practice' | 'mock' | 'pyq' | 'mistake_review';
}

export interface Mistake {
  id: string;
  questionId: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  mistakeType: MistakeType;
  dateAdded: string;
  lastReviewedAt?: string;
  timesRepeated: number;
  resolved: boolean;
  notes?: string;
}

export interface MockTest {
  id: string;
  title: string;
  subjectId?: SubjectId | 'full_syllabus';
  type: 'subject_mock' | 'full_syllabus' | 'chapter_test' | 'custom_test';
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarkingRatio: number; // 0.25 for QA & Eco, 0 for Accounts/Law
  questions: Question[];
  createdAt: string;
}

export interface MockAttempt {
  id: string;
  mockTestId: string;
  mockTitle: string;
  subjectId?: SubjectId | 'full_syllabus';
  score: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  submittedAt: string;
  subjectPerformance: Record<string, { correct: number; wrong: number; marks: number }>;
  chapterPerformance: Record<string, { correct: number; wrong: number }>;
}

export interface PYQItem {
  id: string;
  year: string; // "May 2024", "Nov 2023", etc.
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  questionText: string;
  marks: number;
  solved: boolean;
  repeatedCount: number;
  notes?: string;
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  chapterName: string;
  front: string; // Question or Concept
  back: string; // Answer, Formula, or Statutory provision
  mastery: FlashcardMastery;
  lastReviewed?: string;
  nextReviewDate?: string;
  repetitions: number;
  tags: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: SubjectId;
  chapterId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'exam';
  targetValue: number;
  currentValue: number;
  unit: 'hours' | 'questions' | 'chapters' | 'mocks';
  deadline: string;
  completed: boolean;
  subjectId?: SubjectId;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'revision_due' | 'streak_risk' | 'mock_reminder' | 'target_alert' | 'general';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface SubjectStrengthScore {
  subjectId: SubjectId;
  subjectName: string;
  score: number; // 0 - 100
  factors: {
    syllabusCompletion: number; // weight 25%
    recentAccuracy: number;     // weight 25%
    revisionCompletion: number; // weight 20%
    pyqCompletion: number;      // weight 15%
    mockPerformance: number;    // weight 15%
    mistakePenalty: number;     // deduction
  };
  strengthLevel: 'Strong' | 'Moderate' | 'Needs Attention' | 'Critical';
}

export interface ExamReadiness {
  overallScore: number; // 0 - 100
  breakdown: {
    syllabusWeight: number;    // 0-100
    revisionWeight: number;    // 0-100
    practiceWeight: number;    // 0-100
    pyqWeight: number;         // 0-100
    mockWeight: number;        // 0-100
    accuracyWeight: number;    // 0-100
    consistencyWeight: number; // 0-100
  };
  biggestStrength: string;
  biggestWeakness: string;
  mostImportantNextAction: string;
}
