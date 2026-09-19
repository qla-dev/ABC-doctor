import { SkillRegistry } from '../skills/SkillRegistry';
import { SkillContext, SkillExecutionResult, ChatMessage } from '../skills/types';
import { Topic, QuizQuestion, PatientCase, TriageScenario } from '../types';

export class AIService {
  private static registry = SkillRegistry.getInstance();

  public static async executeMessage(
    messageText: string,
    skillId?: string,
    context?: SkillContext
  ): Promise<{ response: SkillExecutionResult; skillUsed: string; skillName: string }> {
    let skill = skillId ? this.registry.getSkill(skillId) : undefined;

    if (!skill) {
      skill = this.registry.findBestSkillForPrompt(messageText);
    }

    // Small realistic latency for tactile native feeling
    await new Promise(res => setTimeout(res, 450));

    const response = await skill.generateResponse(messageText, context);

    return {
      response,
      skillUsed: skill.id,
      skillName: skill.name
    };
  }

  public static async generateResponse(
    messageText: string,
    skillId?: string,
    context?: SkillContext
  ): Promise<SkillExecutionResult> {
    const res = await this.executeMessage(messageText, skillId, context);
    return res.response;
  }

  public static getAvailableSkills() {
    return this.registry.getAllSkills();
  }

  public static createTutorPromptForAction(
    actionType: 'explain_simply' | 'explain_depth' | 'quiz_me' | 'create_flashcards' | 'clinical_case' | 'summarize' | 'oral_exam' | 'compare',
    topic: Topic
  ): { prompt: string; skillId: string } {
    switch (actionType) {
      case 'explain_simply':
        return {
          prompt: `Explain ${topic.title} simply using a memorable physiological analogy suitable for first-year medical students.`,
          skillId: 'medical_tutor'
        };
      case 'explain_depth':
        return {
          prompt: `Give a comprehensive cellular, receptor-level, and pathophysiological explanation of ${topic.title}.`,
          skillId: 'medical_tutor'
        };
      case 'quiz_me':
        return {
          prompt: `Generate a high-yield clinical board question on ${topic.title} with full explanation.`,
          skillId: 'quiz_generator'
        };
      case 'create_flashcards':
        return {
          prompt: `Generate 3 high-yield active recall flashcards for ${topic.title}.`,
          skillId: 'flashcard_generator'
        };
      case 'clinical_case':
        return {
          prompt: `Walk me through an emergency bedside clinical encounter presenting with ${topic.title}.`,
          skillId: 'clinical_case'
        };
      case 'summarize':
        return {
          prompt: `Provide a high-yield 60-second board review summary of ${topic.title} with diagnostic criteria and first-line treatment.`,
          skillId: 'medical_tutor'
        };
      case 'oral_exam':
        return {
          prompt: `Simulate an oral exam attending asking me pointed questions about the management of ${topic.title}.`,
          skillId: 'exam_coach'
        };
      case 'compare':
        return {
          prompt: `Compare ${topic.title} with its most dangerous clinical mimics and highlight key distinguishing features.`,
          skillId: 'medical_tutor'
        };
    }
  }
}
