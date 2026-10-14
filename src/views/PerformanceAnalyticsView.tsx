import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { SemesterPerformanceChart } from '../components/charts/SemesterPerformanceChart';
import { SubjectMarksChart } from '../components/charts/SubjectMarksChart';

export const PerformanceAnalyticsView: React.FC = () => {
  const { transcriptRecords, metrics, selectedSemester, setSelectedSemester } = useTranscript();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filtered by category
  const filteredRecords = useMemo(() => {
    return transcriptRecords.filter((s) => {
      const matchSem = selectedSemester === 0 || s.semester === selectedSemester;
      const matchCat = categoryFilter === 'ALL' || s.category === categoryFilter;
      return matchSem && matchCat;
    });
  }, [transcriptRecords, selectedSemester, categoryFilter]);

  // Grade Distribution Counts
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      O: 0,
      'A+': 0,
      A: 0,
      'B+': 0,
      B: 0,
      C: 0,
      P: 0,
      F: 0,
    };
    filteredRecords.forEach((s) => {
      if (counts[s.grade] !== undefined) {
        counts[s.grade]++;
      } else {
        counts['F']++;
      }
    });
    return counts;
  }, [filteredRecords]);

  // Strong vs Needs Revision
  const strongSubjects = useMemo(() => {
    return filteredRecords
      .filter((s) => s.grade === 'O' || s.grade === 'A+' || (s.totalMarks && s.totalMarks >= 85))
      .sort((a, b) => (b.totalMarks ?? 0) - (a.totalMarks ?? 0));
  }, [filteredRecords]);

  const revisionNeededSubjects = useMemo(() => {
    return filteredRecords
      .filter((s) => s.grade === 'C' || s.grade === 'P' || s.grade === 'F' || (s.totalMarks && s.totalMarks < 60) || s.resultStatus !== 'Passed')
      .sort((a, b) => (a.totalMarks ?? 0) - (b.totalMarks ?? 0));
  }, [filteredRecords]);

  const totalFilteredCount = filteredRecords.length;

  return (
    <div className="space-y-6 p-6">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Performance Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic data analytics derived directly from your reviewed transcript records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              aria-label="Filter analytics by semester"
              className="bg-transparent font-bold text-purple-900 focus:outline-hidden"
            >
              <option value={0}>All Semesters</option>
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
              <option value={3}>Semester 3</option>
              <option value={4}>Semester 4</option>
              <option value={5}>Semester 5 (Current)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter analytics by subject category"
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="Theory">Theory Only</option>
              <option value="Lab">Lab Only</option>
              <option value="Project">Project Only</option>
              <option value="Elective">Elective Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Cumulative CGPA</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-purple-900">{metrics.cgpa?.toFixed(2) ?? 'N/A'}</span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">First Class Distinction</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Earned / Attempted Credits</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-blue-900">{metrics.totalEarnedCredits}</span>
            <span className="text-xs text-slate-400">/ {metrics.totalAttemptedCredits} Cr</span>
          </div>
          <span className="text-[11px] text-slate-500">100% Completion rate</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Outstanding (O / A+) Grades</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-900">
              {gradeDistribution['O'] + gradeDistribution['A+']}
            </span>
            <span className="text-xs text-slate-400">
              / {totalFilteredCount} total
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {totalFilteredCount > 0
              ? `${Math.round(((gradeDistribution['O'] + gradeDistribution['A+']) / totalFilteredCount) * 100)}% excellence rate`
              : '0%'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Attention Required</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-800">{revisionNeededSubjects.length}</span>
            <span className="text-xs text-slate-400">subjects</span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Grades ≤ C or marks &lt; 60</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SemesterPerformanceChart
          summaries={metrics.semesterSummaries}
          currentSgpa={metrics.currentSgpa}
          cgpa={metrics.cgpa}
        />
        <SubjectMarksChart
          subjects={transcriptRecords}
          semesterNumber={selectedSemester === 0 ? 5 : selectedSemester}
        />
      </div>

      {/* Grade Distribution Bar & Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Grade Distribution Breakdown</h3>
            <p className="text-xs text-slate-500">
              Distribution of letter grades across {totalFilteredCount} records
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-700">
            Autonomous 10-Point Scale
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { grade: 'O', count: gradeDistribution['O'], gp: 10, color: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50' },
            { grade: 'A+', count: gradeDistribution['A+'], gp: 9, color: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' },
            { grade: 'A', count: gradeDistribution['A'], gp: 8, color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50' },
            { grade: 'B+', count: gradeDistribution['B+'], gp: 7, color: 'bg-cyan-600', text: 'text-cyan-700', bg: 'bg-cyan-50' },
            { grade: 'B', count: gradeDistribution['B'], gp: 6, color: 'bg-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
            { grade: 'C', count: gradeDistribution['C'], gp: 5, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
            { grade: 'P', count: gradeDistribution['P'], gp: 4, color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
            { grade: 'F', count: gradeDistribution['F'], gp: 0, color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
          ].map((item) => (
            <div key={item.grade} className={`rounded-xl border border-slate-200/80 p-3 text-center ${item.bg}`}>
              <span className={`text-base font-extrabold ${item.text}`}>{item.grade}</span>
              <div className="text-[10px] text-slate-500">{item.gp} Grade Points</div>
              <div className="mt-2 text-xl font-bold text-slate-900">{item.count}</div>
              <div className="text-[10px] text-slate-400">
                {totalFilteredCount > 0 ? `${Math.round((item.count / totalFilteredCount) * 100)}%` : '0%'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong Subjects vs Revision Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Subjects */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">High Performance Strengths</h3>
              <p className="text-xs text-slate-500">Subjects with Grade O or A+ (≥80% marks)</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {strongSubjects.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-xl bg-emerald-50/50 p-2.5 border border-emerald-100 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{sub.subjectCode}</span>: {sub.subjectName}
                  <div className="text-[10px] text-slate-500">
                    Sem {sub.semester} • {sub.credits} Credits • {sub.category}
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    {sub.grade} ({sub.totalMarks}/{sub.maxMarks})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Revision */}
        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subjects Needing Attention</h3>
              <p className="text-xs text-slate-500">Flagged by deterministic threshold rules for study improvement</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {revisionNeededSubjects.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No subjects flagged for revision in this selection.
              </div>
            ) : (
              revisionNeededSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-xl bg-amber-50/50 p-2.5 border border-amber-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{sub.subjectCode}</span>: {sub.subjectName}
                    <div className="text-[10px] text-slate-500">
                      Sem {sub.semester} • {sub.credits} Credits • Status: {sub.resultStatus}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                      {sub.grade} ({sub.totalMarks ?? 'N/A'}/{sub.maxMarks})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
