'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { askCAStudyAssistant, AIDoubtResponse } from '@/lib/ai';
import { SubjectId } from '@/types';
import {
  Sparkles,
  Send,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  BookOpen,
} from 'lucide-react';

export function AIDoubtSolver() {
  const { selectedSubjectId, setSelectedSubjectId, subjects, addFlashcard, triggerCelebration } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(selectedSubjectId || 'law');
  const [chapterName, setChapterName] = useState('');
  const [taskMode, setTaskMode] = useState<'solve' | 'explain_concept' | 'convert_to_flashcards' | 'exam_evaluator'>('solve');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIDoubtResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() && !uploadedFileName) return;

    setIsLoading(true);
    try {
      const res = await askCAStudyAssistant({
        subjectId: selectedSubject,
        chapterName: chapterName || undefined,
        questionText: inputQuestion,
        imageOrPdfName: uploadedFileName || undefined,
        mode: taskMode,
      });
      setResponse(res);
      triggerCelebration();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">
            Intelligent CA Exam Faculty
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold">
            Gemini & ICAI Knowledge Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI CA MENTOR & DOUBT SOLVER</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ask any conceptual doubt, upload a question snapshot/PDF, generate flashcards, or convert raw draft answers to ICAI exam language.
        </p>
      </div>

      {/* Main Form Box */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Subject Paper
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="accounting">Paper 1: Accounting</option>
              <option value="law">Paper 2: Business Laws</option>
              <option value="qa">Paper 3: Quantitative Aptitude</option>
              <option value="economics">Paper 4: Business Economics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Target Chapter (Optional)
            </label>
            <input
              type="text"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              placeholder="e.g. Contract Act or Partnership"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Assistance Mode
            </label>
            <select
              value={taskMode}
              onChange={(e) => setTaskMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
            >
              <option value="solve">Solve Step-by-Step</option>
              <option value="explain_concept">Explain Concept (Simple vs Exam)</option>
              <option value="convert_to_flashcards">Convert Text to Flashcards</option>
              <option value="exam_evaluator">ICAI Answer Presentation Check</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            Type your Question, Case Scenario or Study Notes:
          </label>
          <textarea
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Paste your numerical problem, statutory query, or type: 'Explain Doctrine of Indoor Management with 3 exceptions'..."
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* File Upload Simulation Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <UploadCloud className="w-4 h-4 text-purple-500" />
            <span>{uploadedFileName ? `Attached: ${uploadedFileName}` : 'Attach Question Snapshot / PDF'}</span>
            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Mentor is Thinking...' : 'Ask AI Study Assistant'}</span>
          </button>
        </div>
      </form>

      {/* AI Response Display Card */}
      {response && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>{response.summary}</span>
          </div>

          {/* Concept Explained */}
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-1">
            <span className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase">
              Core Concept & Legal/Accounting Principle:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {response.conceptExplained}
            </p>
          </div>

          {/* Step-by-Step Solution */}
          {response.stepByStepSolution && (
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                Step-by-Step Working & Statutory Logic:
              </span>
              <div className="space-y-2">
                {response.stepByStepSolution.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Answer */}
          {response.finalAnswer && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
              {response.finalAnswer}
            </div>
          )}

          {/* Common Mistakes & Exam Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {response.commonMistakesToAvoid && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-1.5">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mistakes to Avoid in Exam:</span>
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                  {response.commonMistakesToAvoid.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.examPresentationTip && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Examiner Presentation Tip:</span>
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {response.examPresentationTip}
                </p>
              </div>
            )}
          </div>

          {/* Generated Flashcards if in flashcard mode */}
          {response.generatedFlashcards && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                Generated Flashcards from Your Input:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {response.generatedFlashcards.map((fc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <strong className="text-xs text-slate-900 dark:text-white block">{fc.front}</strong>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line mt-1">
                        {fc.back}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addFlashcard({
                          subjectId: selectedSubject,
                          chapterId: 'gen',
                          chapterName: chapterName || 'AI Generated',
                          front: fc.front,
                          back: fc.back,
                          mastery: 'learning',
                          repetitions: 0,
                          tags: ['AI-Generated', selectedSubject],
                        });
                        triggerCelebration();
                      }}
                      className="mt-2 text-[10px] font-bold py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition text-center"
                    >
                      Save to My Flashcards
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
