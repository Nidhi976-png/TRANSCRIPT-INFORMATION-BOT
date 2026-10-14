import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Image as ImageIcon,
  Sparkles,
  Edit2,
  Trash2,
  RefreshCw,
  Info,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranscript } from '../context/TranscriptContext';
import { SubjectRecord } from '../types/transcript';
import { SAMPLE_CSV_TRANSCRIPT, SAMPLE_AMBIGUOUS_CSV } from '../data/mockData';

export const UploadTranscriptView: React.FC = () => {
  const { setTranscriptRecords, setActiveView } = useTranscript();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extracted rows pending user verification
  const [extractedRows, setExtractedRows] = useState<SubjectRecord[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [semesterInput, setSemesterInput] = useState<number>(6);
  const [extractionMethod, setExtractionMethod] = useState<string>('');

  const MAX_FILE_SIZE_MB = 15;

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'text/csv', 'image/png', 'image/jpeg', 'image/jpg'];
    const isCsvName = file.name.endsWith('.csv');
    if (!validTypes.includes(file.type) && !isCsvName) {
      setErrorMessage('Unsupported file format. Please upload a PDF transcript, a CSV file, or a scanned PNG/JPG image.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (file.type === 'text/csv' || isCsvName) {
        // text content
        setFileBase64(result);
      } else {
        // Data URL base64
        const base64 = result.split(',')[1] || '';
        setFileBase64(base64);
      }
    };

    if (file.type === 'text/csv' || isCsvName) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const processUpload = async (overrideContent?: { text?: string; base64?: string; mimeType?: string; name?: string }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const mime = overrideContent?.mimeType || selectedFile?.type || 'text/csv';
      const name = overrideContent?.name || selectedFile?.name || 'transcript.csv';
      const b64 = overrideContent?.base64 || fileBase64;
      const text = overrideContent?.text || (mime === 'text/csv' ? fileBase64 : undefined);

      const response = await fetch('/api/extract-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: mime !== 'text/csv' ? b64 : undefined,
          fileText: text,
          mimeType: mime,
          fileName: name,
          semesterHint: semesterInput,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to extract transcript details.');
      }

      setExtractedRows(data.subjects || []);
      setWarnings(data.warnings || []);
      setExtractionMethod(data.method);
      setSuccessMessage(
        `Successfully parsed ${data.subjects.length} subjects using ${data.method === 'deterministic_csv_parser' ? 'CSV Parser' : 'Gemini 3.8 Multimodal OCR'}. Please review ambiguous or flagged fields below before confirming.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during file processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSampleCSV = (isAmbiguous: boolean = false) => {
    const sampleText = isAmbiguous ? SAMPLE_AMBIGUOUS_CSV : SAMPLE_CSV_TRANSCRIPT;
    processUpload({
      text: sampleText,
      mimeType: 'text/csv',
      name: isAmbiguous ? 'Semester_6_Ambiguous_Transcript.csv' : 'Semester_6_Official_Transcript.csv',
    });
  };

  const handleUpdateRow = (id: string, field: keyof SubjectRecord, value: any) => {
    setExtractedRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        // Recalculate uncertainty if user filled totalMarks and grade
        if (field === 'totalMarks' || field === 'grade' || field === 'gradePoints') {
          if (updated.totalMarks !== null && updated.grade && updated.grade !== '?' && updated.gradePoints !== null) {
            updated.isUncertain = false;
            updated.notes = undefined;
          }
        }
        return updated;
      })
    );
  };

  const handleDeleteRow = (id: string) => {
    setExtractedRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleConfirmAndSave = () => {
    if (extractedRows.length === 0) return;

    // Check if any row remains uncertain without student confirmation
    const stillUncertain = extractedRows.filter((r) => r.isUncertain);
    if (stillUncertain.length > 0) {
      const confirmProceed = confirm(
        `There are ${stillUncertain.length} subjects with missing or uncertain fields (e.g. ${stillUncertain[0].subjectCode}). Would you like to confirm and save these records with their marked status?`
      );
      if (!confirmProceed) return;
    }

    setTranscriptRecords((prev) => {
      // Remove any existing records with the same semester and subject codes to avoid duplicates
      const newCodes = new Set(extractedRows.map((e) => `${e.semester}_${e.subjectCode}`));
      const filteredPrev = prev.filter((p) => !newCodes.has(`${p.semester}_${p.subjectCode}`));
      return [...filteredPrev, ...extractedRows];
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    setSuccessMessage(`Success! ${extractedRows.length} subjects saved to your verified academic records.`);
    setExtractedRows([]);
    setSelectedFile(null);

    setTimeout(() => {
      setActiveView('my-transcript');
    }, 1200);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Upload & Process Academic Transcript</h1>
        <p className="text-xs text-slate-500 mt-1">
          Supports PDF grade cards, CSV academic records, and scanned images. All extractions require human confirmation before saving.
        </p>
      </div>

      {/* Demo Pre-load Bar for CIE-3 Evaluation */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-purple-900">
                1-Click Demonstration Transcripts (CIE-3 Testing)
              </span>
              <p className="text-[11px] text-purple-700">
                Instantly test the extraction pipeline with pre-configured samples
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLoadSampleCSV(false)}
              disabled={isProcessing}
              className="rounded-lg bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              Load Valid Sem 6 CSV
            </button>
            <button
              onClick={() => handleLoadSampleCSV(true)}
              disabled={isProcessing}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              Load Ambiguous / Missing Marks Sample
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-colors hover:border-purple-400">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 mb-3">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Drag and drop your academic transcript file here
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Supported file types: <strong>PDF (.pdf)</strong>, <strong>CSV (.csv)</strong>, or <strong>Images (.png, .jpg)</strong> up to 15MB
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <label className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-all">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,.csv,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Default Semester:</span>
            <select
              value={semesterInput}
              onChange={(e) => setSemesterInput(Number(e.target.value))}
              aria-label="Default semester for uploaded records"
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-purple-900"
            >
              <option value={1}>Sem 1</option>
              <option value={2}>Sem 2</option>
              <option value={3}>Sem 3</option>
              <option value={4}>Sem 4</option>
              <option value={5}>Sem 5</option>
              <option value={6}>Sem 6</option>
              <option value={7}>Sem 7</option>
              <option value={8}>Sem 8</option>
            </select>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 border border-slate-200">
            {selectedFile.name.endsWith('.pdf') ? (
              <FileText className="h-4 w-4 text-rose-500" />
            ) : selectedFile.name.endsWith('.csv') ? (
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            ) : (
              <ImageIcon className="h-4 w-4 text-blue-500" />
            )}
            <span>{selectedFile.name}</span>
            <span className="text-slate-400">({(selectedFile.size / 1024).toFixed(0)} KB)</span>

            <button
              onClick={() => processUpload()}
              disabled={isProcessing}
              className="ml-3 rounded-lg bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? 'Processing with AI...' : 'Extract Records'}
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-medium text-rose-800 border border-rose-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Warnings Banner for Uncertain Fields */}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span>Ambiguous / Uncertain Fields Detected ({warnings.length})</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Per system rules, we do NOT silently guess missing grades or marks. Please verify and edit uncertain cells directly in the table below before confirming.
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-900">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editable Review Table */}
      {extractedRows.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Review & Verify Extracted Records
              </h3>
              <p className="text-xs text-slate-500">
                Edit any cell if OCR misread a value. You must confirm to commit these to your academic record.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmAndSave}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Confirm & Commit to Record</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-2 text-center">Sem</th>
                  <th className="py-2.5 px-2 text-right">Internal</th>
                  <th className="py-2.5 px-2 text-right">External</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                  <th className="py-2.5 px-2 text-center">Grade</th>
                  <th className="py-2.5 px-2 text-center">GP</th>
                  <th className="py-2.5 px-2 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {extractedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.isUncertain ? 'bg-amber-50/70 hover:bg-amber-100/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.subjectCode}
                        onChange={(e) => handleUpdateRow(row.id, 'subjectCode', e.target.value)}
                        className="w-24 rounded border border-slate-200 px-2 py-1 font-bold text-slate-800 bg-white"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.subjectName}
                        onChange={(e) => handleUpdateRow(row.id, 'subjectName', e.target.value)}
                        className="w-full min-w-[180px] rounded border border-slate-200 px-2 py-1 font-medium text-slate-800 bg-white"
                      />
                      {row.isUncertain && (
                        <span className="block text-[10px] text-amber-700 font-semibold mt-0.5">
                          ⚠️ Uncertain field — please verify
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        value={row.semester}
                        onChange={(e) => handleUpdateRow(row.id, 'semester', Number(e.target.value))}
                        className="w-12 text-center rounded border border-slate-200 px-1 py-1 font-medium bg-white"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        value={row.internalMarks ?? ''}
                        placeholder="N/A"
                        onChange={(e) => handleUpdateRow(row.id, 'internalMarks', e.target.value ? Number(e.target.value) : null)}
                        className="w-14 text-right rounded border border-slate-200 px-1 py-1 bg-white"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        value={row.externalMarks ?? ''}
                        placeholder="N/A"
                        onChange={(e) => handleUpdateRow(row.id, 'externalMarks', e.target.value ? Number(e.target.value) : null)}
                        className="w-14 text-right rounded border border-slate-200 px-1 py-1 bg-white"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        value={row.totalMarks ?? ''}
                        placeholder="N/A"
                        onChange={(e) => handleUpdateRow(row.id, 'totalMarks', e.target.value ? Number(e.target.value) : null)}
                        className={`w-14 text-right rounded border px-1 py-1 font-bold bg-white ${
                          row.totalMarks === null ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-slate-200'
                        }`}
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="text"
                        value={row.grade}
                        onChange={(e) => handleUpdateRow(row.id, 'grade', e.target.value)}
                        className={`w-12 text-center rounded border px-1 py-1 font-bold bg-white ${
                          row.grade === 'Pending' || row.grade === '?'
                            ? 'border-amber-400 bg-amber-50 text-amber-800'
                            : 'border-slate-200'
                        }`}
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        step="0.5"
                        value={row.gradePoints ?? ''}
                        placeholder="GP"
                        onChange={(e) => handleUpdateRow(row.id, 'gradePoints', e.target.value ? Number(e.target.value) : null)}
                        className="w-12 text-center rounded border border-slate-200 px-1 py-1 font-semibold bg-white"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        value={row.credits}
                        onChange={(e) => handleUpdateRow(row.id, 'credits', Number(e.target.value))}
                        className="w-12 text-center rounded border border-slate-200 px-1 py-1 font-semibold bg-white"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <select
                        value={row.resultStatus}
                        onChange={(e) => handleUpdateRow(row.id, 'resultStatus', e.target.value)}
                        aria-label="Result status for extracted row"
                        className="rounded border border-slate-200 px-2 py-1 text-xs font-semibold bg-white"
                      >
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                        <option value="Pending">Pending</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              Showing {extractedRows.length} extracted entries
            </span>
            <button
              onClick={handleConfirmAndSave}
              className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-800 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Confirm & Save All to Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
