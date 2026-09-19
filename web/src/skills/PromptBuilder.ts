import { SkillContext } from './types';

export class PromptBuilder {
  private basePrompt: string = '';
  private contextLines: string[] = [];
  private constraints: string[] = [];

  constructor(systemRole: string) {
    this.basePrompt = systemRole;
    this.constraints.push('You are ABC Doktori AI, an educational clinical tutor for medical students.');
    this.constraints.push('Never diagnose real patients. Always maintain strict medical education boundaries.');
    this.constraints.push('Use structured, readable medical formatting: bullet points, pathophysiologic reasoning, high-yield clinical pearls, and diagnostic algorithms.');
  }

  public addContext(context?: SkillContext): this {
    if (!context) return this;

    if (context.currentTopic) {
      this.contextLines.push(`[Active Medical Topic]: ${context.currentTopic.title} (${context.currentTopic.category})`);
      this.contextLines.push(`[Topic Summary]: ${context.currentTopic.overview}`);
      this.contextLines.push(`[Clinical Presentation]: ${context.currentTopic.clinicalPresentation.symptoms.join(', ')}`);
    }

    if (context.currentQuestion) {
      this.contextLines.push(`[Active Quiz Vignette]: ${context.currentQuestion.vignette}`);
      this.contextLines.push(`[Question Prompt]: ${context.currentQuestion.question}`);
      const correctOption = context.currentQuestion.options.find(o => o.isCorrect);
      if (correctOption) {
        this.contextLines.push(`[Correct Answer]: ${correctOption.text}`);
        this.contextLines.push(`[Explanation]: ${correctOption.explanation}`);
      }
    }

    if (context.patientCase) {
      this.contextLines.push(`[Simulation Case]: ${context.patientCase.patientName}, ${context.patientCase.age}${context.patientCase.gender} - Chief Complaint: ${context.patientCase.chiefComplaint}`);
      this.contextLines.push(`[Vitals]: HR ${context.patientCase.vitals.hr} bpm, BP ${context.patientCase.vitals.bp}, SpO2 ${context.patientCase.vitals.spo2}`);
    }

    if (context.triageScenario) {
      this.contextLines.push(`[Triage Presenting Complaint]: ${context.triageScenario.complaintName}`);
    }

    if (context.selectedText) {
      this.contextLines.push(`[Highlighted Text]: "${context.selectedText}"`);
    }

    return this;
  }

  public addInstruction(instruction: string): this {
    this.constraints.push(instruction);
    return this;
  }

  public build(userMessage: string): string {
    const parts = [
      `### ROLE & INSTRUCTIONS\n${this.basePrompt}`,
      `### CONSTRAINTS\n${this.constraints.map(c => `- ${c}`).join('\n')}`
    ];

    if (this.contextLines.length > 0) {
      parts.push(`### CLINICAL CONTEXT\n${this.contextLines.join('\n')}`);
    }

    parts.push(`### USER QUERY\n${userMessage}`);

    return parts.join('\n\n');
  }
}
