'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DailyTask, TaskType, TaskPriority, SubjectId } from '@/types';
import {
  CalendarCheck,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Tag,
} from 'lucide-react';

export function DailyPlanner() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    startTimer,
    revisions,
    completeRevision,
    setActiveTab,
    setSelectedSubjectId,
  } = useApp();

  const [activeTabPlanner, setActiveTabPlanner] = useState<'today' | 'revisions' | 'backlog'>('today');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('accounting');
  const [newType, setNewType] = useState<TaskType>('study');
  const [newMinutes, setNewMinutes] = useState(45);
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newTimeSlot, setNewTimeSlot] = useState('09:00 - 09:45');

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.taskType === filterType;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      subjectId: newSubject,
      taskType: newType,
      estimatedMinutes: Number(newMinutes),
      priority: newPriority,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      scheduledTime: newTimeSlot,
    });

    setNewTitle('');
    setIsAddingTask(false);
  };

  const handleStartTask = (task: DailyTask) => {
    setSelectedSubjectId(task.subjectId);
    startTimer(
      task.estimatedMinutes,
      'pomodoro',
      task.subjectId,
      task.chapterId,
      task.chapterName
    );
    updateTask(task.id, { status: 'in_progress' });
    setActiveTab('timer');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Intelligent Execution Hub
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">DAILY STUDY PLANNER</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTabPlanner('today')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTabPlanner === 'today'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Today's Schedule ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTabPlanner('revisions')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTabPlanner === 'revisions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Spaced Revisions ({revisions.filter((r) => r.status === 'due_today' || r.status === 'overdue').length})
            </button>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal / Form Drawer */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Create Custom Study Task</h3>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Task Title / Chapter Objective
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Law — Sale of Goods Act (Caveat Emptor exceptions)"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value as SubjectId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
              >
                <option value="accounting">Accounting</option>
                <option value="law">Business Laws</option>
                <option value="qa">Quantitative Aptitude</option>
                <option value="economics">Business Economics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Task Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as TaskType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
              >
                <option value="study">Study</option>
                <option value="revision">Revision</option>
                <option value="practice">Practice</option>
                <option value="pyq">PYQ</option>
                <option value="mock">Mock</option>
                <option value="flashcards">Flashcards</option>
                <option value="mistake_review">Mistake Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Duration (min)</label>
              <input
                type="number"
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value))}
                min="10"
                max="300"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              Save to Planner
            </button>
          </div>
        </form>
      )}

      {/* Task Filters */}
      {activeTabPlanner === 'today' && (
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'study', 'revision', 'practice', 'pyq', 'mock', 'mistake_review'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Tasks List Content */}
      {activeTabPlanner === 'today' ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/70 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                    : isInProgress
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() =>
                      updateTask(task.id, {
                        status: isCompleted ? 'pending' : 'completed',
                        completedAt: isCompleted ? undefined : new Date().toISOString(),
                      })
                    }
                    className={`mt-1 w-6 h-6 rounded-xl border flex items-center justify-center transition ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {task.scheduledTime && (
                        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {task.scheduledTime}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {task.subjectId.toUpperCase()}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {task.taskType.replace('_', ' ')}
                      </span>
                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          Urgent
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold mt-1.5 ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.recommendedReason && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{task.recommendedReason}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {task.estimatedMinutes}m
                  </span>

                  {!isCompleted && (
                    <button
                      onClick={() => handleStartTask(task)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>START</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      updateTask(task.id, {
                        status: isCompleted ? 'pending' : 'completed',
                        completedAt: isCompleted ? undefined : new Date().toISOString(),
                      })
                    }
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition border ${
                      isCompleted
                        ? 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                    }`}
                  >
                    {isCompleted ? 'UNDO' : 'COMPLETE'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Spaced Repetitions Due List */
        <div className="space-y-3">
          {revisions.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {rev.subjectId.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Interval #{rev.intervalIndex + 1} • Due: {rev.dueDate}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                  {rev.chapterName}
                </h4>
              </div>

              <button
                onClick={() => completeRevision(rev.id)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Revised</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
