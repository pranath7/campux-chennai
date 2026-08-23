'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Scale, BookOpen, CheckCircle2, RotateCw, Sparkles, HelpCircle, FileText } from 'lucide-react';

export function LawRecallMode() {
  const [activeTabLaw, setActiveTabLaw] = useState<'recall' | 'cases' | 'format'>('recall');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const prompts = [
    {
      act: 'The Indian Contract Act, 1872',
      concept: 'Doctrine of Privity of Contract (Stranger to Contract)',
      question: 'Recall: Definition, Rule, and 5 Statutory Exceptions where a stranger can sue.',
      answer: `### Legal Provision:
General Rule: Only parties to a contract may sue or be sued (Privity of Contract).

### 5 Exceptions (Stranger CAN Sue):
1. **Beneficiary in a Trust**: Beneficiary can enforce trust provisions even if not party to agreement.
2. **Marriage / Family Settlements**: Provision made for marriage expenses of female member in a joint Hindu family partition.
3. **Covenants Running with Land**: Transferee of land bound by conditions attached with property notice.
4. **Acknowledgment or Estoppel**: When promisor by conduct acknowledges liability to third party.
5. **Assignment of Contract**: Assignee can enforce rights under valid assignment.
6. **Contracts through Agent**: Principal can sue on contracts made by agent within scope.`,
    },
    {
      act: 'The Companies Act, 2013',
      concept: 'Doctrine of Indoor Management (Turquand Rule)',
      question: 'Recall: Definition, Legal Protection, Landmark Case Law & 3 Exceptions.',
      answer: `### Legal Provision & Protection:
- Established in **Royal British Bank v. Turquand (1856)**.
- Outsiders dealing with a company are bound to know the MOA & AOA (public documents), but are entitled to assume internal procedures were regular.

### 3 Exceptions (No Protection to Outsider):
1. **Actual Knowledge of Irregularity** (Howard v. Patent Ivory).
2. **Suspicion of Irregularity** / Negligence in inquiring (Anand Bihari Lal v. Dinshaw & Co.).
3. **Forgery** (Ruben v. Great Fingall Consolidated — forged documents are null and void ab initio).`,
    },
    {
      act: 'The Sale of Goods Act, 1930',
      concept: 'Doctrine of Caveat Emptor (Let the Buyer Beware)',
      question: 'Recall: Section 16 rule and 4 critical exceptions.',
      answer: `### Legal Provision (Section 16):
General Rule: The seller is NOT bound to supply goods suitable for buyer's purpose; buyer must inspect.

### Exceptions where Seller is Liable:
1. **Buyer communicates purpose** and relies on seller's skill/judgment (Priest v. Last).
2. **Sale by Description** (implied condition of merchantable quality).
3. **Sale by Sample as well as Description** (bulk must correspond with sample).
4. **Usage of Trade** / Customary conditions.
5. **Seller commits Fraud** or actively conceals latent defects.`,
    },
  ];

  const currentPrompt = prompts[currentPromptIndex];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">
              Paper 2: Business Laws
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
              ICAI Standard
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">LAW SECTION & CASE RECALL HUB</h2>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTabLaw('recall')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabLaw === 'recall' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active Recall
          </button>
          <button
            onClick={() => setActiveTabLaw('format')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabLaw === 'format' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Exam Presentation Format
          </button>
        </div>
      </div>

      {activeTabLaw === 'recall' ? (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/50 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">
                {currentPrompt.act}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Concept {currentPromptIndex + 1} of {prompts.length}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
                Concept Headline
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-0.5">{currentPrompt.concept}</h3>
              <p className="text-sm text-slate-300 mt-2 font-medium bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                {currentPrompt.question}
              </p>
            </div>

            <div className="pt-2">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal Statutory Law & Case Precedents</span>
                </button>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 animate-fade-in text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                  {currentPrompt.answer}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentPromptIndex === 0}
                onClick={() => {
                  setCurrentPromptIndex((i) => Math.max(i - 1, 0));
                  setShowAnswer(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
              >
                Previous Concept
              </button>

              <button
                onClick={() => {
                  setCurrentPromptIndex((i) => (i + 1) % prompts.length);
                  setShowAnswer(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Next Concept Drill →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ICAI Case Study Answer Presentation Framework */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Official ICAI Evaluation Format for Case-Based Questions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Follow this strict 3-Paragraph structure to score 5/5 or 6/6 marks in Business Laws.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
              <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 block mb-1">
                Paragraph 1: Relevant Legal Provisions & Statutory Act
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Begin with: <em>"According to the provisions of Section [X] of The [Act Name], [Year]..."</em> State the general rule of law and cite landmark case laws (e.g. Chinnaya v. Ramayya or Salomon v. Salomon) clearly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-300 block mb-1">
                Paragraph 2: Analysis of Given Case Facts
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Connect the problem statement directly to the legal rule: <em>"In the given case, [Party A] entered into an agreement with [Party B]..."</em> Explain whether the essential conditions were satisfied.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300 block mb-1">
                Paragraph 3: Explicit Conclusion
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Provide a crisp, direct answer to the question asked: <em>"Therefore, [Party A] is entitled to recover damages / the contract is voidable at the option of..."</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
