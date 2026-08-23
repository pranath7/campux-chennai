'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Calculator, CheckCircle2, AlertTriangle, Play, HelpCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export function AccountsPracticeMode() {
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [calculationInput, setCalculationInput] = useState('');

  const practicalProblems = [
    {
      chapter: 'Partnership Accounts (Admission of Partner)',
      marks: 12,
      problem: `A and B are partners sharing profits in the ratio 3:2. Their Balance Sheet as on 31st March 2024 stood as:
Liabilities: Capital A ₹60,000, Capital B ₹40,000, General Reserve ₹20,000, Creditors ₹30,000. (Total ₹1,50,000)
Assets: Plant & Machinery ₹50,000, Stock ₹30,000, Debtors ₹40,000, Cash at Bank ₹30,000. (Total ₹1,50,000)

They admit C into partnership on 1st April 2024 on the following terms:
1. C brings ₹30,000 as capital for 1/5th share and ₹15,000 as premium for goodwill.
2. Plant & Machinery is revalued at ₹60,000 and Stock is depreciated by 10%.
3. Provision for doubtful debts is to be created at 5% on Debtors.

Prepare: (i) Revaluation Account, (ii) Partner Capital Accounts, (iii) Balance Sheet of the reconstituted firm.`,
      workingNotes: [
        'WN-1: Revaluation Profit = Gain on Machinery (₹10,000) - Loss on Stock (₹3,000) - Provision on Debtors (₹2,000) = ₹5,000 Profit.',
        'WN-2: Revaluation Profit divided between A and B in 3:2 => A gets ₹3,000, B gets ₹2,000.',
        'WN-3: General Reserve (₹20,000) divided in 3:2 => A gets ₹12,000, B gets ₹8,000.',
        'WN-4: Premium for Goodwill (₹15,000) credited to Sacrificing Partners (A: ₹9,000, B: ₹6,000).',
        'WN-5: Closing Capital Balances: A = ₹84,000; B = ₹56,000; C = ₹30,000.',
        'WN-6: Closing Bank Balance = Opening ₹30,000 + Capital ₹30,000 + Goodwill ₹15,000 = ₹75,000.',
        'WN-7: Total of Reconstituted Balance Sheet = ₹2,00,000 on both sides.',
      ],
      finalBalanceSheetTotal: '₹2,00,000',
    },
    {
      chapter: 'Bank Reconciliation Statement (BRS)',
      marks: 10,
      problem: `From the following particulars, prepare a Bank Reconciliation Statement of M/s Sharma Traders as on 31st March 2024:
1. Debit balance as per Bank Column of Cash Book ₹1,25,000.
2. Cheques issued to creditors amounting to ₹45,000, out of which cheques of ₹18,000 only were presented for payment up to 31st March.
3. Cheques received and entered in Cash Book for ₹28,000, but sent to bank on 2nd April 2024.
4. Bank charges ₹650 debited by bank not recorded in cash book.
5. Direct deposit by a customer into bank ₹12,000 not recorded in cash book.`,
      workingNotes: [
        'Starting Point: Debit Balance as per Cash Book = ₹1,25,000',
        'Add: Cheques issued but not presented (₹45,000 - ₹18,000) = +₹27,000',
        'Add: Direct deposit by customer = +₹12,000',
        'Less: Cheques received but not sent to bank = -₹28,000',
        'Less: Bank charges debited by bank = -₹650',
        'Balance as per Pass Book (Credit Balance) = ₹1,25,000 + ₹27,000 + ₹12,000 - ₹28,000 - ₹650 = ₹1,35,350.',
      ],
      finalBalanceSheetTotal: 'Pass Book Credit Balance: ₹1,35,350',
    },
  ];

  const currentProb = practicalProblems[activeProblemIndex];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
              Paper 1: Accounting
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
              Numerical Workshop
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">NUMERICAL STEP PRACTICE</h2>
        </div>

        <div className="flex items-center gap-2">
          {practicalProblems.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveProblemIndex(idx);
                setShowSolution(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeProblemIndex === idx
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Problem #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Practical Problem Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
            {currentProb.chapter}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            {currentProb.marks} Marks ICAI Problem
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {currentProb.problem}
        </p>

        {/* User Calculator / Working Space */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
            Your Rough Working & Balancing Figures:
          </label>
          <textarea
            value={calculationInput}
            onChange={(e) => setCalculationInput(e.target.value)}
            placeholder="Type your working note calculations here before revealing the model solution..."
            rows={3}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
          />
        </div>

        {/* Reveal Solution Button */}
        <div>
          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Step-by-Step Working Notes & Balance Sheet</span>
            </button>
          ) : (
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-200">
                  ICAI Model Working Notes (Evaluation Scheme):
                </span>
                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                  Target Total: {currentProb.finalBalanceSheetTotal}
                </span>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-blue-400 dark:border-blue-600">
                {currentProb.workingNotes.map((wn, wIdx) => (
                  <p key={wIdx} className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    {wn}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
