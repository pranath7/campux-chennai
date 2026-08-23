'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Note, SubjectId } from '@/types';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Sparkles,
  Search,
  Tag,
} from 'lucide-react';

export function NotesSystem() {
  const { notes, addNote, updateNote, deleteNote, subjects, triggerCelebration } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState<SubjectId>('law');
  const [noteTags, setNoteTags] = useState('');

  const filteredNotes = notes.filter((n) => {
    if (selectedSubject !== 'all' && n.subjectId !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const matchTitle = n.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchContent = n.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchTitle && !matchContent) return false;
    }
    return true;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const tagsArray = noteTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: noteTitle,
        content: noteContent,
        subjectId: noteSubject,
        tags: tagsArray,
      });
      setEditingNoteId(null);
    } else {
      addNote({
        title: noteTitle,
        content: noteContent,
        subjectId: noteSubject,
        tags: tagsArray,
        isPinned: false,
      });
      triggerCelebration();
    }

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setIsCreating(false);
  };

  const handleEdit = (n: Note) => {
    setEditingNoteId(n.id);
    setNoteTitle(n.title);
    setNoteContent(n.content);
    setNoteSubject(n.subjectId);
    setNoteTags(n.tags.join(', '));
    setIsCreating(true);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Personal Knowledge Base
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">NOTES & STATUTORY SUMMARIES</h2>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingNoteId(null);
            setNoteTitle('');
            setNoteContent('');
            setNoteTags('');
          }}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Note / Law Summary</span>
        </button>
      </div>

      {/* Editor Drawer */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {editingNoteId ? 'Edit Note' : 'Create New Summary Note'}
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 font-bold hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Subject
              </label>
              <select
                value={noteSubject}
                onChange={(e) => setNoteSubject(e.target.value as SubjectId)}
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
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                placeholder="e.g. Case Laws, AS-10, TVM Formulas"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Title
            </label>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Contract Act Section 25 Consideration Exceptions"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Content (Markdown Supported)
            </label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Type your statutory notes, case rules, or accounting steps here..."
              rows={6}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-wrap gap-2">
          {['all', 'accounting', 'law', 'qa', 'economics'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition uppercase ${
                selectedSubject === sub
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="bg-transparent text-xs font-semibold outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-36 sm:w-48"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((n) => (
          <div
            key={n.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {n.subjectId.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Updated: {new Date(n.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(n)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  title="Edit note"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{n.title}</h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {n.content}
            </div>

            {n.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {n.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
