import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldAlert,
  UserX,
  FileQuestion,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { SubjectRecord, ResultStatus } from '../types/transcript';

export const BacklogStatusView: React.FC = () => {
  const { transcriptRecords, updateRecord, setActiveView } = useTranscript();

  const [activeTab, setActiveTab] = useState<'ALL' | ResultStatus>('ALL');

  const passedList = transcriptRecords.filter((s) => s.resultStatus === 'Passed');
  const failedList = transcriptRecords.filter((s) => s.resultStatus === 'Failed');
  const pendingList = transcriptRecords.filter((s) => s.resultStatus === 'Pending');
  const absentList = transcriptRecords.filter((s) => s.resultStatus === 'Absent');
  const incompleteList = transcriptRecords.filter(
    (s) => s.resultStatus === 'Incomplete' || s.totalMarks === null || s.isUncertain
  );

  const getFilteredList = () => {
    switch (activeTab) {
      case 'Passed':
        return passedList;
      case 'Failed':
        return failedList;
      case 'Pending':
        return pendingList;
      case 'Absent':
        return absentList;
      case 'Incomplete':
        return incompleteList;
      default:
        return transcriptRecords;
    }
  };

  const currentList = getFilteredList();

  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Results Status & Backlog Audit</h1>
        <p className="text-xs text-slate-500 mt-1">
          Strict classification of passed, officially failed, pending re-evaluation, and absent records
        </p>
      </div>

      {/* Crucial Institutional Principle Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 space-y-1">
            <h4 className="font-bold text-blue-950">
              Fundamental Audit Policy: Missing Data is Never Assumed to Be a Backlog
            </h4>
            <p className="text-[11px] text-blue-800 leading-normal">
              In accordance with ethical academic AI principles, Transcript Information Bot distinguishes strictly between an officially recorded university failure (Grade F), a withheld/pending result, an absent examination record, and an unparsed data field. We never record an academic backlog unless confirmed by official records or explicit student review.
            </p>
          </div>
        </div>
      </div>

      {/* Status Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('Passed')}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === 'Passed'
              ? 'border-emerald-500 bg-emerald-50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Passed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-800">{passedList.length}</div>
          <span className="text-[10px] text-slate-400">All cleared credits</span>
        </button>

        <button
          onClick={() => setActiveTab('Failed')}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === 'Failed'
              ? 'border-rose-500 bg-rose-50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Official Backlogs</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-800">{failedList.length}</div>
          <span className="text-[10px] text-slate-400">Requires re-exam</span>
        </button>

        <button
          onClick={() => setActiveTab('Pending')}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === 'Pending'
              ? 'border-amber-500 bg-amber-50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Pending Results</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-800">{pendingList.length}</div>
          <span className="text-[10px] text-slate-400">Under evaluation</span>
        </button>

        <button
          onClick={() => setActiveTab('Absent')}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === 'Absent'
              ? 'border-slate-500 bg-slate-100 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Marked Absent</span>
            <UserX className="h-4 w-4 text-slate-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-800">{absentList.length}</div>
          <span className="text-[10px] text-slate-400">Medical / excused</span>
        </button>

        <button
          onClick={() => setActiveTab('Incomplete')}
          className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === 'Incomplete'
              ? 'border-purple-500 bg-purple-50 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Uncertain / Missing</span>
            <FileQuestion className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-800">{incompleteList.length}</div>
          <span className="text-[10px] text-slate-400">Needs verification</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['ALL', 'Passed', 'Failed', 'Pending', 'Absent', 'Incomplete'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Subjects' : tab}
          </button>
        ))}
      </div>

      {/* Table of Subjects in current category */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-3 text-center">Semester</th>
                <th className="py-3 px-3 text-right">Total Marks</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No subjects in this category.
                  </td>
                </tr>
              ) : (
                currentList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800">{sub.subjectCode}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{sub.subjectName}</div>
                      {sub.notes && (
                        <div className="text-[10px] text-amber-700 mt-0.5">{sub.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">{sub.semester}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {sub.totalMarks !== null ? `${sub.totalMarks}/${sub.maxMarks}` : 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block rounded-xs px-2 py-0.5 text-xs font-bold ${
                        sub.grade === 'O' || sub.grade === 'A+'
                          ? 'bg-purple-100 text-purple-800'
                          : sub.grade === 'F'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{sub.credits}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        sub.resultStatus === 'Passed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sub.resultStatus === 'Failed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {sub.resultStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveView('my-transcript')}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
                      >
                        Edit in Transcript
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
