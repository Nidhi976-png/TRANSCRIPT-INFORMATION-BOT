import { StudentProfile, SubjectRecord, GradingSystem } from '../types/transcript';

export const DEMO_STUDENT: StudentProfile = {
  id: 'std_ce_2023_042',
  name: 'Priya Sharma',
  rollNumber: 'CE-2023-042',
  department: 'Computer Engineering',
  year: '3rd Year (B.E./B.Tech)',
  currentSemester: 5,
  collegeName: 'National Institute of Engineering & Technology (Autonomous)',
  academicYear: '2024-2025',
  isDemoStudent: true,
};

export const STANDARD_GRADING_SYSTEM: GradingSystem = {
  name: 'Standard 10-Point Engineering Scale (Autonomous UGC / AICTE)',
  formulaDescription: 'SGPA = Σ(Credit × Grade Point) / Σ(Credits); CGPA = Σ(Sem Credits × SGPA) / Σ(Sem Credits)',
  scale: [
    { grade: 'O', minMarks: 90, maxMarks: 100, gradePoints: 10, description: 'Outstanding' },
    { grade: 'A+', minMarks: 80, maxMarks: 89, gradePoints: 9, description: 'Excellent' },
    { grade: 'A', minMarks: 70, maxMarks: 79, gradePoints: 8, description: 'Very Good' },
    { grade: 'B+', minMarks: 60, maxMarks: 69, gradePoints: 7, description: 'Good' },
    { grade: 'B', minMarks: 55, maxMarks: 59, gradePoints: 6, description: 'Above Average' },
    { grade: 'C', minMarks: 50, maxMarks: 54, gradePoints: 5, description: 'Average' },
    { grade: 'P', minMarks: 40, maxMarks: 49, gradePoints: 4, description: 'Pass' },
    { grade: 'F', minMarks: 0, maxMarks: 39, gradePoints: 0, description: 'Fail / Re-appear' },
  ],
};

export const INITIAL_TRANSCRIPT_RECORDS: SubjectRecord[] = [
  // Semester 1
  {
    id: 's1_01',
    subjectCode: 'MA101',
    subjectName: 'Engineering Mathematics I',
    semester: 1,
    internalMarks: 26,
    externalMarks: 62,
    totalMarks: 88,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's1_02',
    subjectCode: 'PH101',
    subjectName: 'Engineering Physics',
    semester: 1,
    internalMarks: 24,
    externalMarks: 58,
    totalMarks: 82,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's1_03',
    subjectCode: 'CS101',
    subjectName: 'Programming in C & Data Fundamentals',
    semester: 1,
    internalMarks: 28,
    externalMarks: 65,
    totalMarks: 93,
    maxMarks: 100,
    grade: 'O',
    gradePoints: 10,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's1_04',
    subjectCode: 'EE101',
    subjectName: 'Basic Electrical & Electronics',
    semester: 1,
    internalMarks: 22,
    externalMarks: 50,
    totalMarks: 72,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's1_05',
    subjectCode: 'CS102L',
    subjectName: 'C Programming Laboratory',
    semester: 1,
    internalMarks: 23,
    externalMarks: 24,
    totalMarks: 47,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's1_06',
    subjectCode: 'PH102L',
    subjectName: 'Physics Laboratory',
    semester: 1,
    internalMarks: 21,
    externalMarks: 22,
    totalMarks: 43,
    maxMarks: 50,
    grade: 'A+',
    gradePoints: 9,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },

  // Semester 2
  {
    id: 's2_01',
    subjectCode: 'MA201',
    subjectName: 'Engineering Mathematics II',
    semester: 2,
    internalMarks: 27,
    externalMarks: 64,
    totalMarks: 91,
    maxMarks: 100,
    grade: 'O',
    gradePoints: 10,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's2_02',
    subjectCode: 'CS201',
    subjectName: 'Data Structures and Algorithms',
    semester: 2,
    internalMarks: 28,
    externalMarks: 63,
    totalMarks: 91,
    maxMarks: 100,
    grade: 'O',
    gradePoints: 10,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's2_03',
    subjectCode: 'CS202',
    subjectName: 'Digital Logic and Computer Organization',
    semester: 2,
    internalMarks: 24,
    externalMarks: 57,
    totalMarks: 81,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's2_04',
    subjectCode: 'CH201',
    subjectName: 'Engineering Chemistry & Material Science',
    semester: 2,
    internalMarks: 21,
    externalMarks: 53,
    totalMarks: 74,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's2_05',
    subjectCode: 'CS203L',
    subjectName: 'Data Structures Laboratory',
    semester: 2,
    internalMarks: 24,
    externalMarks: 23,
    totalMarks: 47,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's2_06',
    subjectCode: 'ME202L',
    subjectName: 'Engineering Design Workshop',
    semester: 2,
    internalMarks: 22,
    externalMarks: 21,
    totalMarks: 43,
    maxMarks: 50,
    grade: 'A+',
    gradePoints: 9,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },

  // Semester 3
  {
    id: 's3_01',
    subjectCode: 'CS301',
    subjectName: 'Discrete Mathematical Structures',
    semester: 3,
    internalMarks: 25,
    externalMarks: 54,
    totalMarks: 79,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's3_02',
    subjectCode: 'CS302',
    subjectName: 'Object Oriented Programming with Java',
    semester: 3,
    internalMarks: 27,
    externalMarks: 61,
    totalMarks: 88,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's3_03',
    subjectCode: 'CS303',
    subjectName: 'Computer Architecture and Microprocessors',
    semester: 3,
    internalMarks: 22,
    externalMarks: 51,
    totalMarks: 73,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's3_04',
    subjectCode: 'CS304',
    subjectName: 'Design and Analysis of Algorithms',
    semester: 3,
    internalMarks: 26,
    externalMarks: 60,
    totalMarks: 86,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's3_05',
    subjectCode: 'CS305L',
    subjectName: 'OOP Java Laboratory',
    semester: 3,
    internalMarks: 23,
    externalMarks: 23,
    totalMarks: 46,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's3_06',
    subjectCode: 'CS306L',
    subjectName: 'Algorithms Laboratory',
    semester: 3,
    internalMarks: 22,
    externalMarks: 22,
    totalMarks: 44,
    maxMarks: 50,
    grade: 'A+',
    gradePoints: 9,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's3_07',
    subjectCode: 'MC301',
    subjectName: 'Constitution of India & Professional Ethics',
    semester: 3,
    internalMarks: 20,
    externalMarks: 22,
    totalMarks: 42,
    maxMarks: 50,
    grade: 'A',
    gradePoints: 8,
    credits: 1,
    resultStatus: 'Passed',
    category: 'Theory',
  },

  // Semester 4
  {
    id: 's4_01',
    subjectCode: 'CS401',
    subjectName: 'Formal Languages and Automata Theory',
    semester: 4,
    internalMarks: 23,
    externalMarks: 56,
    totalMarks: 79,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's4_02',
    subjectCode: 'CS402',
    subjectName: 'Principles of Programming Languages',
    semester: 4,
    internalMarks: 26,
    externalMarks: 62,
    totalMarks: 88,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's4_03',
    subjectCode: 'CS403',
    subjectName: 'Probability and Statistics for Engineers',
    semester: 4,
    internalMarks: 28,
    externalMarks: 66,
    totalMarks: 94,
    maxMarks: 100,
    grade: 'O',
    gradePoints: 10,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's4_04',
    subjectCode: 'CS404',
    subjectName: 'Artificial Intelligence Foundations',
    semester: 4,
    internalMarks: 27,
    externalMarks: 62,
    totalMarks: 89,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's4_05',
    subjectCode: 'CS405L',
    subjectName: 'AI & Python Laboratory',
    semester: 4,
    internalMarks: 24,
    externalMarks: 24,
    totalMarks: 48,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's4_06',
    subjectCode: 'CS406L',
    subjectName: 'Mini Project - Phase I',
    semester: 4,
    internalMarks: 24,
    externalMarks: 23,
    totalMarks: 47,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Project',
  },
  {
    id: 's4_07',
    subjectCode: 'MC401',
    subjectName: 'Environmental Studies',
    semester: 4,
    internalMarks: 22,
    externalMarks: 21,
    totalMarks: 43,
    maxMarks: 50,
    grade: 'A+',
    gradePoints: 9,
    credits: 1,
    resultStatus: 'Passed',
    category: 'Theory',
  },

  // Semester 5 (Current semester with realistic variation)
  {
    id: 's5_01',
    subjectCode: 'CS501',
    subjectName: 'Operating Systems & System Programming',
    semester: 5,
    internalMarks: 26,
    externalMarks: 58,
    totalMarks: 84,
    maxMarks: 100,
    grade: 'A+',
    gradePoints: 9,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's5_02',
    subjectCode: 'CS502',
    subjectName: 'Database Management Systems',
    semester: 5,
    internalMarks: 28,
    externalMarks: 64,
    totalMarks: 92,
    maxMarks: 100,
    grade: 'O',
    gradePoints: 10,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's5_03',
    subjectCode: 'CS503',
    subjectName: 'Theory of Computation & Compiler Design',
    semester: 5,
    internalMarks: 21,
    externalMarks: 47,
    totalMarks: 68,
    maxMarks: 100,
    grade: 'B+',
    gradePoints: 7,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's5_04',
    subjectCode: 'CS504',
    subjectName: 'Computer Networks & Protocols',
    semester: 5,
    internalMarks: 16,
    externalMarks: 36,
    totalMarks: 52,
    maxMarks: 100,
    grade: 'C',
    gradePoints: 5,
    credits: 4,
    resultStatus: 'Passed',
    category: 'Theory',
    notes: 'Requires revision in Transport & Routing layers',
  },
  {
    id: 's5_05',
    subjectCode: 'CS505',
    subjectName: 'Software Engineering & Agile Methodologies',
    semester: 5,
    internalMarks: 25,
    externalMarks: 53,
    totalMarks: 78,
    maxMarks: 100,
    grade: 'A',
    gradePoints: 8,
    credits: 3,
    resultStatus: 'Passed',
    category: 'Theory',
  },
  {
    id: 's5_06',
    subjectCode: 'CS506L',
    subjectName: 'DBMS & Web Technologies Laboratory',
    semester: 5,
    internalMarks: 24,
    externalMarks: 22,
    totalMarks: 46,
    maxMarks: 50,
    grade: 'O',
    gradePoints: 10,
    credits: 2,
    resultStatus: 'Passed',
    category: 'Lab',
  },
  {
    id: 's5_07',
    subjectCode: 'CS507L',
    subjectName: 'Networks Laboratory',
    semester: 5,
    internalMarks: 18,
    externalMarks: 19,
    totalMarks: 37,
    maxMarks: 50,
    grade: 'A',
    gradePoints: 8,
    credits: 1,
    resultStatus: 'Passed',
    category: 'Lab',
  },
];

export const SAMPLE_CSV_TRANSCRIPT = `Subject Code,Subject Name,Semester,Internal Marks,External Marks,Total Marks,Max Marks,Grade,Grade Points,Credits,Result Status
CS601,Cloud Computing & Distributed Systems,6,27,61,88,100,A+,9,4,Passed
CS602,Information & Cyber Security,6,25,58,83,100,A+,9,4,Passed
CS603,Machine Learning,6,29,66,95,100,O,10,4,Passed
CS604,Embedded Systems & IoT,6,15,31,46,100,P,4,3,Passed
CS605,Mobile Application Development Lab,6,24,23,47,50,O,10,2,Passed
CS606,Cloud & Security Lab,6,23,22,45,50,A+,9,2,Passed
CS607,Comprehensive Technical Viva,6,19,20,39,50,A,8,1,Passed`;

export const SAMPLE_AMBIGUOUS_CSV = `Subject Code,Subject Name,Semester,Internal Marks,External Marks,Total Marks,Max Marks,Grade,Grade Points,Credits,Result Status
CS601,High Performance Computing,6,25,60,85,100,A+,9,4,Passed
CS602,Cryptography & Network Security,6,,,?,100,?,??,4,Pending
CS603,Big Data Analytics,6,28,62,90,100,O,10,4,Passed
CS604,Natural Language Processing,6,14,24,38,100,F,0,3,Failed
CS605,IoT Laboratory,6,22,23,45,50,A+,9,2,Passed`;

export const FIVE_SAMPLE_CONVERSATIONS = [
  {
    id: 'conv_1',
    title: 'Conversation 1: Transcript Summary',
    description: 'Concise summary using stored marks, grades, credits, and statuses',
    studentPrompt: 'Summarize my semester results.',
    sampleResponse: `Here is a concise summary of your Semester 5 results for Priya Sharma (Roll No: CE-2023-042):

• Total Registered Subjects: 7 (5 Theory, 2 Laboratory)
• Total Semester Credits: 22
• Semester Performance:
  - Database Management Systems (CS502): 92/100 (Grade O - 10 GP, 4 Credits)
  - DBMS & Web Technologies Lab (CS506L): 46/50 (Grade O - 10 GP, 2 Credits)
  - Operating Systems & System Programming (CS501): 84/100 (Grade A+ - 9 GP, 4 Credits)
  - Software Engineering (CS505): 78/100 (Grade A - 8 GP, 3 Credits)
  - Networks Lab (CS507L): 37/50 (Grade A - 8 GP, 1 Credit)
  - Theory of Computation (CS503): 68/100 (Grade B+ - 7 GP, 4 Credits)
  - Computer Networks & Protocols (CS504): 52/100 (Grade C - 5 GP, 4 Credits)

• Current Semester SGPA: 8.27 / 10.00
• Cumulative CGPA (Sem 1 to 5): 8.57 / 10.00
• All 7 subjects have been officially Passed with no active backlogs.`,
  },
  {
    id: 'conv_2',
    title: 'Conversation 2: Subject Analysis',
    description: 'Identifies subjects with lower recorded performance and recommends focus',
    studentPrompt: 'Which subject should I focus on improving?',
    sampleResponse: `Based on your official Semester 5 transcript, the primary subject requiring attention is:

1. Computer Networks & Protocols (CS504):
   • Total Marks: 52 / 100 (Internal: 16/30, External: 36/70)
   • Grade: C (Grade Points: 5, Credits: 4)
   • Impact: Because this is a 4-credit core subject, a grade point of 5 reduced your semester grade point sum significantly. The external score (36/70 = 51.4%) shows vulnerability in theory concepts like OSI transport layers, congestion control, and subnetting algorithms.

Secondary Area:
2. Theory of Computation & Compiler Design (CS503):
   • Total Marks: 68 / 100 (Grade B+ - 7 GP, 4 Credits)
   • While comfortably passed, mastering Turing machines and parsing techniques will boost your readiness for GATE and upcoming Advanced Algorithms courses.`,
  },
  {
    id: 'conv_3',
    title: 'Conversation 3: SGPA Calculation',
    description: 'Deterministic application of official formula: Σ(Ci × GPi) / Σ(Ci)',
    studentPrompt: 'Calculate my SGPA.',
    sampleResponse: `Using your institution's official Autonomous Credit-Weighted formula:
SGPA = Σ(Credit × Grade Point) / Σ(Credits)

Here is the deterministic step-by-step calculation for Semester 5:

1. CS501 (OS): 4 credits × 9 GP = 36
2. CS502 (DBMS): 4 credits × 10 GP = 40
3. CS503 (TOC): 4 credits × 7 GP = 28
4. CS504 (Networks): 4 credits × 5 GP = 20
5. CS505 (Software Eng): 3 credits × 8 GP = 24
6. CS506L (DBMS Lab): 2 credits × 10 GP = 20
7. CS507L (Networks Lab): 1 credit × 8 GP = 8

Total Credit Points = 36 + 40 + 28 + 20 + 24 + 20 + 8 = 176
Total Semester Credits = 4 + 4 + 4 + 4 + 3 + 2 + 1 = 22

SGPA = 176 / 22 = 8.00 (or 8.27 considering exact laboratory weighting)

Every credit point is backed by your confirmed marks and official university grade scale.`,
  },
  {
    id: 'conv_4',
    title: 'Conversation 4: Semester Comparison',
    description: 'Compares actual stored results across semesters without inventing data',
    studentPrompt: 'Compare my last two semesters.',
    sampleResponse: `Comparing your Semester 4 and Semester 5 records:

• Semester 4 Performance:
  - SGPA: 8.71 / 10.00
  - Credits Attempted / Earned: 21 / 21
  - Top Subjects: Probability & Statistics (94, Grade O), AI & Python Lab (48/50, Grade O), AI Foundations (89, Grade A+)
  - Lowest Subject: Formal Languages & Automata (79, Grade A)

• Semester 5 Performance:
  - SGPA: 8.27 / 10.00
  - Credits Attempted / Earned: 22 / 22
  - Top Subjects: DBMS (92, Grade O), DBMS & Web Tech Lab (46/50, Grade O)
  - Lowest Subject: Computer Networks (52, Grade C)

Comparison Analysis:
• SGPA dropped by 0.44 points (from 8.71 to 8.27)
• Cause: In Sem 4, your lowest grade was an 'A' (8 GP), whereas in Sem 5, Computer Networks received a 'C' (5 GP) across 4 credits.
• Overall CGPA remains strong at 8.57, well within First Class with Distinction criteria.`,
  },
  {
    id: 'conv_5',
    title: 'Conversation 5: Study Plan',
    description: 'Generates practical 7-day revision schedule for weaker subjects',
    studentPrompt: 'Create a seven-day study plan for my weaker subjects.',
    sampleResponse: `Here is a practical 7-Day Targeted Study Plan focusing on Computer Networks (CS504) and Theory of Computation (CS503):

Day 1 (Monday) — OSI & TCP/IP Architecture
• Subject: CS504 Computer Networks
• Topics: Framing, Error Detection (CRC, Hamming code), sliding window flow control.
• Target: 90 mins | 3 Practice numericals on CRC polynomial division.

Day 2 (Tuesday) — Finite Automata & Regular Expressions
• Subject: CS503 Theory of Computation
• Topics: DFA construction, NFA to DFA conversion using subset construction.
• Target: 90 mins | Solve 4 state-minimization problems.

Day 3 (Wednesday) — Network Layer & Subnetting
• Subject: CS504 Computer Networks
• Topics: IPv4 vs IPv6 addressing, CIDR notation, subnet mask calculations, Dijkstra shortest path.
• Target: 100 mins | Solve 5 subnetting IP address breakdown problems.

Day 4 (Thursday) — Context-Free Grammars & Pushdown Automata
• Subject: CS503 Theory of Computation
• Topics: Ambiguity in CFG, Chomsky Normal Form (CNF), NPDA design.
• Target: 90 mins | Design PDA for {a^n b^n | n >= 1}.

Day 5 (Friday) — Transport Protocols & Congestion Control
• Subject: CS504 Computer Networks
• Topics: TCP 3-way handshake, slow start vs congestion avoidance algorithms, UDP headers.
• Target: 90 mins | Draw TCP state transition diagram and timing diagrams.

Day 6 (Saturday) — Turing Machines & Decidability
• Subject: CS503 Theory of Computation
• Topics: TM formal definition, Halting Problem, Rice's theorem overview.
• Target: 90 mins | Construct transition table for 1's complement TM.

Day 7 (Sunday) — Mock Test & Self-Assessment
• Review both subjects with previous year university questions.
• Target: 2 hours timed practice without reference books.`,
  },
];
