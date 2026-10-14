import React, { useState } from 'react';
import { SubjectRecord } from '../../types/transcript';

interface Props {
  subjects: SubjectRecord[];
  semesterNumber: number;
}

export const SubjectMarksChart: React.FC<Props> = ({ subjects, semesterNumber }) => {
  const [hoveredSub, setHoveredSub] = useState<SubjectRecord | null>(null);

  const semSubjects = subjects.filter((s) => s.semester === semesterNumber);

  if (semSubjects.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No subjects available for Semester {semesterNumber}.
      </div>
    );
  }

  // Normalize marks to percentage of maxMarks for consistent bar comparison
  const data = semSubjects.map((s) => {
    const total = s.totalMarks ?? 0;
    const max = s.maxMarks || 100;
    const percentage = Math.round((total / max) * 100);
    return {
      record: s,
      percentage,
      total,
      max,
    };
  });

  const getBarColor = (grade: string, percentage: number) => {
    if (grade === 'O') return 'bg-purple-600 hover:bg-purple-700';
    if (grade === 'A+' || grade === 'A') return 'bg-blue-600 hover:bg-blue-700';
    if (grade === 'B+' || grade === 'B') return 'bg-indigo-500 hover:bg-indigo-600';
    if (grade === 'C' || grade === 'P') return 'bg-amber-500 hover:bg-amber-600';
    return 'bg-rose-500 hover:bg-rose-600';
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Subject-wise Marks & Performance (Semester {semesterNumber})
          </h3>
          <p className="text-xs text-slate-500">
            Percentage normalized scores with institutional grade classification
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-xs bg-purple-600"></span> O / A+ (&gt;80%)
          </span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-xs bg-blue-600"></span> A / B+ (60-79%)
          </span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-500"></span> C / P (&lt;60%)
          </span>
        </div>
      </div>

      <div className="space-y-3.5 pt-2">
        {data.map(({ record, percentage, total, max }) => {
          const isAttention = record.grade === 'C' || record.grade === 'P' || record.grade === 'F' || record.resultStatus !== 'Passed';
          return (
            <div
              key={record.id}
              className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-50"
              onMouseEnter={() => setHoveredSub(record)}
              onMouseLeave={() => setHoveredSub(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{record.subjectCode}</span>
                  <span className="text-slate-600 truncate max-w-[220px] sm:max-w-xs">{record.subjectName}</span>
                  {isAttention && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Needs Attention
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    {total}/{max} ({percentage}%)
                  </span>
                  <span className={`inline-flex min-w-[28px] justify-center rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${
                    record.grade === 'O'
                      ? 'bg-purple-100 text-purple-800'
                      : record.grade === 'A+' || record.grade === 'A'
                      ? 'bg-blue-100 text-blue-800'
                      : record.grade === 'B+' || record.grade === 'B'
                      ? 'bg-indigo-100 text-indigo-800'
                      : record.grade === 'C' || record.grade === 'P'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {record.grade}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {record.credits} Cr
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getBarColor(record.grade, percentage)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {hoveredSub && (
        <div className="mt-3 rounded-xl bg-slate-900 p-3 text-xs text-white shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-purple-300">{hoveredSub.subjectCode}: {hoveredSub.subjectName}</span>
            <span className="rounded bg-purple-800 px-2 py-0.5 text-[11px] font-bold text-white">
              Grade {hoveredSub.grade} ({hoveredSub.gradePoints} GP)
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-4 text-slate-300">
            <span>Internal: <strong>{hoveredSub.internalMarks ?? 'N/A'}</strong></span>
            <span>External: <strong>{hoveredSub.externalMarks ?? 'N/A'}</strong></span>
            <span>Total: <strong>{hoveredSub.totalMarks ?? 'N/A'} / {hoveredSub.maxMarks}</strong></span>
            <span>Credits: <strong>{hoveredSub.credits}</strong></span>
            <span>Status: <strong>{hoveredSub.resultStatus}</strong></span>
          </div>
          {hoveredSub.notes && (
            <p className="mt-1.5 text-amber-300 text-[11px]">Note: {hoveredSub.notes}</p>
          )}
        </div>
      )}
    </div>
  );
};
