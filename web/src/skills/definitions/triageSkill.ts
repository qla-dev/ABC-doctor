import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const triageSkill: Skill = {
  id: 'triage',
  name: 'Triage Evaluator',
  description: 'Acuity stratification, red-flag screening, and educational emergency pathways.',
  iconName: 'AlertTriangle',
  badge: 'Acuity Training',
  markdownDoc: '/skills/triage.md',
  systemInstructions: `Educational triage decision tool. Classify acuity into Emergency, Urgent, Same-Day, Routine, or Self-Care. Detail red-flag justifications.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const complaint = context?.triageScenario?.complaintName || 'Chest Pain';

    return {
      markdownContent: `### Educational Triage Stratification: ${complaint}

> 🛡️ **Educational Simulator Disclaimer**: This module trains medical students on standardized triage guidelines (e.g., ESI / Manchester Triage). It is NOT for real-world diagnostic triage.

---

#### 🚨 Acuity Classification Matrix:
1. **Emergency (Resuscitation / Category 1–2)**:
   - **Criteria**: Hemodynamic instability (HR > 120 or < 40, SBP < 90), altered mental status, active diaphoresis with radiating discomfort, stridor, anaphylactic airway compromise.
   - **Immediate Action**: Direct to Resuscitation Bay; continuous cardiac monitoring, 2 large-bore IV lines, emergency physician at bedside.

2. **Urgent (Category 3)**:
   - **Criteria**: Severe pain (8–10/10), stable vitals, high-risk medical history (elderly, diabetic, immunocompromised), focal neurological complaints.
   - **Next Step**: Rapid provider evaluation within 30 minutes; bedside ECG within 10 minutes.

3. **Same-Day / Routine (Category 4–5)**:
   - **Criteria**: Low-risk features, chronic stable symptoms, normal vital signs, reproducible musculoskeletal chest wall tenderness.`,
      clinicalPearl: `“Never triage chest pain as musculoskeletal without a normal 12-lead ECG, regardless of age or reproducible tenderness.”`,
      suggestedActions: [
        { id: '1', label: 'Go to Triage Tool', promptToRun: 'Open the interactive triage tool to practice cases' },
        { id: '2', label: 'Red-flag checklist', promptToRun: `List the absolute red-flag signs for ${complaint}` }
      ]
    };
  }
};
