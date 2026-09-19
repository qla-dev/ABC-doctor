import { Skill } from './types';
import { medicalTutorSkill } from './definitions/medicalTutorSkill';
import { quizGeneratorSkill } from './definitions/quizGeneratorSkill';
import { flashcardGeneratorSkill } from './definitions/flashcardGeneratorSkill';
import { clinicalCaseSkill } from './definitions/clinicalCaseSkill';
import { examCoachSkill } from './definitions/examCoachSkill';
import { triageSkill } from './definitions/triageSkill';
import { patientSimulatorSkill } from './definitions/patientSimulatorSkill';

export class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, Skill> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  public static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  private registerDefaults(): void {
    this.register(medicalTutorSkill);
    this.register(quizGeneratorSkill);
    this.register(flashcardGeneratorSkill);
    this.register(clinicalCaseSkill);
    this.register(examCoachSkill);
    this.register(triageSkill);
    this.register(patientSimulatorSkill);
  }

  public register(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  public getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  public getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  public findBestSkillForPrompt(userPrompt: string): Skill {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('quiz') || lower.includes('question') || lower.includes('test me') || lower.includes('vignette')) {
      return this.skills.get('quiz_generator') || medicalTutorSkill;
    }
    if (lower.includes('flashcard') || lower.includes('anki') || lower.includes('cards') || lower.includes('recall')) {
      return this.skills.get('flashcard_generator') || medicalTutorSkill;
    }
    if (lower.includes('case') || lower.includes('bedside') || lower.includes('encounter') || lower.includes('patient presentation')) {
      return this.skills.get('clinical_case') || medicalTutorSkill;
    }
    if (lower.includes('exam') || lower.includes('osce') || lower.includes('oral') || lower.includes('boards') || lower.includes('pimp')) {
      return this.skills.get('exam_coach') || medicalTutorSkill;
    }
    if (lower.includes('triage') || lower.includes('acuity') || lower.includes('urgency') || lower.includes('red flag')) {
      return this.skills.get('triage') || medicalTutorSkill;
    }
    if (lower.includes('simulator') || lower.includes('simulate') || lower.includes('virtual patient')) {
      return this.skills.get('patient_simulator') || medicalTutorSkill;
    }

    return medicalTutorSkill;
  }
}

export const SKILL_METADATA = [
  { id: 'medical_tutor', title: 'Medical Tutor' },
  { id: 'quiz_generator', title: 'Quiz Generator' },
  { id: 'flashcard_generator', title: 'Flashcard Gen' },
  { id: 'clinical_case', title: 'Clinical Case' },
  { id: 'exam_coach', title: 'Exam Coach' },
  { id: 'triage', title: 'Triage Assistant' },
  { id: 'patient_simulator', title: 'Virtual Patient' }
];
