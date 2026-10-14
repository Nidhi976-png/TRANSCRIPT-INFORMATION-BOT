import React from 'react';
import { Bot, UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedSemester,
    setSelectedSemester,
    studentProfile,
    metrics,
  } = useTranscript();

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Academic Performance Dashboard';
      case 'my-transcript':
        return 'My Transcript & Subject Records';
      case 'upload-transcript':
        return 'Upload & Extract Transcript';
      case 'ai-assistant':
        return 'AI Transcript Assistant (Gemini 3.8)';
      case 'performance-analytics':
        return 'Academic Performance Analytics';
      case 'grade-calculator':
        return 'SGPA & CGPA Deterministic Calculator';
      case 'study-recommendations':
        return 'AI Study Plan & Recommendations';
      case 'backlog-status':
        return 'Results Status & Backlog Management';
      case 'project-demo':
        return 'CIE-3 AI Agent Design Challenge (20 Marks)';
      case 'settings':
        return 'Settings & Institutional Grading Scales';
      default:
        return 'Transcript Information Bot';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">{getTitle()}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{studentProfile.collegeName}</span>
            <span>•</span>
            <span className="font-medium text-purple-700">{studentProfile.academicYear}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Semester Quick Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
          <span className="text-slate-500 font-medium">Viewing:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            aria-label="Filter records by semester"
            className="bg-transparent font-semibold text-purple-900 focus:outline-hidden cursor-pointer"
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
            <option value={4}>Semester 4</option>
            <option value={5}>Semester 5 (Current)</option>
          </select>
        </div>

        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Demo Source</span>
        </div>

        {/* Quick Action: Ask AI */}
        <button
          onClick={() => setActiveView('ai-assistant')}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-navy-900 via-indigo-900 to-purple-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all"
        >
          <Bot className="h-3.5 w-3.5 text-purple-300" />
          <span>Ask Assistant</span>
        </button>

        {/* Quick Action: Upload */}
        <button
          onClick={() => setActiveView('upload-transcript')}
          className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 transition-all"
        >
          <UploadCloud className="h-3.5 w-3.5 text-purple-600" />
          <span className="hidden md:inline">Upload Transcript</span>
        </button>
      </div>
    </header>
  );
};
