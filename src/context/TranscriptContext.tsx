import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SubjectRecord,
  StudentProfile,
  GradingSystem,
  AcademicMetrics,
  ChatMessage,
  StudyPlanItem,
  StudyRecommendation,
} from '../types/transcript';
import {
  DEMO_STUDENT,
  STANDARD_GRADING_SYSTEM,
  INITIAL_TRANSCRIPT_RECORDS,
} from '../data/mockData';
import { calculateAllMetrics } from '../utils/academicCalculations';

interface TranscriptContextType {
  studentProfile: StudentProfile;
  setStudentProfile: (profile: StudentProfile) => void;
  transcriptRecords: SubjectRecord[];
  setTranscriptRecords: React.Dispatch<React.SetStateAction<SubjectRecord[]>>;
  gradingSystem: GradingSystem;
  setGradingSystem: (gradingSystem: GradingSystem) => void;
  metrics: AcademicMetrics;
  selectedSemester: number;
  setSelectedSemester: (sem: number) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  studyPlan: StudyPlanItem[];
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlanItem[]>>;
  studyRecommendations: StudyRecommendation[];
  setStudyRecommendations: React.Dispatch<React.SetStateAction<StudyRecommendation[]>>;
  addRecord: (record: Omit<SubjectRecord, 'id'>) => void;
  updateRecord: (id: string, updated: Partial<SubjectRecord>) => void;
  deleteRecord: (id: string) => void;
  resetToDemoData: () => void;
  activeTestRun: string | null;
  setActiveTestRun: (id: string | null) => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

const STORAGE_KEY_RECORDS = 'tib_records_v1';
const STORAGE_KEY_STUDENT = 'tib_student_v1';
const STORAGE_KEY_CHATS = 'tib_chats_v1';
const STORAGE_KEY_STUDY_PLAN = 'tib_study_plan_v1';

export const TranscriptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentProfile, setStudentProfileState] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      return saved ? JSON.parse(saved) : DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  });

  const [transcriptRecords, setTranscriptRecords] = useState<SubjectRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSCRIPT_RECORDS;
    } catch {
      return INITIAL_TRANSCRIPT_RECORDS;
    }
  });

  const [gradingSystem, setGradingSystem] = useState<GradingSystem>(STANDARD_GRADING_SYSTEM);
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTestRun, setActiveTestRun] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHATS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg_init',
        sender: 'assistant',
        text: `Hello ${DEMO_STUDENT.name}! I am your **Transcript Information Bot**. I have access to your verified academic records across Semesters 1 to 5. You can ask me to summarize your results, compare semesters, check your SGPA/CGPA, or identify which subjects need revision before exams!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDY_PLAN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        day: 'Day 1 (Monday)',
        focusSubject: 'Computer Networks & Protocols',
        subjectCode: 'CS504',
        topics: ['OSI & TCP/IP Reference Models', 'Framing & Bit Stuffing', 'CRC Polynomial Division'],
        durationMinutes: 90,
        practiceQuestions: ['Calculate CRC for polynomial x^4 + x + 1', 'Compare Stop-and-Wait vs Go-Back-N ARQ'],
        isCompleted: false,
      },
      {
        day: 'Day 2 (Tuesday)',
        focusSubject: 'Theory of Computation',
        subjectCode: 'CS503',
        topics: ['DFA Construction', 'NFA to DFA Conversion (Subset Construction)', 'State Minimization'],
        durationMinutes: 90,
        practiceQuestions: ['Convert given NFA with epsilon transitions to DFA', 'Prove state equivalence using table method'],
        isCompleted: false,
      },
      {
        day: 'Day 3 (Wednesday)',
        focusSubject: 'Computer Networks & Protocols',
        subjectCode: 'CS504',
        topics: ['IPv4 Addressing & Subnetting', 'CIDR Prefix Allocation', 'Dijkstra Routing Algorithm'],
        durationMinutes: 100,
        practiceQuestions: ['Given IP 192.168.10.0/26, find subnets and valid hosts', 'Apply Dijkstra algorithm on 6-node network graph'],
        isCompleted: false,
      },
      {
        day: 'Day 4 (Thursday)',
        focusSubject: 'Theory of Computation',
        subjectCode: 'CS503',
        topics: ['Context-Free Grammars', 'Ambiguity Detection', 'Chomsky Normal Form (CNF)'],
        durationMinutes: 90,
        practiceQuestions: ['Convert given CFG to Chomsky Normal Form', 'Design Pushdown Automaton for {a^n b^2n}'],
        isCompleted: false,
      },
      {
        day: 'Day 5 (Friday)',
        focusSubject: 'Computer Networks & Protocols',
        subjectCode: 'CS504',
        topics: ['TCP 3-Way Handshake & Teardown', 'TCP Slow Start & Congestion Avoidance', 'UDP Header vs TCP Header'],
        durationMinutes: 90,
        practiceQuestions: ['Draw TCP state diagram for simultaneous open', 'Explain Reno vs Tahoe congestion windows'],
        isCompleted: false,
      },
      {
        day: 'Day 6 (Saturday)',
        focusSubject: 'Theory of Computation',
        subjectCode: 'CS503',
        topics: ['Turing Machine Standard Definition', 'Instantaneous Descriptions', 'Halting Problem & Decidability'],
        durationMinutes: 90,
        practiceQuestions: ['Design TM for unary addition', 'State Rice Theorem and prove undecidability of blank tape acceptance'],
        isCompleted: false,
      },
      {
        day: 'Day 7 (Sunday)',
        focusSubject: 'Comprehensive Revision & University Papers',
        subjectCode: 'CS504 / CS503',
        topics: ['Solve 2 Previous Year University Question Papers under 2-hour timed conditions'],
        durationMinutes: 120,
        practiceQuestions: ['Attempt Section A & B from Winter 2024 Exam paper'],
        isCompleted: false,
      },
    ];
  });

  const [studyRecommendations, setStudyRecommendations] = useState<StudyRecommendation[]>([
    {
      subjectName: 'Computer Networks & Protocols',
      subjectCode: 'CS504',
      currentGrade: 'C',
      currentMarks: 52,
      status: 'Passed',
      urgency: 'High',
      reason: 'Total score is 52/100 (Internal: 16/30, External: 36/70). Because this is a 4-credit core subject, securing 5 Grade Points pulled down your Semester 5 SGPA.',
      suggestedFocusAreas: ['Subnetting & VLSM Calculations', 'TCP Congestion Control Algorithms', 'Routing Protocols (RIP, OSPF, BGP)'],
      keyResources: ['Tanenbaum Computer Networks (5th Ed)', 'Kurose & Ross Top-Down Approach'],
    },
    {
      subjectName: 'Theory of Computation & Compiler Design',
      subjectCode: 'CS503',
      currentGrade: 'B+',
      currentMarks: 68,
      status: 'Passed',
      urgency: 'Medium',
      reason: 'Score is 68/100 (Grade B+ - 7 GP). Strengthening Automata theory and Parsing will significantly boost your competitive GATE and core interview performance.',
      suggestedFocusAreas: ['Pushdown Automata & CFG Simplification', 'Turing Machine Transition Tables', 'First and Follow Set Computation in Parsing'],
      keyResources: ['Hopcroft & Ullman Automata Theory', 'NPTEL Theory of Computation Video Lectures'],
    },
  ]);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(transcriptRecords));
    } catch {}
  }, [transcriptRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(studentProfile));
    } catch {}
  }, [studentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDY_PLAN, JSON.stringify(studyPlan));
    } catch {}
  }, [studyPlan]);

  const setStudentProfile = (profile: StudentProfile) => {
    setStudentProfileState(profile);
  };

  const metrics = calculateAllMetrics(transcriptRecords, studentProfile.currentSemester);

  const addRecord = (record: Omit<SubjectRecord, 'id'>) => {
    const newRecord: SubjectRecord = {
      ...record,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setTranscriptRecords((prev) => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updated: Partial<SubjectRecord>) => {
    setTranscriptRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const deleteRecord = (id: string) => {
    setTranscriptRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const resetToDemoData = () => {
    setStudentProfileState(DEMO_STUDENT);
    setTranscriptRecords(INITIAL_TRANSCRIPT_RECORDS);
    setGradingSystem(STANDARD_GRADING_SYSTEM);
    setSelectedSemester(5);
    localStorage.removeItem(STORAGE_KEY_RECORDS);
    localStorage.removeItem(STORAGE_KEY_STUDENT);
  };

  return (
    <TranscriptContext.Provider
      value={{
        studentProfile,
        setStudentProfile,
        transcriptRecords,
        setTranscriptRecords,
        gradingSystem,
        setGradingSystem,
        metrics,
        selectedSemester,
        setSelectedSemester,
        activeView,
        setActiveView,
        chatMessages,
        setChatMessages,
        studyPlan,
        setStudyPlan,
        studyRecommendations,
        setStudyRecommendations,
        addRecord,
        updateRecord,
        deleteRecord,
        resetToDemoData,
        activeTestRun,
        setActiveTestRun,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = (): TranscriptContextType => {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error('useTranscript must be used within a TranscriptProvider');
  }
  return context;
};
