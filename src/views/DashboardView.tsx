import React from 'react';
import {
  GraduationCap,
  Award,
  BookCheck,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Bot,
  UploadCloud,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { SemesterPerformanceChart } from '../components/charts/SemesterPerformanceChart';
import { SubjectMarksChart } from '../components/charts/SubjectMarksChart';

export const DashboardView: React.FC = () => {
  const {
    studentProfile,
    metrics,
    selectedSemester,
    setSelectedSemester,
    transcriptRecords,
    setActiveView,
    setChatMessages,
  } = useTranscript();

  const handleQuickPrompt = (promptText: string) => {
    setActiveView('ai-assistant');
    // We add user prompt and let AIAssistant trigger the real Gemini call
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg_quick_${Date.now()}`,
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const currentSemSubjects = transcriptRecords.filter((s) => s.semester === selectedSemester);
  const attentionSubjects = currentSemSubjects.filter(
    (s) => s.resultStatus === 'Failed' || s.grade === 'C' || s.grade === 'P' || (s.totalMarks && s.totalMarks < 55)
  );

  return (
    <div className="space-y-6 p-6">
      {/* Student Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-200 border border-purple-400/30">
                Sample Demo Student
              </span>
              <span className="text-xs text-slate-300">Roll: {studentProfile.rollNumber}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{studentProfile.name}</h1>
            <p className="text-xs text-slate-300">
              {studentProfile.department} • {studentProfile.year} • Semester {studentProfile.currentSemester} ({studentProfile.academicYear})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('ai-assistant')}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-500 transition-all cursor-pointer"
            >
              <Bot className="h-4 w-4 text-purple-200" />
              <span>Ask Transcript Bot</span>
            </button>
            <button
              onClick={() => setActiveView('upload-transcript')}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-slate-200" />
              <span>Upload New Semester</span>
            </button>
          </div>
        </div>

        {/* Background decorative glow */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Semester SGPA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-hover hover:border-purple-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Semester {selectedSemester} SGPA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {metrics.currentSgpa !== null ? metrics.currentSgpa.toFixed(2) : 'N/A'}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 10.00</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" /> Credit-weighted autonomous scale
          </p>
        </div>

        {/* Cumulative CGPA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-hover hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cumulative CGPA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-950">
              {metrics.cgpa !== null ? metrics.cgpa.toFixed(2) : 'N/A'}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 10.00</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-700 font-medium">
            First Class with Distinction criteria
          </p>
        </div>

        {/* Total Earned Credits */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-hover hover:border-indigo-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Credits Earned</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <BookCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-950">
              {metrics.totalEarnedCredits}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {metrics.totalAttemptedCredits} attempted
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Across {metrics.semesterSummaries.length} completed semesters
          </p>
        </div>

        {/* Subjects Requiring Attention */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-hover hover:border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Requires Attention</span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              metrics.attentionCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${
              metrics.attentionCount > 0 ? 'text-amber-800' : 'text-emerald-700'
            }`}>
              {attentionSubjects.length}
            </span>
            <span className="text-xs font-medium text-slate-400">in Sem {selectedSemester}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {attentionSubjects.length > 0 ? (
              <span className="text-amber-700 font-medium">CS504 Computer Networks (Grade C)</span>
            ) : (
              'All subjects performing above threshold'
            )}
          </p>
        </div>
      </div>

      {/* Quick AI Prompts */}
      <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-blue-50/50 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-900">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>Quick Ask Transcript Bot (One-Click Prompts)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'Summarize my semester results.',
            'Which subject has my highest marks?',
            'Which subjects should I focus on improving?',
            'Compare my first and second semester performance.',
            'Calculate my SGPA step by step.',
            'What should I revise before my next examination?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs border border-slate-200 hover:border-purple-300 hover:text-purple-700 transition-all cursor-pointer"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SemesterPerformanceChart
          summaries={metrics.semesterSummaries}
          currentSgpa={metrics.currentSgpa}
          cgpa={metrics.cgpa}
        />
        <SubjectMarksChart
          subjects={transcriptRecords}
          semesterNumber={selectedSemester}
        />
      </div>

      {/* Bottom Row: Recent Uploads & Attention Subject Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploads */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recent Transcript Records</h3>
              <p className="text-xs text-slate-500">Student-confirmed academic entries</p>
            </div>
            <button
              onClick={() => setActiveView('my-transcript')}
              className="flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              <span>View All Records</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Subject Name</th>
                  <th className="pb-2">Marks</th>
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Credits</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSemSubjects.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-semibold text-slate-800">{sub.subjectCode}</td>
                    <td className="py-2.5 text-slate-600 max-w-xs truncate">{sub.subjectName}</td>
                    <td className="py-2.5 font-medium text-slate-700">
                      {sub.totalMarks !== null ? `${sub.totalMarks}/${sub.maxMarks}` : 'N/A'}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-block rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                        sub.grade === 'O' || sub.grade === 'A+'
                          ? 'bg-purple-100 text-purple-800'
                          : sub.grade === 'A' || sub.grade === 'B+'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{sub.credits}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle className="h-3 w-3" /> {sub.resultStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Subject Alert Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <AlertOctagon className="h-4 w-4 text-amber-600" />
              <span>Subject Requiring Attention</span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Deterministic rule flagged CS504 as candidate for academic revision.
            </p>

            <div className="mt-4 rounded-xl bg-white p-3.5 border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>CS504: Computer Networks</span>
                <span className="text-amber-700">52 / 100</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>Grade: <strong>C (5 GP)</strong></span>
                <span>Credits: <strong>4</strong></span>
                <span>Internal: <strong>16/30</strong></span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600">
                External exam marks were 36/70. Recommend revising Transport Layer congestion control and subnetting IP algorithms.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('study-recommendations')}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-700 py-2.5 text-xs font-semibold text-white hover:bg-amber-800 transition-all cursor-pointer"
          >
            <span>Generate 7-Day Study Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
