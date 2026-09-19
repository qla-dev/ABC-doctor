import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const examCoachSkill: Skill = {
  id: 'exam_coach',
  name: 'Exam Coach',
  description: 'Oral board examiner & OSCE station evaluator with strict scoring feedback.',
  iconName: 'Award',
  badge: 'Boards & OSCE',
  markdownDoc: '/skills/exam_coach.md',
  systemInstructions: `Conduct oral board examinations, pimping questions, and OSCE evaluation. Offer direct feedback on phrasing and safety.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    return {
      markdownContent: `### OSCE Station: Acute Respiratory Distress Examiner

**Examiner Prompt**:
> *"Candidate, you are in the Resuscitation Bay. A 64-year-old male arrives by EMS with severe dyspnea, cyanosis, and inability to speak in full sentences. He has a history of COPD and CHF. His vitals are BP 190/110 mmHg, HR 122 bpm, RR 34/min, SpO2 81% on room air. Auscultation reveals bilateral diffuse crackles and expiratory wheezes. You have 3 minutes to outline your immediate orders."*

---

#### 📋 Examiner Scorecard & Model Answer:
1. **Immediate Patient Positioning & Oxygenation**:
   - Sit the patient fully upright (decreases venous return to lungs).
   - Initiate Non-Invasive Positive Pressure Ventilation (**BiPAP / CPAP**) with high $\\text{FiO}_2$.
2. **Medical Decompression**:
   - Sublingual / IV **Nitroglycerin** bolus + high-dose infusion (reduces systemic vascular resistance and LV afterload immediately).
   - IV loop diuretic (**Furosemide 40–80 mg IV**).
3. **Bedside Diagnostics**:
   - Point-of-Care Ultrasound (POCUS) lung exam checking for multiple bilateral **B-lines** (pulmonary edema) vs. lung sliding (rule out pneumothorax).
   - 12-lead ECG (evaluate for concurrent ischemic trigger / NSTEMI).

#### ⚠️ Critical Safety Failures:
- *Giving beta-blockers acutely during decompensated pulmonary edema.*
- *Intubating prematurely before a trial of NIPPV (unless GCS < 8 or respiratory arrest).*`,
      clinicalPearl: `In acute hypertensive cardiogenic pulmonary edema (SCAPE), IV Nitroglycerin titration is the true lifesaver, not just waiting for Lasix diuresis!`,
      suggestedActions: [
        { id: '1', label: 'Ask follow-up question', promptToRun: 'What if his blood pressure was 85/50 instead of 190/110?' },
        { id: '2', label: 'Evaluate my response', promptToRun: 'Give me another challenging oral board scenario' }
      ]
    };
  }
};
