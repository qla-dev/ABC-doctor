import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const quizGeneratorSkill: Skill = {
  id: 'quiz_generator',
  name: 'Quiz Generator',
  description: 'Generates USMLE-style vignettes, questions, and distractor breakdowns.',
  iconName: 'HelpCircle',
  badge: 'Assessment',
  markdownDoc: '/skills/quiz_generator.md',
  systemInstructions: `You generate authentic medical board multiple choice questions with rich clinical vignettes, answer explanations, and distractor rationales.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const topicTitle = context?.currentTopic?.title || 'Cardiology';

    return {
      markdownContent: `### Custom Clinical Question Generated: ${topicTitle}

**Clinical Vignette:**
A 58-year-old male with a history of hypertension, poorly controlled type 2 diabetes mellitus, and a 30 pack-year smoking history presents to the emergency department with 2 hours of substernal, crushing chest pressure radiating to his left jaw and ulnar aspect of his left arm. He is noticeably diaphoretic and dyspneic. 
Vital signs: Blood pressure 162/98 mmHg, Heart rate 104 bpm, Respiratory rate 22/min, Oxygen saturation 94% on room air. 
ECG demonstrates 3 mm ST-segment elevations in leads V1–V4 with reciprocal ST-depressions in leads II, III, and aVF.

**Question:**
Which of the following coronary arteries is most likely occluded, and what is the primary initial reperfusion target time (door-to-balloon)?

- **[A]** Right coronary artery (RCA); < 120 minutes
- **[B]** Left anterior descending artery (LAD); < 90 minutes *(Correct Answer)*
- **[C]** Left circumflex artery (LCx); < 60 minutes
- **[D]** Posterior descending artery (PDA); < 180 minutes

---

#### Detailed Answer Breakdown:
- **Option B is Correct**: Leads V1–V4 correspond to the anterior and anteroseptal myocardial walls, which are supplied primarily by the **Left Anterior Descending (LAD) artery** ("the widowmaker"). According to ACC/AHA guidelines, primary Percutaneous Coronary Intervention (PCI) should achieve a **door-to-balloon time of < 90 minutes** at a PCI-capable facility.
- **Why Option A is Incorrect**: The RCA typically supplies the inferior wall (leads II, III, aVF) and posterior wall.
- **Why Option C is Incorrect**: LCx occlusion typically yields lateral wall changes (leads I, aVL, V5, V6).
- **Why Option D is Incorrect**: The PDA supplies the posterior and inferior base, typically causing inferior or true posterior MI (reciprocal horizontal ST depressions in V1-V2).`,
      clinicalPearl: `STEMI door-to-balloon benchmark: ≤90 minutes in PCI-capable centers; door-to-needle (thrombolytic) benchmark: ≤30 minutes if PCI transfer takes >120 min.`,
      suggestedActions: [
        { id: '1', label: 'Take full quiz', promptToRun: 'Take me to the interactive quiz section' },
        { id: '2', label: 'Generate another question', promptToRun: `Generate another hard vignette question on ${topicTitle}` },
        { id: '3', label: 'Explain the anatomy', promptToRun: 'Show coronary artery anatomy and ECG lead mapping' }
      ]
    };
  }
};
