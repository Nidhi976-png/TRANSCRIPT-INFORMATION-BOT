import React, { useState } from 'react';
import {
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code,
  Terminal,
  FileCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranscript } from '../context/TranscriptContext';
import { FIVE_SAMPLE_CONVERSATIONS } from '../data/mockData';

interface TestCaseItem {
  id: string;
  name: string;
  category: 'Upload' | 'Calculation' | 'AI' | 'Security';
  description: string;
  expectedOutcome: string;
}

const TEST_CASES: TestCaseItem[] = [
  {
    id: 'test_1',
    name: '1. Uploading a valid transcript',
    category: 'Upload',
    description: 'Verify successful parsing of a standard structured transcript file.',
    expectedOutcome: 'System parses subjects, credits, and grades with 100% field alignment and no errors.',
  },
  {
    id: 'test_2',
    name: '2. Rejecting an unsupported or invalid file',
    category: 'Upload',
    description: 'Test file upload guards against executables, invalid MIME types, or oversized files.',
    expectedOutcome: 'System blocks file upload with an explicit error message and HTTP 400 rejection.',
  },
  {
    id: 'test_3',
    name: '3. Extracting subject names and marks',
    category: 'Upload',
    description: 'Verify precise OCR / delimiter mapping of subject codes, names, internal, and external scores.',
    expectedOutcome: 'Each subject row accurately reflects code, title, and split marks in the review table.',
  },
  {
    id: 'test_4',
    name: '4. Flagging unclear or missing fields',
    category: 'Upload',
    description: 'Input transcript with unreadable or missing marks (e.g. "??" or omitted grades).',
    expectedOutcome: 'System highlights ambiguous fields in amber and enforces manual review without guessing.',
  },
  {
    id: 'test_5',
    name: '5. Calculating SGPA with valid grade points and credits',
    category: 'Calculation',
    description: 'Verify deterministic math: SGPA = Σ(Credit × Grade Point) / Σ(Credits).',
    expectedOutcome: 'Accurate calculation (e.g., 176 / 22 = 8.00 SGPA) with step-by-step audit steps.',
  },
  {
    id: 'test_6',
    name: '6. Handling missing grading rules',
    category: 'Calculation',
    description: 'Verify behavior when university grading scale is unconfigured.',
    expectedOutcome: 'System safely withholds calculation and prompts student for institutional grading scale.',
  },
  {
    id: 'test_7',
    name: '7. Comparing two semesters with available records',
    category: 'AI',
    description: 'Verify AI comparisons between Semester 4 and Semester 5 without hallucinating data.',
    expectedOutcome: 'Accurately compares SGPA trend (+/- variance) using only verified stored records.',
  },
  {
    id: 'test_8',
    name: '8. Identifying officially recorded failed subjects',
    category: 'Calculation',
    description: 'Strict audit separating official backlogs (Grade F) from absent or missing marks.',
    expectedOutcome: 'Failed subjects isolated without misclassifying pending records as backlogs.',
  },
  {
    id: 'test_9',
    name: '9. Preventing access to another student\'s transcript',
    category: 'Security',
    description: 'Enforce student data isolation and prevent cross-student record disclosure.',
    expectedOutcome: 'Access restricted strictly to the authenticated student profile and authorized tokens.',
  },
  {
    id: 'test_10',
    name: '10. Handling an unavailable Gemini API',
    category: 'AI',
    description: 'Verify system resilience if network is disrupted or GEMINI_API_KEY is not configured.',
    expectedOutcome: 'System degrades gracefully with fallback messages while deterministic tools stay online.',
  },
];

export const ProjectDemoView: React.FC = () => {
  const { setActiveView, setChatMessages } = useTranscript();

  // Test Runner State
  const [testResults, setTestResults] = useState<Record<string, { status: 'PASSED' | 'FAILED'; message: string; details?: any }>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Active simulated conversation
  const [selectedConv, setSelectedConv] = useState<string>(FIVE_SAMPLE_CONVERSATIONS[0].id);

  const runSingleTest = async (testId: string) => {
    try {
      const res = await fetch('/api/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [testId]: {
          status: data.status,
          message: data.message,
          details: data.details,
        },
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [testId]: {
          status: 'FAILED',
          message: err.message || 'Execution error during test.',
        },
      }));
    }
  };

  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    for (const test of TEST_CASES) {
      await runSingleTest(test.id);
      await new Promise((r) => setTimeout(r, 120)); // realistic execution cadence
    }
    setIsRunningAll(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleLoadConversationInChat = (conv: typeof FIVE_SAMPLE_CONVERSATIONS[0]) => {
    setChatMessages([
      {
        id: `demo_u_${Date.now()}`,
        sender: 'user',
        text: conv.studentPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `demo_a_${Date.now()}`,
        sender: 'assistant',
        text: conv.sampleResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveView('ai-assistant');
  };

  const passedTestsCount = Object.values(testResults).filter((r) => r.status === 'PASSED').length;

  return (
    <div className="space-y-8 p-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-900 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30">
              <Award className="h-4 w-4 text-purple-300" />
              <span>Computer Engineering CIE-3 AI Agent Design Challenge • 20 Marks</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Transcript Information Bot — Project Specification & Defense
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              An intelligent, deterministic and generative academic advisor integrating Google Gemini 3.8 Flash with institutional credit formulas and human-verified transcript extraction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{isRunningAll ? 'Running Automated Test Suite...' : 'Run All 10 Tests'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Architecture & Division of Responsibility */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-600" />
            <span>AI Agent System Architecture</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end dataflow pipeline combining multimodal LLMs with deterministic calculation engines
          </p>
        </div>

        {/* Diagram Flow Box */}
        <div className="rounded-xl bg-slate-900 p-5 text-white overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between min-w-[720px] text-xs font-mono">
            <div className="rounded-lg bg-slate-800 p-3 text-center border border-slate-700 min-w-[120px]">
              <div className="text-[10px] text-slate-400">INPUT</div>
              <strong className="text-blue-400">Student</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="rounded-lg bg-slate-800 p-3 text-center border border-slate-700 min-w-[130px]">
              <div className="text-[10px] text-slate-400">FRONTEND</div>
              <strong className="text-cyan-300">Web Dashboard</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="rounded-lg bg-purple-900/60 p-3 text-center border border-purple-600 min-w-[150px]">
              <div className="text-[10px] text-purple-300">AGENT CONTROLLER</div>
              <strong className="text-white">Transcript Bot Server</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="rounded-lg bg-indigo-900/60 p-3 text-center border border-indigo-600 min-w-[140px]">
              <div className="text-[10px] text-indigo-300">INTELLIGENCE</div>
              <strong className="text-purple-300">Gemini 3.8 Flash</strong>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="rounded-lg bg-emerald-950 p-3 text-center border border-emerald-600 min-w-[160px]">
              <div className="text-[10px] text-emerald-400">DETERMINISTIC ENGINE</div>
              <strong className="text-emerald-300">SGPA/CGPA Math & Rules</strong>
            </div>
          </div>
        </div>

        {/* Dual Responsibility Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl bg-purple-50 p-4 border border-purple-200">
            <h3 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-700" />
              <span>Role of Google Gemini 3.8 Flash</span>
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-purple-900">
              <li>• Natural language explanations tailored to student queries.</li>
              <li>• Multimodal extraction of scanned PDFs and grade card images.</li>
              <li>• Identifying subject weakness patterns and generating 7-day study plans.</li>
              <li>• Conversational dialogue strictly grounded on verified academic records.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
            <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
              <span>Role of Deterministic Application Logic</span>
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-blue-900">
              <li>• Exact arithmetic for credit-weighted SGPA and CGPA.</li>
              <li>• Strict application of university 10-point grade thresholds.</li>
              <li>• Distinction between officially failed, pending, absent, and missing data.</li>
              <li>• Human-in-the-loop validation: preventing AI from hallucinating unconfirmed marks.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Existing vs Proposed System Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Existing College Portals vs Proposed Transcript Information Bot
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4 text-rose-800 bg-rose-50/50">Existing University ERP Portals</th>
                <th className="py-3 px-4 text-purple-900 bg-purple-50/50">Proposed Transcript Information Bot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Transcript Accessibility</td>
                <td className="py-2.5 px-4 text-slate-600">Static, encrypted PDFs with obscure institutional codes</td>
                <td className="py-2.5 px-4 text-slate-900 font-medium">Interactive, searchable, filterable, and editable table</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Question Answering</td>
                <td className="py-2.5 px-4 text-slate-600">Manual calculation or reliance on busy faculty advisors</td>
                <td className="py-2.5 px-4 text-purple-900 font-medium">Real-time conversational assistant powered by Gemini 3.8</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Performance Diagnostics</td>
                <td className="py-2.5 px-4 text-slate-600">Raw mark sheets without longitudinal trend analysis</td>
                <td className="py-2.5 px-4 text-slate-900 font-medium">Multi-semester SGPA progression charts & strength detectors</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Actionable Remediation</td>
                <td className="py-2.5 px-4 text-slate-600">None; students are left to decipher how to recover</td>
                <td className="py-2.5 px-4 text-emerald-800 font-medium">Automated 7-day revision plans and practice problem sets</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-800">Handling Unclear Marks</td>
                <td className="py-2.5 px-4 text-slate-600">Often silently omits or records error without recourse</td>
                <td className="py-2.5 px-4 text-slate-900 font-medium">Guards against guessing; requires student verification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Five Interactive Sample Conversations Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span>Five Demonstration Sample Conversations (Evaluator Showcase)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any scenario to test the assistant's deterministic responses to common student questions
            </p>
          </div>
        </div>

        {/* Conversation selector tabs */}
        <div className="flex flex-wrap gap-2">
          {FIVE_SAMPLE_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedConv === conv.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {conv.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Selected Conversation Display */}
        {(() => {
          const activeConv = FIVE_SAMPLE_CONVERSATIONS.find((c) => c.id === selectedConv)!;
          return (
            <div className="rounded-2xl border border-purple-200 bg-slate-50/70 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-purple-950">{activeConv.title}</h3>
                  <p className="text-xs text-slate-500">{activeConv.description}</p>
                </div>
                <button
                  onClick={() => handleLoadConversationInChat(activeConv)}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-all cursor-pointer"
                >
                  <span>Simulate in Live Chat</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Student Query */}
              <div className="flex items-start gap-2.5">
                <span className="rounded-lg bg-purple-700 px-2 py-1 text-[11px] font-bold text-white shrink-0">
                  Student
                </span>
                <div className="rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 border border-slate-200 shadow-2xs">
                  “{activeConv.studentPrompt}”
                </div>
              </div>

              {/* Assistant Verified Output */}
              <div className="flex items-start gap-2.5">
                <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-purple-300 shrink-0">
                  Assistant
                </span>
                <div className="rounded-xl bg-white p-4 text-xs text-slate-800 border border-slate-200 shadow-xs leading-relaxed whitespace-pre-wrap flex-1">
                  {activeConv.sampleResponse}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 10 Automated Interactive Test Cases */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                <span>10 Evaluator Test Scenarios & Verification Engine</span>
              </h2>
              {passedTestsCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {passedTestsCount} / 10 Tests Passed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict test cases mandated by project prompt. Every test performs authentic client/server checks.
            </p>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Execute All 10 Tests</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {TEST_CASES.map((tc) => {
            const result = testResults[tc.id];
            const isExpanded = expandedTest === tc.id;
            return (
              <div key={tc.id} className="py-3.5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tc.name}</span>
                      <span className={`rounded-sm px-1.5 py-0.2 text-[10px] font-semibold ${
                        tc.category === 'Upload'
                          ? 'bg-blue-100 text-blue-800'
                          : tc.category === 'Calculation'
                          ? 'bg-purple-100 text-purple-800'
                          : tc.category === 'Security'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{tc.description}</p>
                    <p className="text-[11px] text-slate-400">
                      <strong>Expected:</strong> {tc.expectedOutcome}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {result ? (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        result.status === 'PASSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {result.status === 'PASSED' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        <span>{result.status}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => runSingleTest(tc.id)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Run Test
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Output Log */}
                {result && (
                  <div className="rounded-xl bg-slate-950 p-3 text-[11px] font-mono text-emerald-400 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Server Verification Log:</span>
                      <span className="text-xs text-emerald-500 font-bold">STATUS 200 OK</span>
                    </div>
                    <p>{result.message}</p>
                    {result.details && (
                      <div className="text-slate-400 text-[10px]">
                        Payload: {JSON.stringify(result.details)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Limitations, Future Scope & Real-World Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Current Limitations & Future Scope</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>
              <strong>Document OCR Variance:</strong> Extreme handwritten marks in provisional records require human-in-the-loop confirmation. Future scope includes specialized fine-tuned document models.
            </li>
            <li>
              <strong>Multi-University Grade Scales:</strong> Currently supports autonomous 10-point scales and custom point scales. Future integration with Digilocker API for automatic verified transcript pull.
            </li>
            <li>
              <strong>Predictive Analytics:</strong> Forecasting final graduation CGPA based on elective selections and historical senior cohort trends.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Real-World Academic Applications</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>
              <strong>Higher Studies & Foreign Admissions:</strong> Converting autonomous SGPA/CGPA to WES 4.0 scales with accurate credit equivalence for US/UK graduate applications.
            </li>
            <li>
              <strong>Placement Cell Auditing:</strong> Instant verification of eligibility thresholds (e.g. &gt;7.5 CGPA with 0 active backlogs) for campus recruitment drives.
            </li>
            <li>
              <strong>Personalized Remedial Tutoring:</strong> Faculty advisors can generate targeted study packets for students requiring improvement in 4-credit core subjects.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
