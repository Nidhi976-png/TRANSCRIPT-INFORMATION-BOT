import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';
import { STANDARD_GRADING_SYSTEM } from '../data/mockData';

interface CalcRow {
  id: string;
  subjectName: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

export const GradeCalculatorView: React.FC = () => {
  const { gradingSystem, metrics } = useTranscript();

  const [targetSemester, setTargetSemester] = useState<number>(5);

  // Editable rows for simulation
  const [rows, setRows] = useState<CalcRow[]>([
    { id: 'c1', subjectName: 'Operating Systems & System Programming', credits: 4, grade: 'A+', gradePoints: 9 },
    { id: 'c2', subjectName: 'Database Management Systems', credits: 4, grade: 'O', gradePoints: 10 },
    { id: 'c3', subjectName: 'Theory of Computation', credits: 4, grade: 'B+', gradePoints: 7 },
    { id: 'c4', subjectName: 'Computer Networks & Protocols', credits: 4, grade: 'C', gradePoints: 5 },
    { id: 'c5', subjectName: 'Software Engineering & Agile', credits: 3, grade: 'A', gradePoints: 8 },
    { id: 'c6', subjectName: 'DBMS Laboratory', credits: 2, grade: 'O', gradePoints: 10 },
    { id: 'c7', subjectName: 'Networks Laboratory', credits: 1, grade: 'A', gradePoints: 8 },
  ]);

  // Handle grade change and auto-set grade points
  const handleGradeChange = (id: string, grade: string) => {
    const scaleItem = gradingSystem.scale.find((s) => s.grade === grade);
    const gp = scaleItem ? scaleItem.gradePoints : 0;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, grade, gradePoints: gp } : r))
    );
  };

  const handleUpdateRow = (id: string, field: keyof CalcRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        subjectName: `Elective / Course ${prev.length + 1}`,
        credits: 3,
        grade: 'A',
        gradePoints: 8,
      },
    ]);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Real-time deterministic calculation
  const calculationResult = useMemo(() => {
    let totalCredits = 0;
    let totalCreditPoints = 0;
    const steps: { name: string; credits: number; gp: number; pts: number }[] = [];
    let hasMissingData = false;

    rows.forEach((r) => {
      const cr = Number(r.credits) || 0;
      const gp = Number(r.gradePoints);

      if (cr <= 0 || isNaN(gp)) {
        hasMissingData = true;
      } else {
        const pts = cr * gp;
        totalCredits += cr;
        totalCreditPoints += pts;
        steps.push({ name: r.subjectName, credits: cr, gp, pts });
      }
    });

    const sgpa = totalCredits > 0 ? Math.round((totalCreditPoints / totalCredits) * 100) / 100 : null;

    return {
      totalCredits,
      totalCreditPoints,
      sgpa,
      steps,
      hasMissingData,
    };
  }, [rows]);

  // Demo Scenarios Loader
  const loadScenario = (type: 'current' | 'honors' | 'improvement') => {
    if (type === 'honors') {
      setRows([
        { id: 'h1', subjectName: 'Cloud Computing Architecture', credits: 4, grade: 'O', gradePoints: 10 },
        { id: 'h2', subjectName: 'Advanced Machine Learning', credits: 4, grade: 'O', gradePoints: 10 },
        { id: 'h3', subjectName: 'Distributed Systems', credits: 4, grade: 'A+', gradePoints: 9 },
        { id: 'h4', subjectName: 'Information Security', credits: 3, grade: 'A+', gradePoints: 9 },
        { id: 'h5', subjectName: 'Capstone Project - Phase 1', credits: 4, grade: 'O', gradePoints: 10 },
        { id: 'h6', subjectName: 'ML Lab', credits: 2, grade: 'O', gradePoints: 10 },
      ]);
    } else if (type === 'improvement') {
      // Show what happens if CS504 Computer Networks is improved from C (5) to A (8)
      setRows([
        { id: 'c1', subjectName: 'Operating Systems & System Programming', credits: 4, grade: 'A+', gradePoints: 9 },
        { id: 'c2', subjectName: 'Database Management Systems', credits: 4, grade: 'O', gradePoints: 10 },
        { id: 'c3', subjectName: 'Theory of Computation', credits: 4, grade: 'B+', gradePoints: 7 },
        { id: 'c4', subjectName: 'Computer Networks (Improved to A)', credits: 4, grade: 'A', gradePoints: 8 },
        { id: 'c5', subjectName: 'Software Engineering & Agile', credits: 3, grade: 'A', gradePoints: 8 },
        { id: 'c6', subjectName: 'DBMS Laboratory', credits: 2, grade: 'O', gradePoints: 10 },
        { id: 'c7', subjectName: 'Networks Laboratory', credits: 1, grade: 'A', gradePoints: 8 },
      ]);
    } else {
      // Default Sem 5
      setRows([
        { id: 'c1', subjectName: 'Operating Systems & System Programming', credits: 4, grade: 'A+', gradePoints: 9 },
        { id: 'c2', subjectName: 'Database Management Systems', credits: 4, grade: 'O', gradePoints: 10 },
        { id: 'c3', subjectName: 'Theory of Computation', credits: 4, grade: 'B+', gradePoints: 7 },
        { id: 'c4', subjectName: 'Computer Networks & Protocols', credits: 4, grade: 'C', gradePoints: 5 },
        { id: 'c5', subjectName: 'Software Engineering & Agile', credits: 3, grade: 'A', gradePoints: 8 },
        { id: 'c6', subjectName: 'DBMS Laboratory', credits: 2, grade: 'O', gradePoints: 10 },
        { id: 'c7', subjectName: 'Networks Laboratory', credits: 1, grade: 'A', gradePoints: 8 },
      ]);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">SGPA & CGPA Deterministic Calculator</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official credit-weighted university formula: SGPA = Σ(Credit × Grade Point) / Σ(Credits)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadScenario('current')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Actual Sem 5 Record
          </button>
          <button
            onClick={() => loadScenario('improvement')}
            className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 cursor-pointer"
          >
            What-If Improvement
          </button>
          <button
            onClick={() => loadScenario('honors')}
            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 cursor-pointer"
          >
            Honors Scenario
          </button>
        </div>
      </div>

      {/* Main Calculation Output Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">
                Calculated Result
              </span>
              <span className="rounded bg-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                Deterministic
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400">Semester SGPA:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">
                  {calculationResult.sgpa !== null ? calculationResult.sgpa.toFixed(2) : '--'}
                </span>
                <span className="text-xs text-slate-400">/ 10.00</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Total Registered Credits:</span>
                <strong className="text-white">{calculationResult.totalCredits}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Grade Points Earned:</span>
                <strong className="text-white">{calculationResult.totalCreditPoints}</strong>
              </div>
              <div className="flex justify-between">
                <span>Grading Scale:</span>
                <strong className="text-purple-300">10-Point Autonomous</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-purple-900/40 p-3 text-[11px] text-purple-200 border border-purple-500/20">
            Formula applied: {calculationResult.totalCreditPoints} ÷ {calculationResult.totalCredits} = {calculationResult.sgpa?.toFixed(2)}
          </div>
        </div>

        {/* Step-by-Step Math Breakdown */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Step-by-Step Formula Breakdown</h3>
              <span className="text-xs text-slate-400 font-mono">Σ(C_i × GP_i) / Σ(C_i)</span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {calculationResult.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100"
                >
                  <span className="font-medium text-slate-800 max-w-xs truncate">{st.name}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500">{st.credits} Credits × {st.gp} GP =</span>
                    <strong className="text-purple-700">{st.pts} Points</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Formula rigorously guards against calculating SGPA from marks alone.</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Validated University Scale
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Subject Entries Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive Subject Inputs</h3>
            <p className="text-xs text-slate-500">
              Adjust credits or grades in real time to simulate performance outcomes
            </p>
          </div>

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Course</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Subject / Course Name</th>
                <th className="py-2.5 px-3 text-center">Credits (C_i)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Points (GP_i)</th>
                <th className="py-2.5 px-3 text-right">Points (C_i × GP_i)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.subjectName}
                      onChange={(e) => handleUpdateRow(row.id, 'subjectName', e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1 font-medium text-slate-800 bg-white focus:border-purple-500"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <select
                      value={row.credits}
                      onChange={(e) => handleUpdateRow(row.id, 'credits', Number(e.target.value))}
                      aria-label="Course credits"
                      className="rounded border border-slate-200 px-2 py-1 font-bold text-slate-800 bg-white"
                    >
                      <option value={1}>1 Credit</option>
                      <option value={2}>2 Credits</option>
                      <option value={3}>3 Credits</option>
                      <option value={4}>4 Credits</option>
                      <option value={5}>5 Credits</option>
                    </select>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <select
                      value={row.grade}
                      onChange={(e) => handleGradeChange(row.id, e.target.value)}
                      aria-label="Course grade"
                      className="rounded border border-slate-200 px-2 py-1 font-bold text-purple-900 bg-white"
                    >
                      {gradingSystem.scale.map((s) => (
                        <option key={s.grade} value={s.grade}>
                          {s.grade} ({s.gradePoints} GP)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-700">
                    {row.gradePoints}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-purple-800">
                    {row.credits * row.gradePoints}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      disabled={rows.length <= 1}
                      className="rounded p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
