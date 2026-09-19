import { Topic, QuizQuestion, PatientCase, TriageScenario } from '../types';

export interface SkillContext {
  currentTopic?: Topic;
  currentQuestion?: QuizQuestion;
  patientCase?: PatientCase;
  triageScenario?: TriageScenario;
  selectedText?: string;
  userLevel?: 'pre-clinical' | 'clinical' | 'intern' | 'resident';
  mode?: string;
  activeSystem?: string;
}

export interface SkillActionSuggestion {
  id: string;
  label: string;
  description?: string;
  promptToRun?: string;
  targetTab?: string;
}

export interface SkillExecutionResult {
  markdownContent: string;
  suggestedActions?: SkillActionSuggestion[];
  clinicalPearl?: string;
  keyTakeaways?: string[];
  referenceLinks?: { title: string; topicId?: string }[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badge: string;
  markdownDoc: string; // The conceptual .md template representation
  systemInstructions: string;
  generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  skillId?: string;
  skillName?: string;
  text: string;
  timestamp: string;
  clinicalPearl?: string;
  suggestedActions?: SkillActionSuggestion[];
  contextTopicTitle?: string;
}
