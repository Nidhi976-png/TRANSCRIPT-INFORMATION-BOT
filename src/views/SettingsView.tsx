import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  RotateCcw,
  Check,
  User,
  GraduationCap,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';

export const SettingsView: React.FC = () => {
  const {
    studentProfile,
    setStudentProfile,
    gradingSystem,
    setGradingSystem,
    resetToDemoData,
    transcriptRecords,
  } = useTranscript();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profileForm, setProfileForm] = useState(studentProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Reset all transcript records back to the default demo student Priya Sharma (CE-2023-042)?')) {
      resetToDemoData();
      setProfileForm(studentProfile);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Academic Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure institutional grading scales, student identities, and privacy safeguards
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Student Profile Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Identity Profile</h3>
            <p className="text-xs text-slate-500">Academic identity used in transcripts and AI conversations</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Student Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Roll / Registration Number</label>
              <input
                type="text"
                value={profileForm.rollNumber}
                onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Department / Branch</label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Current Semester</label>
              <select
                value={profileForm.currentSemester}
                onChange={(e) => setProfileForm({ ...profileForm, currentSemester: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Academic Year</label>
              <input
                type="text"
                value={profileForm.academicYear}
                onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-all cursor-pointer"
            >
              Update Student Profile
            </button>
          </div>
        </form>
      </div>

      {/* Institutional Grading Scale Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Grading Scale Rules</h3>
            <p className="text-xs text-slate-500">{gradingSystem.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Grade Letter</th>
                <th className="py-2.5 px-3">Marks Range (%)</th>
                <th className="py-2.5 px-3 text-center">Grade Points (GP)</th>
                <th className="py-2.5 px-3">Official Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradingSystem.scale.map((item) => (
                <tr key={item.grade} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-purple-900">{item.grade}</td>
                  <td className="py-2 px-3 text-slate-700 font-mono">
                    {item.minMarks}% – {item.maxMarks}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-slate-800 font-mono">
                    {item.gradePoints}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500">
          *Formula applied: SGPA = Σ(Credit × Grade Point) / Σ(Credits); CGPA = Σ(Semester Credits × SGPA) / Σ(Semester Credits).
        </p>
      </div>

      {/* Security & Data Safeguards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Security & Academic Privacy Enforcements</h3>
            <p className="text-xs text-slate-500">Built-in protections ensuring FERPA and data compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Server-Side Secret Isolation</span>
            <p className="text-slate-600 text-[11px]">
              Gemini API keys are maintained purely in backend Node.js environment variables (`GEMINI_API_KEY`) and are never leaked to client bundles.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">No Unprotected Public Database</span>
            <p className="text-slate-600 text-[11px]">
              Transcripts remain strictly confined to the authorized session. Records from student A cannot be accessed or queried by student B.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-900">Reset Demo Student Records</h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Restores all 5 semesters to the default fictional Priya Sharma profile ({transcriptRecords.length} records currently loaded).
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Records</span>
        </button>
      </div>
    </div>
  );
};
