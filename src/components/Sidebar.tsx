import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  UploadCloud,
  Bot,
  LineChart,
  Calculator,
  BookOpenCheck,
  AlertTriangle,
  Award,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, metrics, studentProfile } = useTranscript();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-transcript', label: 'My Transcript', icon: FileSpreadsheet, badge: `${metrics.totalPassedSubjects} Passed` },
    { id: 'upload-transcript', label: 'Upload Transcript', icon: UploadCloud },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Gemini 3.8', badgeColor: 'bg-purple-100 text-purple-700' },
    { id: 'performance-analytics', label: 'Performance Analytics', icon: LineChart },
    { id: 'grade-calculator', label: 'Grade Calculator', icon: Calculator },
    { id: 'study-recommendations', label: 'Study Recommendations', icon: BookOpenCheck, badge: 'AI Plan' },
    {
      id: 'backlog-status',
      label: 'Results & Backlogs',
      icon: AlertTriangle,
      badge: metrics.attentionCount > 0 ? `${metrics.attentionCount} Flags` : '0',
      badgeColor: metrics.attentionCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
    },
    { id: 'project-demo', label: 'CIE-3 Project Demo', icon: Award, badge: '20 Marks', badgeColor: 'bg-indigo-100 text-indigo-700 font-bold' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 text-white shadow-md shadow-purple-900/10">
              <Sparkles className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                Transcript Bot
              </h1>
              <span className="text-[10px] font-medium text-purple-600 uppercase tracking-wider block">
                CIE-3 AI Agent
              </span>
            </div>
          </div>
          <p className="mt-2.5 text-[11px] text-slate-500 leading-normal line-clamp-2">
            Understand your results. Track your progress. Plan your next step.
          </p>
        </div>

        {/* Student Mini Card */}
        <div className="mx-3 mt-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">{studentProfile.name}</span>
            <span className="rounded-xs bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
              Sem {studentProfile.currentSemester}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            {studentProfile.rollNumber} • {studentProfile.department}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-[11px]">
            <span className="text-slate-500">CGPA:</span>
            <strong className="text-purple-700 font-bold">{metrics.cgpa?.toFixed(2) ?? 'N/A'}</strong>
            <span className="text-slate-500">Credits:</span>
            <strong className="text-slate-700">{metrics.totalEarnedCredits}</strong>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-900 font-semibold shadow-xs border border-purple-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Fictional Demo Banner */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
        <div className="rounded-lg bg-amber-50/70 p-2 text-amber-800 border border-amber-200/50">
          <p className="font-semibold text-[10px] uppercase tracking-wider text-amber-900">
            Fictional Demo Records
          </p>
          <p className="mt-0.5 text-[10px] text-amber-700 leading-tight">
            Academic records are demo samples for CIE-3 evaluation. Never presented as official college certificates.
          </p>
        </div>
      </div>
    </aside>
  );
};
