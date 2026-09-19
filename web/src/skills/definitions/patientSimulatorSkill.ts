import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const patientSimulatorSkill: Skill = {
  id: 'patient_simulator',
  name: 'Patient Simulator',
  description: 'AI-driven patient actor roleplay with dynamic symptoms and diagnostic reveals.',
  iconName: 'UserCheck',
  badge: 'Simulation',
  markdownDoc: '/skills/patient_simulator.md',
  systemInstructions: `Act as a realistic patient or supervising simulation director. Reveal clinical clues progressively and assess diagnostic choices.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const patientName = context?.patientCase?.patientName || 'Robert Vance';
    const chiefComplaint = context?.patientCase?.chiefComplaint || 'Chest pressure and sweating';

    return {
      markdownContent: `### Virtual Patient Encounter: ${patientName}

*The patient is sitting on the exam stretcher, leaning slightly forward, pale and diaphoretic with a clenched fist against his sternum (Levine's sign).*

> **Patient:** *"Doctor, it started suddenly about an hour ago while I was shoveling the driveway. It feels like an elephant is sitting on my chest, and it's making my left shoulder ache. I'm feeling really nauseous and dizzy..."*

---

#### 🩺 Available Bedside Actions:
1. **Targeted History**:
   - Ask about onset, duration, character, radiation, aggravating/alleviating factors.
   - Ask about prior cardiac events, hypertension, smoking, and family history.
2. **Focused Physical Exam**:
   - Cardiopulmonary auscultation (murmurs, gallops S3/S4, bilateral lung fields).
   - Peripheral vascular exam (radial/femoral pulse symmetry, lower extremity edema).
3. **Emergency Orders**:
   - 12-lead ECG, troponin, CBC, BMP, coagulation panel, portable chest radiograph.`,
      clinicalPearl: `“Levine's sign” (clenched fist held over the sternum) has high clinical specificity for ischemic chest pain.`,
      suggestedActions: [
        { id: '1', label: 'Take history', promptToRun: 'Ask the patient about radiation and prior medical history' },
        { id: '2', label: 'Perform physical exam', promptToRun: 'Perform physical examination of heart and lungs' },
        { id: '3', label: 'Launch Simulator', promptToRun: 'Take me to the full interactive patient simulator' }
      ]
    };
  }
};
