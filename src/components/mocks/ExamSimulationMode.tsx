'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MockTest, Question } from '@/types';
import { sounds } from '@/lib/sound';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  FileCheck,
} from 'lucide-react';

interface ExamSimulationModeProps {
  mockTest: MockTest;
  onExit: () => void;
}

export function ExamSimulationMode({ mockTest, onExit }: ExamSimulationModeProps) {
  const { addMockAttempt, triggerCelebration } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(mockTest.durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<any>(null);

  const questions = mockTest.questions;
  const currentQ = questions[currentIndex];

  useEffect(() => {
    let interval: any = null;
    if (!isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFinished, timeLeft]);

  const formatClock = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (optLetter: string) => {
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: prev[currentQ.id] === optLetter ? '' : optLetter,
    }));
  };

  const toggleMarkForReview = () => {
    if (!currentQ) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmitExam = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const totalQ = questions.length;

    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        skipped++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const negPenalty = mockTest.negativeMarkingRatio * wrong;
    const rawScore = correct * (mockTest.totalMarks / (totalQ || 1)) - negPenalty;
    const score = Math.max(Math.round(rawScore * 100) / 100, 0);
    const percentage = Math.round((score / mockTest.totalMarks) * 100);
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    const attemptData = {
      mockTestId: mockTest.id,
      mockTitle: mockTest.title,
      subjectId: mockTest.subjectId,
      score,
      totalMarks: mockTest.totalMarks,
      percentage,
      correctCount: correct,
      wrongCount: wrong,
      skippedCount: skipped,
      accuracy,
      timeSpentSeconds: mockTest.durationMinutes * 60 - timeLeft,
      submittedAt: new Date().toISOString(),
      subjectPerformance: {
        [mockTest.subjectId || 'general']: { correct, wrong, marks: score },
      },
      chapterPerformance: {},
    };

    addMockAttempt(attemptData);
    setSubmittedAttempt(attemptData);
    setShowSubmitModal(false);
    setIsFinished(true);
    triggerCelebration();
  };

  // Post Submission Result View
  if (isFinished && submittedAttempt) {
    const isPassed = submittedAttempt.score >= mockTest.passingMarks;

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-12 overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6 text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-black ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {isPassed ? '✓' : '✕'}
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              Exam Simulation Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">{mockTest.title}</h2>
            <div className="mt-2">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  isPassed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {isPassed ? 'Passed (≥ 40% Benchmark)' : 'Requires Review (< 40% Benchmark)'}
              </span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Final Score</span>
              <div className="text-2xl font-black text-blue-400 font-mono mt-1">
                {submittedAttempt.score} / {mockTest.totalMarks}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Percentage</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {submittedAttempt.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                {submittedAttempt.accuracy}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Correct / Wrong / Skip</span>
              <div className="text-lg font-black text-slate-200 font-mono mt-1">
                {submittedAttempt.correctCount} / {submittedAttempt.wrongCount} / {submittedAttempt.skippedCount}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {mockTest.negativeMarkingRatio > 0
              ? `*Negative marking (-${mockTest.negativeMarkingRatio} per wrong answer) applied as per ICAI Objective Exam rules.`
              : '*Standard evaluation criteria applied.'}
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onExit}
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition"
            >
              Return to Mock Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Live Exam Simulation Screen
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Authentic ICAI Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">
            ICAI
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">{mockTest.title}</h2>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Authentic Exam Simulation Environment
            </span>
          </div>
        </div>

        {/* Countdown Ticker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-sm text-amber-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Left: {formatClock(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Content Area: Left Question Pane + Right Palette Pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Question Box */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold font-mono text-blue-400">
              QUESTION NO. {currentIndex + 1} OF {questions.length}
            </span>

            <button
              onClick={toggleMarkForReview}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                markedForReview[currentQ?.id]
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{markedForReview[currentQ?.id] ? 'Marked for Review ✓' : 'Mark for Review'}</span>
            </button>
          </div>

          {currentQ && (
            <div className="space-y-6">
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.questionText}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((opt, oIdx) => {
                  const optLetter = String.fromCharCode(65 + oIdx);
                  const isSelected = selectedAnswers[currentQ.id] === optLetter;

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(optLetter)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 text-slate-400'
                        }`}
                      >
                        {optLetter}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls Bottom Bar */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
              >
                Finish & Submit
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Question Palette
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-blue-500" />
                <span>Current</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isMarked = Boolean(markedForReview[q.id]);

                let btnStyle = 'bg-slate-800 text-slate-400 hover:bg-slate-700';
                if (isMarked) {
                  btnStyle = 'bg-purple-600 text-white';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-500 text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition ${btnStyle} ${
                      isCurrent ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-black text-white">Submit Examination?</h3>
            <p className="text-xs text-slate-400">
              You have answered {Object.values(selectedAnswers).filter(Boolean).length} out of {questions.length} questions. Are you sure you want to finalize and submit?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
