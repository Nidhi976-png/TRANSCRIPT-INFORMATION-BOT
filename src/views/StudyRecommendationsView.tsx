import React, { useState } from 'react';
import {
  BookOpenCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranscript } from '../context/TranscriptContext';

export const StudyRecommendationsView: React.FC = () => {
  const {
    studentProfile,
    transcriptRecords,
    studyPlan,
    setStudyPlan,
    studyRecommendations,
    setStudyRecommendations,
  } = useTranscript();

  const [targetExam, setTargetExam] = useState<string>('End-Semester University Exams & Improvement');
  const [weeklyHours, setWeeklyHours] = useState<number>(14);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Toggle task completion
  const handleToggleTask = (index: number) => {
    setStudyPlan((prev) => {
      const next = [...prev];
      const newState = !next[index].isCompleted;
      next[index] = { ...next[index], isCompleted: newState };

      // Trigger celebratory confetti if completing task
      if (newState) {
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      return next;
    });
  };

  const completedCount = studyPlan.filter((p) => p.isCompleted).length;
  const progressPercent = studyPlan.length > 0 ? Math.round((completedCount / studyPlan.length) * 100) : 0;

  const handleRegeneratePlan = async () => {
    setIsGenerating(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/study-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile,
          subjects: transcriptRecords,
          targetExam,
          availableHoursPerWeek: weeklyHours,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate study plan.');
      }

      if (data.weeklyPlan && Array.isArray(data.weeklyPlan)) {
        setStudyPlan(data.weeklyPlan);
      }
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setStudyRecommendations(data.recommendations);
      }

      setStatusMessage('AI Study Plan successfully updated with Gemini!');
    } catch (err: any) {
      setStatusMessage(`Notice: ${err.message || 'Using cached study plan'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Study Plan & Recommendations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalized academic revision schedule focusing on your lower scoring subject areas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Analyzing with Gemini...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl bg-purple-50 p-3 text-xs font-medium text-purple-900 border border-purple-200">
          {statusMessage}
        </div>
      )}

      {/* Goal Questionnaire Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-600" />
          <span>Student Goals & Schedule Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Target Examination / Goal
            </label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-purple-500"
            >
              <option value="End-Semester University Exams & Improvement">End-Semester Exams & Improvement</option>
              <option value="GATE Computer Science & IT 2026">GATE Computer Science & IT Preparation</option>
              <option value="Campus Placement Technical Assessments">Campus Placement Technical Interviews</option>
              <option value="Backlog / Remedial Exam Clearance">Backlog / Remedial Exam Clearance</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Available Study Time Per Week
            </label>
            <select
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 focus:border-purple-500"
            >
              <option value={7}>7 Hours / Week (1 hr/day)</option>
              <option value={14}>14 Hours / Week (2 hrs/day)</option>
              <option value={21}>21 Hours / Week (3 hrs/day - Intensive)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRegeneratePlan}
              disabled={isGenerating}
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              Apply Stated Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Disclaimer */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-950">Weekly Study Plan Completion</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-extrabold text-purple-900">{progressPercent}%</span>
              <span className="text-xs text-purple-700">({completedCount} of {studyPlan.length} tasks completed)</span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <div className="h-2.5 w-full rounded-full bg-purple-200 overflow-hidden">
              <div
                className="h-full bg-purple-700 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-purple-800/80 border-t border-purple-200/60 pt-2">
          Disclaimer: These recommendations are educational suggestions generated based on transcript marks, not official academic decrees. Academic success depends on continuous practice and conceptual clarity.
        </p>
      </div>

      {/* Two Columns: Priority Revision Areas & 7-Day Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Focus Cards */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Priority Subject Diagnoses</h3>

          {studyRecommendations.map((rec, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rec.subjectCode}</h4>
                  <span className="text-xs text-slate-600 block">{rec.subjectName}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  rec.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {rec.urgency} Priority
                </span>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {rec.reason}
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Key Revision Topics:</span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {rec.suggestedFocusAreas.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {rec.keyResources && rec.keyResources.length > 0 && (
                <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                  Recommended: {rec.keyResources.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: 7-Day Actionable Checklist */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">7-Day Revision Milestones</h3>

          <div className="space-y-3">
            {studyPlan.map((dayPlan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-4 transition-all ${
                  dayPlan.isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                    : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(idx)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${
                        dayPlan.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-purple-500 bg-white'
                      }`}
                    >
                      {dayPlan.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          dayPlan.isCompleted ? 'text-emerald-900 line-through' : 'text-slate-900'
                        }`}>
                          {dayPlan.day}: {dayPlan.focusSubject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({dayPlan.subjectCode})</span>
                      </div>

                      {/* Topics */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {dayPlan.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Practice Questions */}
                      {dayPlan.practiceQuestions && dayPlan.practiceQuestions.length > 0 && (
                        <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 border border-slate-100">
                          <strong className="text-slate-800">Practice Exercises:</strong>
                          <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10px]">
                            {dayPlan.practiceQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{dayPlan.durationMinutes}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
