export type ResultStatus = 'Passed' | 'Failed' | 'Pending' | 'Absent' | 'Incomplete';

export interface SubjectRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  internalMarks?: number | null;
  externalMarks?: number | null;
  totalMarks: number | null;
  maxMarks: number;
  grade: string;
  gradePoints: number | null;
  credits: number;
  resultStatus: ResultStatus;
  category?: 'Theory' | 'Lab' | 'Project' | 'Elective';
  isUncertain?: boolean;
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  currentSemester: number;
  collegeName: string;
  academicYear: string;
  isDemoStudent: boolean;
}

export interface SemesterSummary {
  semester: number;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number | null;
  passedCount: number;
  failedCount: number;
  pendingCount: number;
  subjectsCount: number;
}

export interface AcademicMetrics {
  currentSgpa: number | null;
  cgpa: number | null;
  totalEarnedCredits: number;
  totalAttemptedCredits: number;
  totalPassedSubjects: number;
  attentionCount: number; // failed or pending or grade <= C or marks < 50
  semesterSummaries: SemesterSummary[];
}

export interface GradingScaleItem {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoints: number;
  description: string;
}

export interface GradingSystem {
  name: string;
  scale: GradingScaleItem[];
  formulaDescription: string;
}

export interface ExtractedTranscriptData {
  studentName?: string;
  rollNumber?: string;
  semester?: number;
  academicYear?: string;
  subjects: Array<Partial<SubjectRecord>>;
  rawTextSnippet?: string;
  unclearFieldsCount: number;
  warnings: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  dataReferences?: {
    subjects?: string[];
    sgpa?: number | null;
    cgpa?: number | null;
    ruleApplied?: string;
  };
}

export interface StudyPlanItem {
  day: string;
  focusSubject: string;
  subjectCode: string;
  topics: string[];
  durationMinutes: number;
  practiceQuestions: string[];
  isCompleted: boolean;
}

export interface StudyRecommendation {
  subjectName: string;
  subjectCode: string;
  currentGrade: string;
  currentMarks: number | null;
  status: ResultStatus;
  urgency: 'High' | 'Medium' | 'Low';
  reason: string;
  suggestedFocusAreas: string[];
  keyResources: string[];
}
