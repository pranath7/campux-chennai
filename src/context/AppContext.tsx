'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Subject,
  Chapter,
  DailyTask,
  StudySession,
  RevisionItem,
  Question,
  QuestionAttempt,
  Mistake,
  MockTest,
  MockAttempt,
  PYQItem,
  Flashcard,
  Note,
  Goal,
  SubjectId,
} from '@/types';
import { StorageEngine, DEFAULT_USER_PROFILE } from '@/lib/storage';
import { sounds } from '@/lib/sound';
import confetti from 'canvas-confetti';

export type AppNavigationTab =
  | 'home'
  | 'plan'
  | 'practice'
  | 'analytics'
  | 'more'
  | 'syllabus'
  | 'timer'
  | 'mistakes'
  | 'mocks'
  | 'pyq'
  | 'flashcards'
  | 'subject'
  | 'law_recall'
  | 'accounts_practice'
  | 'qa_drills'
  | 'eco_quiz'
  | 'ai_assistant'
  | 'exam_mode'
  | 'settings'
  | 'calendar'
  | 'notes';

interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  initialTime: number;
  mode: 'pomodoro' | 'stopwatch' | 'custom';
  subjectId: SubjectId;
  chapterId?: string;
  chapterName?: string;
  startedTimestamp?: number;
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  subjects: Subject[];
  tasks: DailyTask[];
  sessions: StudySession[];
  revisions: RevisionItem[];
  questions: Question[];
  mistakes: Mistake[];
  mocks: MockTest[];
  mockAttempts: MockAttempt[];
  pyqs: PYQItem[];
  flashcards: Flashcard[];
  notes: Note[];
  goals: Goal[];
  activeTab: AppNavigationTab;
  setActiveTab: (tab: AppNavigationTab) => void;
  selectedSubjectId: SubjectId;
  setSelectedSubjectId: (id: SubjectId) => void;
  selectedChapterId: string | null;
  setSelectedChapterId: (id: string | null) => void;
  activeTimer: TimerState;
  startTimer: (durationMinutes: number, mode: 'pomodoro' | 'stopwatch' | 'custom', subjectId: SubjectId, chapterId?: string, chapterName?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (saveSession?: boolean) => void;
  updateChapter: (subjectId: SubjectId, chapterId: string, updates: Partial<Chapter>) => void;
  addTask: (task: Omit<DailyTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<DailyTask>) => void;
  deleteTask: (id: string) => void;
  addSession: (session: Omit<StudySession, 'id'>) => void;
  completeRevision: (id: string) => void;
  resolveMistake: (id: string) => void;
  updateMistake: (id: string, updates: Partial<Mistake>) => void;
  togglePYQ: (id: string) => void;
  updateFlashcardMastery: (id: string, mastery: 'learning' | 'familiar' | 'mastered') => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addMockAttempt: (attempt: Omit<MockAttempt, 'id'>) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  logAttempt: (attempt: Omit<QuestionAttempt, 'id'>) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  triggerCelebration: () => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [subjects, setSubjectsState] = useState<Subject[]>([]);
  const [tasks, setTasksState] = useState<DailyTask[]>([]);
  const [sessions, setSessionsState] = useState<StudySession[]>([]);
  const [revisions, setRevisionsState] = useState<RevisionItem[]>([]);
  const [questions, setQuestionsState] = useState<Question[]>([]);
  const [mistakes, setMistakesState] = useState<Mistake[]>([]);
  const [mocks, setMocksState] = useState<MockTest[]>([]);
  const [mockAttempts, setMockAttemptsState] = useState<MockAttempt[]>([]);
  const [pyqs, setPyqsState] = useState<PYQItem[]>([]);
  const [flashcards, setFlashcardsState] = useState<Flashcard[]>([]);
  const [notes, setNotesState] = useState<Note[]>([]);
  const [goals, setGoalsState] = useState<Goal[]>([]);

  const [activeTab, setActiveTab] = useState<AppNavigationTab>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('accounting');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Timer State
  const [activeTimer, setActiveTimer] = useState<TimerState>({
    isRunning: false,
    timeLeft: 25 * 60,
    initialTime: 25 * 60,
    mode: 'pomodoro',
    subjectId: 'accounting',
  });

  const refreshData = () => {
    const prof = StorageEngine.getProfile();
    setProfileState(prof);
    setShowOnboarding(!prof.onboardingCompleted);
    setThemeState(prof.theme === 'light' ? 'light' : 'dark');
    setSubjectsState(StorageEngine.getSubjects());
    setTasksState(StorageEngine.getTasks());
    setSessionsState(StorageEngine.getSessions());
    setRevisionsState(StorageEngine.getRevisions());
    setQuestionsState(StorageEngine.getQuestions());
    setMistakesState(StorageEngine.getMistakes());
    setMocksState(StorageEngine.getMocks());
    setMockAttemptsState(StorageEngine.getMockAttempts());
    setPyqsState(StorageEngine.getPYQs());
    setFlashcardsState(StorageEngine.getFlashcards());
    setNotesState(StorageEngine.getNotes());
    setGoalsState(StorageEngine.getGoals());

    const savedTimer = StorageEngine.getActiveTimer();
    if (savedTimer) {
      // If timer was running when page reloaded, adjust timeLeft based on elapsed timestamp
      if (savedTimer.isRunning && savedTimer.startedTimestamp) {
        const elapsed = Math.floor((Date.now() - savedTimer.startedTimestamp) / 1000);
        if (savedTimer.mode === 'stopwatch') {
          savedTimer.timeLeft = savedTimer.timeLeft + elapsed;
        } else {
          savedTimer.timeLeft = Math.max(0, savedTimer.timeLeft - elapsed);
        }
      }
      setActiveTimer(savedTimer);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Theme synchronization with html class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer Tick Interval
  useEffect(() => {
    let interval: any = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer((prev) => {
          if (prev.mode === 'stopwatch') {
            const nextState = { ...prev, timeLeft: prev.timeLeft + 1 };
            StorageEngine.saveActiveTimer(nextState);
            return nextState;
          } else {
            if (prev.timeLeft <= 1) {
              sounds.playTimerEnd();
              triggerCelebration();
              // Auto log session
              const durationMin = Math.round(prev.initialTime / 60);
              StorageEngine.addSession({
                subjectId: prev.subjectId,
                chapterId: prev.chapterId,
                chapterName: prev.chapterName,
                taskType: 'study',
                durationMinutes: durationMin,
                startedAt: new Date(Date.now() - prev.initialTime * 1000).toISOString(),
                endedAt: new Date().toISOString(),
                notes: `Completed ${durationMin}m ${prev.mode} session for ${prev.chapterName || prev.subjectId}`,
                efficiencyScore: 95,
              });
              setSessionsState(StorageEngine.getSessions());

              const finishedState = {
                ...prev,
                isRunning: false,
                timeLeft: 0,
              };
              StorageEngine.saveActiveTimer(finishedState);
              return finishedState;
            }
            const nextState = { ...prev, timeLeft: prev.timeLeft - 1 };
            StorageEngine.saveActiveTimer(nextState);
            return nextState;
          }
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer.isRunning, activeTimer.initialTime]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      });
      sounds.playSuccess();
    } catch (e) {
      // safe fallback
    }
  };

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    StorageEngine.saveProfile(newProfile);
    setThemeState(newProfile.theme === 'light' ? 'light' : 'dark');
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    const updated = { ...profile, theme: t };
    setProfileState(updated);
    StorageEngine.saveProfile(updated);
  };

  const startTimer = (
    durationMinutes: number,
    mode: 'pomodoro' | 'stopwatch' | 'custom',
    subjectId: SubjectId,
    chapterId?: string,
    chapterName?: string
  ) => {
    const totalSecs = mode === 'stopwatch' ? 0 : durationMinutes * 60;
    const newTimer: TimerState = {
      isRunning: true,
      timeLeft: totalSecs,
      initialTime: totalSecs || 1,
      mode,
      subjectId,
      chapterId,
      chapterName,
      startedTimestamp: Date.now(),
    };
    setActiveTimer(newTimer);
    StorageEngine.saveActiveTimer(newTimer);
  };

  const pauseTimer = () => {
    const paused = { ...activeTimer, isRunning: false };
    setActiveTimer(paused);
    StorageEngine.saveActiveTimer(paused);
  };

  const resumeTimer = () => {
    const resumed = { ...activeTimer, isRunning: true, startedTimestamp: Date.now() };
    setActiveTimer(resumed);
    StorageEngine.saveActiveTimer(resumed);
  };

  const stopTimer = (saveSession: boolean = true) => {
    if (saveSession && activeTimer.initialTime > 0) {
      const elapsedSecs =
        activeTimer.mode === 'stopwatch'
          ? activeTimer.timeLeft
          : activeTimer.initialTime - activeTimer.timeLeft;
      const durationMin = Math.max(Math.round(elapsedSecs / 60), 1);

      if (durationMin >= 1) {
        StorageEngine.addSession({
          subjectId: activeTimer.subjectId,
          chapterId: activeTimer.chapterId,
          chapterName: activeTimer.chapterName,
          taskType: 'study',
          durationMinutes: durationMin,
          startedAt: new Date(Date.now() - elapsedSecs * 1000).toISOString(),
          endedAt: new Date().toISOString(),
          notes: `Study session for ${activeTimer.chapterName || activeTimer.subjectId}`,
          efficiencyScore: 90,
        });
        setSessionsState(StorageEngine.getSessions());
      }
    }
    const stopped: TimerState = {
      isRunning: false,
      timeLeft: 25 * 60,
      initialTime: 25 * 60,
      mode: 'pomodoro',
      subjectId: activeTimer.subjectId,
    };
    setActiveTimer(stopped);
    StorageEngine.clearActiveTimer();
  };

  const updateChapter = (subjectId: SubjectId, chapterId: string, updates: Partial<Chapter>) => {
    const updated = StorageEngine.updateChapter(subjectId, chapterId, updates);
    setSubjectsState(updated);
  };

  const addTask = (task: Omit<DailyTask, 'id'>) => {
    StorageEngine.addTask(task);
    setTasksState(StorageEngine.getTasks());
  };

  const updateTask = (id: string, updates: Partial<DailyTask>) => {
    const updated = StorageEngine.updateTask(id, updates);
    setTasksState(updated);
    if (updates.status === 'completed') {
      triggerCelebration();
    }
  };

  const deleteTask = (id: string) => {
    const updated = StorageEngine.deleteTask(id);
    setTasksState(updated);
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    StorageEngine.addSession(session);
    setSessionsState(StorageEngine.getSessions());
  };

  const completeRevision = (id: string) => {
    const updated = StorageEngine.completeRevision(id);
    setRevisionsState(updated);
    triggerCelebration();
  };

  const resolveMistake = (id: string) => {
    const updated = StorageEngine.resolveMistake(id);
    setMistakesState(updated);
    triggerCelebration();
  };

  const updateMistake = (id: string, updates: Partial<Mistake>) => {
    const updated = StorageEngine.updateMistake(id, updates);
    setMistakesState(updated);
  };

  const togglePYQ = (id: string) => {
    const updated = StorageEngine.togglePYQSolved(id);
    setPyqsState(updated);
  };

  const updateFlashcardMastery = (id: string, mastery: 'learning' | 'familiar' | 'mastered') => {
    const updated = StorageEngine.updateFlashcard(id, { mastery, lastReviewed: new Date().toISOString() });
    setFlashcardsState(updated);
    if (mastery === 'mastered') {
      triggerCelebration();
    }
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    StorageEngine.addNote(note);
    setNotesState(StorageEngine.getNotes());
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = StorageEngine.updateNote(id, updates);
    setNotesState(updated);
  };

  const deleteNote = (id: string) => {
    const updated = StorageEngine.deleteNote(id);
    setNotesState(updated);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = StorageEngine.updateGoal(id, updates);
    setGoalsState(updated);
  };

  const addMockAttempt = (attempt: Omit<MockAttempt, 'id'>) => {
    StorageEngine.addMockAttempt(attempt);
    setMockAttemptsState(StorageEngine.getMockAttempts());
    triggerCelebration();
  };

  const addFlashcard = (flashcard: Omit<Flashcard, 'id'>) => {
    const cards = StorageEngine.getFlashcards();
    const newCard: Flashcard = {
      ...flashcard,
      id: `fc-${Date.now()}`,
    };
    StorageEngine.saveFlashcards([newCard, ...cards]);
    setFlashcardsState(StorageEngine.getFlashcards());
  };

  const logAttempt = (attempt: Omit<QuestionAttempt, 'id'>) => {
    StorageEngine.logAttempt(attempt);
    setMistakesState(StorageEngine.getMistakes());
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        subjects,
        tasks,
        sessions,
        revisions,
        questions,
        mistakes,
        mocks,
        mockAttempts,
        pyqs,
        flashcards,
        notes,
        goals,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedChapterId,
        setSelectedChapterId,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        updateChapter,
        addTask,
        updateTask,
        deleteTask,
        addSession,
        completeRevision,
        resolveMistake,
        updateMistake,
        togglePYQ,
        updateFlashcardMastery,
        addNote,
        updateNote,
        deleteNote,
        updateGoal,
        addMockAttempt,
        addFlashcard,
        logAttempt,
        isSearchOpen,
        setIsSearchOpen,
        showOnboarding,
        setShowOnboarding,
        theme,
        setTheme,
        triggerCelebration,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
