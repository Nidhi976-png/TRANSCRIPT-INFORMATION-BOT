import { SubjectRecord, AcademicMetrics, SemesterSummary, GradingScaleItem } from '../types/transcript';
import { STANDARD_GRADING_SYSTEM } from '../data/mockData';

/**
 * Deterministically computes SGPA following institutional credit-weighted formula:
 * SGPA = Σ(Credit × Grade Point) / Σ(Credits)
 * For subjects with valid credits and grade points.
 */
export function calculateSGPA(subjects: SubjectRecord[]): {
  sgpa: number | null;
  totalCredits: number;
  earnedCredits: number;
  passedCount: number;
  failedCount: number;
  pendingCount: number;
  steps: string[];
} {
  if (!subjects || subjects.length === 0) {
    return {
      sgpa: null,
      totalCredits: 0,
      earnedCredits: 0,
      passedCount: 0,
      failedCount: 0,
      pendingCount: 0,
      steps: ['No subject records available for SGPA calculation.'],
    };
  }

  let totalCreditPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;
  let passedCount = 0;
  let failedCount = 0;
  let pendingCount = 0;
  const steps: string[] = [];

  for (const s of subjects) {
    if (s.resultStatus === 'Passed') {
      passedCount++;
      earnedCredits += s.credits || 0;
    } else if (s.resultStatus === 'Failed') {
      failedCount++;
    } else if (s.resultStatus === 'Pending' || s.resultStatus === 'Incomplete') {
      pendingCount++;
    }

    // Credits count towards denominator if subject is officially registered
    const credit = Number(s.credits) || 0;
    const gp = s.gradePoints !== null && s.gradePoints !== undefined ? Number(s.gradePoints) : null;

    if (credit > 0 && gp !== null && !isNaN(gp)) {
      const points = credit * gp;
      totalCreditPoints += points;
      totalCredits += credit;
      steps.push(`${s.subjectCode} (${s.subjectName}): ${credit} cr × ${gp} GP = ${points} pts`);
    } else {
      steps.push(`${s.subjectCode}: Skipped from numerator/denominator (Credits: ${credit}, GP: ${gp ?? 'N/A'})`);
    }
  }

  if (totalCredits === 0) {
    return {
      sgpa: null,
      totalCredits: 0,
      earnedCredits,
      passedCount,
      failedCount,
      pendingCount,
      steps: [...steps, 'Total valid credits is 0, cannot calculate SGPA.'],
    };
  }

  const rawSgpa = totalCreditPoints / totalCredits;
  const roundedSgpa = Math.round(rawSgpa * 100) / 100;
  steps.push(`Total Points: ${totalCreditPoints} / Total Credits: ${totalCredits} = ${roundedSgpa}`);

  return {
    sgpa: roundedSgpa,
    totalCredits,
    earnedCredits,
    passedCount,
    failedCount,
    pendingCount,
    steps,
  };
}

/**
 * Deterministically computes CGPA:
 * CGPA = Σ(Semester Credits × Semester SGPA) / Σ(Semester Credits)
 */
export function calculateCGPA(allSubjects: SubjectRecord[]): {
  cgpa: number | null;
  totalAttemptedCredits: number;
  totalEarnedCredits: number;
  semesterSummaries: SemesterSummary[];
  steps: string[];
} {
  const semestersMap = new Map<number, SubjectRecord[]>();

  allSubjects.forEach((sub) => {
    const sem = sub.semester || 1;
    if (!semestersMap.has(sem)) {
      semestersMap.set(sem, []);
    }
    semestersMap.get(sem)!.push(sub);
  });

  const sortedSemesters = Array.from(semestersMap.keys()).sort((a, b) => a - b);
  const semesterSummaries: SemesterSummary[] = [];
  const steps: string[] = [];

  let totalWeightedSgpa = 0;
  let totalSemCredits = 0;
  let totalEarnedCredits = 0;

  for (const sem of sortedSemesters) {
    const semSubjects = semestersMap.get(sem)!;
    const calc = calculateSGPA(semSubjects);

    semesterSummaries.push({
      semester: sem,
      totalCredits: calc.totalCredits,
      earnedCredits: calc.earnedCredits,
      sgpa: calc.sgpa,
      passedCount: calc.passedCount,
      failedCount: calc.failedCount,
      pendingCount: calc.pendingCount,
      subjectsCount: semSubjects.length,
    });

    totalEarnedCredits += calc.earnedCredits;

    if (calc.sgpa !== null && calc.totalCredits > 0) {
      const weighted = calc.sgpa * calc.totalCredits;
      totalWeightedSgpa += weighted;
      totalSemCredits += calc.totalCredits;
      steps.push(`Sem ${sem}: SGPA ${calc.sgpa.toFixed(2)} × ${calc.totalCredits} credits = ${weighted.toFixed(2)}`);
    }
  }

  const cgpa = totalSemCredits > 0 ? Math.round((totalWeightedSgpa / totalSemCredits) * 100) / 100 : null;

  if (cgpa !== null) {
    steps.push(`Cumulative Weighted Sum: ${totalWeightedSgpa.toFixed(2)} / Total Credits: ${totalSemCredits} = ${cgpa.toFixed(2)}`);
  }

  return {
    cgpa,
    totalAttemptedCredits: totalSemCredits,
    totalEarnedCredits,
    semesterSummaries,
    steps,
  };
}

/**
 * Calculates all overall academic performance metrics across records
 */
export function calculateAllMetrics(
  subjects: SubjectRecord[],
  currentSemester: number = 5
): AcademicMetrics {
  const currentSemSubjects = subjects.filter((s) => s.semester === currentSemester);
  const currentSemCalc = calculateSGPA(currentSemSubjects);
  const cgpaCalc = calculateCGPA(subjects);

  // Attention subjects: failed, pending, grade <= C or marks < 50
  const attentionSubjects = subjects.filter((s) => {
    if (s.resultStatus === 'Failed' || s.resultStatus === 'Pending' || s.resultStatus === 'Incomplete') return true;
    if (s.grade === 'C' || s.grade === 'P' || s.grade === 'F') return true;
    if (s.totalMarks !== null && s.maxMarks > 0 && (s.totalMarks / s.maxMarks) < 0.55) return true;
    return false;
  });

  const totalPassed = subjects.filter((s) => s.resultStatus === 'Passed').length;

  return {
    currentSgpa: currentSemCalc.sgpa,
    cgpa: cgpaCalc.cgpa,
    totalEarnedCredits: cgpaCalc.totalEarnedCredits,
    totalAttemptedCredits: cgpaCalc.totalAttemptedCredits,
    totalPassedSubjects: totalPassed,
    attentionCount: attentionSubjects.length,
    semesterSummaries: cgpaCalc.semesterSummaries,
  };
}

/**
 * Converts percentage/marks to grade and grade point using provided scale
 */
export function getGradeFromMarks(
  totalMarks: number,
  maxMarks: number = 100,
  scale: GradingScaleItem[] = STANDARD_GRADING_SYSTEM.scale
): { grade: string; gradePoints: number; description: string } {
  const percentage = (totalMarks / maxMarks) * 100;
  for (const item of scale) {
    if (percentage >= item.minMarks && percentage <= item.maxMarks) {
      return { grade: item.grade, gradePoints: item.gradePoints, description: item.description };
    }
  }
  return { grade: 'F', gradePoints: 0, description: 'Fail' };
}
