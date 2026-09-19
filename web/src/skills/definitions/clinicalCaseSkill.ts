import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const clinicalCaseSkill: Skill = {
  id: 'clinical_case',
  name: 'Clinical Case',
  description: 'Simulates interactive bedside patient rounds with progressive diagnostic challenges.',
  iconName: 'Stethoscope',
  badge: 'Bedside',
  markdownDoc: '/skills/clinical_case.md',
  systemInstructions: `Facilitate realistic patient bedside scenarios. Challenge the student's clinical judgment at each step.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const topic = context?.currentTopic?.title || 'Acute Abdomen';

    return {
      markdownContent: `### Bedside Clinical Encounter: The Case of "Sarah Jenkins", 24F

**Chief Complaint**: "Severe lower abdominal pain that moved to my right side over the last 12 hours."

#### Step 1: Initial Presentation & Triage
- **Age/Sex**: 24-year-old female, previously healthy.
- **Triage Vitals**: BP 118/74 mmHg, HR 102 bpm, Temp 38.2°C (100.8°F), RR 18/min, SpO2 99% on RA.
- **Pain Score**: 8/10, sharp, aggravated by walking or coughing.
- **Associated**: Anorexia ("hamburger sign" positive - no appetite all day), 2 episodes of non-bilious vomiting.

#### Step 2: Bedside Physical Exam
- **Abdomen**: Distinct tenderness at **McBurney's point** (1/3 the distance from ASIS to umbilicus).
- **Rovsing's Sign**: Positive (palpation of LLQ causes pain in RLQ).
- **Psoas Sign**: Positive (pain on passive right hip extension).
- **Obturator Sign**: Mildly positive (internal rotation of flexed right hip).

---

#### ❓ Attending Physician's Question:
*“Doctor, before we jump to an abdominal CT, what non-negotiable laboratory test must you obtain in every female of reproductive age presenting with acute lower abdominal pain?”*

**Answer**: A **Urine or Serum $\\beta$-hCG** test to immediately rule out an **ectopic pregnancy**, which can present identically and is an immediately life-threatening obstetric emergency!`,
      clinicalPearl: `“Never let the sun set or rise on a suspected appendicitis or appendectomy decision without a confirmed pregnancy test in females of childbearing age.”`,
      suggestedActions: [
        { id: '1', label: 'Order Ultrasound', promptToRun: 'What would a positive pelvic ultrasound or appendix ultrasound show?' },
        { id: '2', label: 'Open Patient Simulator', promptToRun: 'Let me run a full interactive patient case simulation' }
      ]
    };
  }
};
