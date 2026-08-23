'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Question, SubjectId, QuestionDifficulty } from '@/types';
import { sounds } from '@/lib/sound';
import {
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Edit3,
} from 'lucide-react';

export function PracticeMode() {
  const { questions, subjects, selectedSubjectId, setSelectedSubjectId, logAttempt, setActiveTab, triggerCelebration } = useApp();

  const [isConfiguring, setIsConfiguring] = useState(true);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [scratchpad, setScratchpad] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  // Config parameters
  const [practiceSubject, setPracticeSubject] = useState<SubjectId>('law');
  const [practiceDifficulty, setPracticeDifficulty] = useState<string>('all');
  const [numQuestions, setNumQuestions] = useState(5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);

  const startPractice = () => {
    let pool = questions.filter((q) => q.subjectId === practiceSubject);
    if (practiceDifficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === practiceDifficulty);
    }
    if (pool.length === 0) {
      pool = questions.filter((q) => q.subjectId === practiceSubject);
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setRevealed({});
    setIsFinished(false);
    setTimeLeft(timeLimitMinutes * 60);
    setIsConfiguring(false);
  };

  // Timer Tick
  useEffect(() => {
    let timer: any = null;
    if (!isConfiguring && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishPractice();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConfiguring, isFinished, timeLeft]);

  const handleSelectOption = (questionId: string, optLetter: string) => {
    if (revealed[questionId]) return; // already locked

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optLetter }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));

    const currentQ = sessionQuestions.find((q) => q.id === questionId);
    if (currentQ) {
      const isCorrect = currentQ.correctAnswer === optLetter;
      if (isCorrect) {
        sounds.playSuccess();
      }

      // Log attempt to database & mistake book if wrong
      logAttempt({
        questionId: currentQ.id,
        subjectId: currentQ.subjectId,
        chapterId: currentQ.chapterId,
        userAnswer: optLetter,
        isCorrect,
        timeSpentSeconds: 30,
        attemptedAt: new Date().toISOString(),
        sourceType: 'practice',
      });
    }
  };

  const finishPractice = () => {
    setIsFinished(true);
    triggerCelebration();
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate session summary
  const total = sessionQuestions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  sessionQuestions.forEach((q) => {
    const ans = selectedAnswers[q.id];
    if (!ans) {
      skippedCount++;
    } else if (ans === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const accuracy = total > 0 ? Math.round((correctCount / (correctCount + wrongCount || 1)) * 100) : 0;
  const score = correctCount * 2 - (practiceSubject === 'qa' || practiceSubject === 'economics' ? wrongCount * 0.5 : 0);

  const currentQ = sessionQuestions[currentIndex];

  if (isConfiguring) {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-fade-in">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Interactive Test Engine
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">CONFIGURE PRACTICE SESSION</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Questions answered incorrectly are automatically captured in your Mistake Book with detailed solutions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Select Paper / Subject
            </label>
            <select
              value={practiceSubject}
              onChange={(e) => setPracticeSubject(e.target.value as SubjectId)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
            >
              <option value="accounting">Paper 1: Accounting</option>
              <option value="law">Paper 2: Business Laws</option>
              <option value="qa">Paper 3: Quantitative Aptitude (0.25 Neg)</option>
              <option value="economics">Paper 4: Business Economics (0.25 Neg)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Difficulty
              </label>
              <select
                value={practiceDifficulty}
                onChange={(e) => setPracticeDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
              >
                <option value="all">Mixed (Recommended)</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
              >
                <option value="5">5 Questions (Quick)</option>
                <option value="10">10 Questions (Standard)</option>
                <option value="20">20 Questions (Intensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Time Limit
              </label>
              <select
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs outline-none"
              >
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={startPractice}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 transition"
        >
          Start Practice Drill
        </button>
      </div>
    );
  }

  // Finished Scorecard Screen
  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
          ✓
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Practice Session Completed
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">PERFORMANCE SUMMARY</h2>
        </div>

        {/* Score & Accuracy Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
              {score} M
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
            <div className="text-2xl font-black text-emerald-500 font-mono mt-1">
              {accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Correct / Wrong</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {correctCount} / {wrongCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400">Skipped</span>
            <div className="text-2xl font-black text-slate-400 font-mono mt-1">
              {skippedCount}
            </div>
          </div>
        </div>

        {wrongCount > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 text-left flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {wrongCount} incorrect question(s) were automatically logged to your Mistake Book!
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                Review and classify your mistakes (Conceptual vs Careless vs Calculation) in the Mistake Book tab.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setIsConfiguring(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Another Set</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition"
          >
            Review Mistake Book
          </button>
        </div>
      </div>
    );
  }

  // Active Practice Question Screen
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Session Progress Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {sessionQuestions.length}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {practiceSubject.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatSecs(timeLeft)}</span>
          </div>

          <button
            onClick={finishPractice}
            className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-xs font-bold transition"
          >
            End Test
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400">
              Source: {currentQ.source} • Difficulty: {currentQ.difficulty}
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {currentQ.marks} Marks
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, oIdx) => {
              const optLetter = String.fromCharCode(65 + oIdx);
              const isSelected = selectedAnswers[currentQ.id] === optLetter;
              const isRevealed = revealed[currentQ.id];
              const isCorrectAnswer = currentQ.correctAnswer === optLetter;

              let optionStyle =
                'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-400';

              if (isRevealed) {
                if (isCorrectAnswer) {
                  optionStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 font-bold';
                }
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(currentQ.id, optLetter)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-xs">
                      {optLetter}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                  </div>

                  {isRevealed && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isRevealed && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Solution & Explanation Box when Revealed */}
          {revealed[currentQ.id] && (
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ICAI Conceptual Solution & Reasoning:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Scratchpad Accordion */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Rough Working / Scratchpad:</span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="Write your calculations, journal notes, or draft sections here..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
            >
              Previous
            </button>

            {currentIndex < sessionQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={finishPractice}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & View Analysis</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
