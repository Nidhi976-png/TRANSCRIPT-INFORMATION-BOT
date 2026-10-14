import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  FileText,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { SubjectRecord, ResultStatus } from '../types/transcript';
import { calculateSGPA, getGradeFromMarks } from '../utils/academicCalculations';

export const MyTranscriptView: React.FC = () => {
  const {
    transcriptRecords,
    selectedSemester,
    setSelectedSemester,
    updateRecord,
    deleteRecord,
    addRecord,
    studentProfile,
    gradingSystem,
  } = useTranscript();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'subjectCode' | 'subjectName' | 'totalMarks' | 'gradePoints' | 'credits'>('subjectCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Edit / Add Modal State
  const [editingRecord, setEditingRecord] = useState<SubjectRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Record Form State
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    semester: selectedSemester,
    internalMarks: '',
    externalMarks: '',
    totalMarks: '',
    maxMarks: '100',
    grade: 'A',
    gradePoints: '8',
    credits: '4',
    resultStatus: 'Passed' as ResultStatus,
    category: 'Theory' as 'Theory' | 'Lab' | 'Project' | 'Elective',
  });

  // Filtered and sorted subjects
  const filteredRecords = useMemo(() => {
    return transcriptRecords
      .filter((s) => {
        const matchesSemester = selectedSemester === 0 || s.semester === selectedSemester;
        const matchesSearch =
          s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'ALL' || s.resultStatus.toUpperCase() === statusFilter.toUpperCase();
        return matchesSemester && matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (valA === null || valA === undefined) valA = -1;
        if (valB === null || valB === undefined) valB = -1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [transcriptRecords, selectedSemester, searchTerm, statusFilter, sortField, sortDirection]);

  // Current semester stats
  const semStats = useMemo(() => {
    const list = transcriptRecords.filter((s) => s.semester === selectedSemester);
    return calculateSGPA(list);
  }, [transcriptRecords, selectedSemester]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Subject Code',
      'Subject Name',
      'Semester',
      'Internal Marks',
      'External Marks',
      'Total Marks',
      'Max Marks',
      'Grade',
      'Grade Points',
      'Credits',
      'Result Status',
    ];
    const rows = filteredRecords.map((r) => [
      r.subjectCode,
      `"${r.subjectName}"`,
      r.semester,
      r.internalMarks ?? '',
      r.externalMarks ?? '',
      r.totalMarks ?? '',
      r.maxMarks,
      r.grade,
      r.gradePoints ?? '',
      r.credits,
      r.resultStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${studentProfile.rollNumber}_Semester_${selectedSemester}_Transcript.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateRecord(editingRecord.id, editingRecord);
    setEditingRecord(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const internal = formData.internalMarks ? Number(formData.internalMarks) : null;
    const external = formData.externalMarks ? Number(formData.externalMarks) : null;
    const maxMarks = Number(formData.maxMarks) || 100;
    const total = formData.totalMarks ? Number(formData.totalMarks) : (internal !== null && external !== null ? internal + external : null);

    // Auto compute grade points if user didn't override
    let grade = formData.grade;
    let gradePoints = Number(formData.gradePoints);
    if (total !== null && !formData.grade) {
      const g = getGradeFromMarks(total, maxMarks, gradingSystem.scale);
      grade = g.grade;
      gradePoints = g.gradePoints;
    }

    addRecord({
      subjectCode: formData.subjectCode.toUpperCase(),
      subjectName: formData.subjectName,
      semester: Number(formData.semester),
      internalMarks: internal,
      externalMarks: external,
      totalMarks: total,
      maxMarks,
      grade,
      gradePoints,
      credits: Number(formData.credits) || 3,
      resultStatus: formData.resultStatus,
      category: formData.category,
    });

    setIsAddModalOpen(false);
    setFormData({
      subjectCode: '',
      subjectName: '',
      semester: selectedSemester,
      internalMarks: '',
      externalMarks: '',
      totalMarks: '',
      maxMarks: '100',
      grade: 'A',
      gradePoints: '8',
      credits: '4',
      resultStatus: 'Passed',
      category: 'Theory',
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Transcript Records</h1>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              {filteredRecords.length} Subjects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Student-approved source of truth for calculations and AI query responses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject Record</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Semester Snapshot Banner */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/60 to-indigo-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-purple-900">Semester View:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedSemester === sem
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-purple-100 border border-slate-200'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
              <button
                onClick={() => setSelectedSemester(0)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  selectedSemester === 0
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-purple-100 border border-slate-200'
                }`}
              >
                All Semesters
              </button>
            </div>
          </div>

          {selectedSemester > 0 && (
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-600">
                SGPA:{' '}
                <strong className="text-purple-800 text-sm">
                  {semStats.sgpa !== null ? semStats.sgpa.toFixed(2) : 'N/A'}
                </strong>
              </span>
              <span className="text-slate-600">
                Total Credits:{' '}
                <strong className="text-slate-900">{semStats.totalCredits}</strong>
              </span>
              <span className="text-slate-600">
                Passed:{' '}
                <strong className="text-emerald-700">{semStats.passedCount}</strong>
              </span>
              {semStats.failedCount > 0 && (
                <span className="text-rose-600 font-bold">
                  Failed: {semStats.failedCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject code (e.g. CS501) or subject title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter records by status"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-purple-500 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed (Backlog)</option>
            <option value="PENDING">Pending</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
      </div>

      {/* Main Transcript Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th
                  onClick={() => handleSort('subjectCode')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Code</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('subjectName')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Subject Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">Sem</th>
                <th className="py-3 px-3 text-right">Internal</th>
                <th className="py-3 px-3 text-right">External</th>
                <th
                  onClick={() => handleSort('totalMarks')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Marks</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th
                  onClick={() => handleSort('gradePoints')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>GP</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('credits')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Credits</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No transcript records match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((sub) => {
                  const isAttention = sub.grade === 'C' || sub.grade === 'P' || sub.grade === 'F' || sub.resultStatus !== 'Passed';
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{sub.subjectCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{sub.subjectName}</div>
                        {sub.category && (
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {sub.category}
                          </span>
                        )}
                        {sub.notes && (
                          <div className="text-[10px] text-amber-700 mt-0.5">{sub.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600 font-medium">{sub.semester}</td>
                      <td className="py-3 px-3 text-right text-slate-600 font-mono">
                        {sub.internalMarks !== null && sub.internalMarks !== undefined ? sub.internalMarks : '-'}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 font-mono">
                        {sub.externalMarks !== null && sub.externalMarks !== undefined ? sub.externalMarks : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {sub.totalMarks !== null && sub.totalMarks !== undefined ? (
                          <span>{sub.totalMarks} <span className="text-slate-400 text-[10px]">/{sub.maxMarks}</span></span>
                        ) : (
                          <span className="text-amber-600 font-sans">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block rounded-xs px-2 py-0.5 text-xs font-bold ${
                          sub.grade === 'O'
                            ? 'bg-purple-100 text-purple-800'
                            : sub.grade === 'A+' || sub.grade === 'A'
                            ? 'bg-blue-100 text-blue-800'
                            : sub.grade === 'B+' || sub.grade === 'B'
                            ? 'bg-indigo-100 text-indigo-800'
                            : sub.grade === 'C' || sub.grade === 'P'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">
                        {sub.gradePoints !== null && sub.gradePoints !== undefined ? sub.gradePoints : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">{sub.credits}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          sub.resultStatus === 'Passed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sub.resultStatus === 'Failed'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {sub.resultStatus === 'Passed' && <CheckCircle className="h-3 w-3" />}
                          {sub.resultStatus === 'Failed' && <AlertTriangle className="h-3 w-3" />}
                          <span>{sub.resultStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingRecord(sub)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                            title="Edit Subject Record"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${sub.subjectCode} - ${sub.subjectName}?`)) {
                                deleteRecord(sub.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Record: {editingRecord.subjectCode}
              </h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={editingRecord.subjectCode}
                    onChange={(e) => setEditingRecord({ ...editingRecord, subjectCode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Semester</label>
                  <input
                    type="number"
                    value={editingRecord.semester}
                    onChange={(e) => setEditingRecord({ ...editingRecord, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingRecord.subjectName}
                  onChange={(e) => setEditingRecord({ ...editingRecord, subjectName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Internal Marks</label>
                  <input
                    type="number"
                    value={editingRecord.internalMarks ?? ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, internalMarks: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">External Marks</label>
                  <input
                    type="number"
                    value={editingRecord.externalMarks ?? ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, externalMarks: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={editingRecord.totalMarks ?? ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, totalMarks: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Grade</label>
                  <input
                    type="text"
                    value={editingRecord.grade}
                    onChange={(e) => setEditingRecord({ ...editingRecord, grade: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Grade Points</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRecord.gradePoints ?? ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, gradePoints: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={editingRecord.credits}
                    onChange={(e) => setEditingRecord({ ...editingRecord, credits: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Result Status</label>
                <select
                  value={editingRecord.resultStatus}
                  onChange={(e) => setEditingRecord({ ...editingRecord, resultStatus: e.target.value as ResultStatus })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                >
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed (Backlog)</option>
                  <option value="Pending">Pending</option>
                  <option value="Absent">Absent</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Subject Record</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS508"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Semester</label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Computing"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Internal Marks</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={formData.internalMarks}
                    onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">External Marks</label>
                  <input
                    type="number"
                    placeholder="e.g. 60"
                    value={formData.externalMarks}
                    onChange={(e) => setFormData({ ...formData, externalMarks: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    placeholder="Auto or e.g. 85"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Grade Points</label>
                  <input
                    type="number"
                    value={formData.gradePoints}
                    onChange={(e) => setFormData({ ...formData, gradePoints: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Result Status</label>
                  <select
                    value={formData.resultStatus}
                    onChange={(e) => setFormData({ ...formData, resultStatus: e.target.value as ResultStatus })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed (Backlog)</option>
                    <option value="Pending">Pending</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-purple-500 focus:outline-hidden"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                    <option value="Project">Project</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 cursor-pointer"
                >
                  Save Subject Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
