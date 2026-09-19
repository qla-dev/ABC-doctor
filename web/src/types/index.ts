export type NavigationTab = 'home' | 'library' | 'quiz' | 'simulator' | 'ai' | 'flashcards' | 'triage' | 'progress';

export type ThemeMode = 'dark' | 'light';

export type MedicalCategory =
  | 'Anatomy'
  | 'Physiology'
  | 'Biochemistry'
  | 'Pathology'
  | 'Pharmacology'
  | 'Microbiology'
  | 'Immunology'
  | 'Internal Medicine'
  | 'Surgery'
  | 'Pediatrics'
  | 'Neurology'
  | 'Cardiology'
  | 'Dermatology'
  | 'Psychiatry'
  | 'Radiology'
  | 'Emergency Medicine';

export interface TopicSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: MedicalCategory;
  readTimeMinutes: number;
  completionPercentage: number;
  isBookmarked: boolean;
  highYieldRating: 1 | 2 | 3 | 4 | 5;
  overview: string;
  definitions: string;
  mechanisms: string;
  clinicalPresentation: {
    symptoms: string[];
    physicalSigns: string[];
    triadsOrPeculiarities?: string;
  };
  diagnosis: {
    criteria: string;
    firstLineLabs: string[];
    imagingGoldStandard: string;
  };
  treatment: {
    acuteManagement: string[];
    longTermManagement: string[];
    contraindications?: string[];
  };
  clinicalPearls: string[];
  keyPoints: string[];
  relatedTopicIds: string[];
  userNotes?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  category: MedicalCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  vignette: string;
  question: string;
  options: QuizOption[];
  isMultipleCorrect: boolean;
  highYieldPearl: string;
}

export type QuizMode = 'quick' | 'topic' | 'exam' | 'weak' | 'custom' | 'ai';

export interface QuizConfig {
  mode: QuizMode;
  topicId?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  questionCount: number;
  timeLimitMinutes?: number;
  questionType?: 'single' | 'multiple' | 'all';
}

export interface QuizResultRecord {
  id: string;
  date: string;
  mode: QuizMode;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
    isCorrect: boolean;
  }[];
}

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  deckId: string;
  topicTitle: string;
  category: MedicalCategory;
  frontPrompt: string;
  backAnswer: string;
  clinicalHint?: string;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  dueDate: string;
  isBookmarked: boolean;
  notes?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  category: MedicalCategory;
  cardCount: number;
  dueTodayCount: number;
  masteryPercentage: number;
}

export interface PatientVitals {
  hr: number;
  bp: string;
  rr: number;
  spo2: string;
  temp: string;
  gcs?: number;
}

export interface PatientHistoryClue {
  id: string;
  questionText: string;
  patientAnswer: string;
  isCritical: boolean;
  asked?: boolean;
}

export interface PatientPhysicalFinding {
  system: string;
  findings: string;
  isAbnormal: boolean;
  examined?: boolean;
}

export interface PatientInvestigation {
  id: string;
  type: 'lab' | 'imaging' | 'ecg';
  name: string;
  costOrDelay: string;
  result: string;
  referenceRange?: string;
  isCritical: boolean;
  ordered?: boolean;
}

export interface PatientManagementAction {
  id: string;
  name: string;
  category: 'immediate' | 'definitive' | 'monitoring' | 'contraindicated';
  points: number;
  feedback: string;
  selected?: boolean;
}

export interface PatientCase {
  id: string;
  title: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  triageColor: 'red' | 'orange' | 'yellow' | 'green';
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: PatientVitals;
  historyClues: PatientHistoryClue[];
  physicalExamFindings: PatientPhysicalFinding[];
  investigations: PatientInvestigation[];
  differentialOptions: string[];
  correctDiagnosis: string;
  managementActions: PatientManagementAction[];
  scoringRubric: {
    historyMaxPoints: number;
    investigationMaxPoints: number;
    diagnosisMaxPoints: number;
    managementMaxPoints: number;
  };
  teachingPoints: string[];
}

export interface SimulationResult {
  caseId: string;
  patientName: string;
  finalDiagnosisSelected: string;
  isDiagnosisCorrect: boolean;
  historyScore: number;
  investigationScore: number;
  diagnosisScore: number;
  managementScore: number;
  patientSafetyScore: number;
  totalScore: number;
  totalPossible: number;
  timeSpentSeconds: number;
  missedClues: string[];
  correctActions: string[];
  contraindicatedActionsSelected: string[];
}

export interface DoctorVsDoctorMatch {
  matchId: string;
  caseTitle: string;
  status: 'completed' | 'in_progress';
  student1: {
    name: string;
    avatarUrl: string;
    score: number;
    diagnosis: string;
    timeFormatted: string;
    investigationsOrdered: number;
  };
  student2: {
    name: string;
    avatarUrl: string;
    score: number;
    diagnosis: string;
    timeFormatted: string;
    investigationsOrdered: number;
  };
  comparisonMetrics: {
    category: string;
    student1Result: string;
    student2Result: string;
    winner: 1 | 2 | 'tie';
  }[];
}

export type TriageUrgencyCategory =
  | 'Emergency'
  | 'Urgent'
  | 'Same-day assessment'
  | 'Routine assessment'
  | 'Self-care / monitoring';

export interface TriageQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    urgencyWeight: number; // 0 to 4
  }[];
}

export interface TriageRedFlag {
  id: string;
  question: string;
  warning: string;
}

export interface TriageScenario {
  id: string;
  complaintName: string;
  iconName: string;
  description: string;
  typicalCases: string;
  basicQuestions: TriageQuestion[];
  redFlags: TriageRedFlag[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  skillId?: string;
  clinicalPearl?: string;
}

export type InvestigationResult = PatientInvestigation;
export type HistoryClue = PatientHistoryClue;
export type UrgencyCategory = TriageUrgencyCategory;

export interface UserProgressState {
  streakDays: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  topicsCompletedCount: number;
  quizAccuracyPercentage: number;
  flashcardsReviewedCount: number;
  simulationsCompletedCount: number;
  weakTopics: string[];
  examReadinessPercentage: number;
  bookmarkedTopicIds: string[];
  recentQuizResult?: {
    topic: string;
    score: number;
    date: string;
  };
}
