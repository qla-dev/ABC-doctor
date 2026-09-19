import { Skill, SkillContext, SkillExecutionResult } from '../types';
import { PromptBuilder } from '../PromptBuilder';

export const medicalTutorSkill: Skill = {
  id: 'medical_tutor',
  name: 'Medical Tutor',
  description: 'Pathophysiology, pharmacology, mechanisms, and clinical reasoning guidance.',
  iconName: 'GraduationCap',
  badge: 'Core Tutor',
  markdownDoc: '/skills/medical_tutor.md',
  systemInstructions: `You are Dr. Mentor, an enthusiastic, rigorous clinical professor for medical students.
Explain disease mechanisms with crystal-clear pathophysiology, diagnostic algorithms, and practical clinical pearls.
Always provide structured headings, memorable analogies when appropriate, and high-yield board correlations.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const prompt = new PromptBuilder(this.systemInstructions)
      .addContext(context)
      .build(userMessage);

    const topicTitle = context?.currentTopic?.title || 'Clinical Medicine';
    const lower = userMessage.toLowerCase();

    // Context-sensitive intelligent mock response that feels like a senior attending physician teaching
    if (lower.includes('simply') || lower.includes('simple') || lower.includes('analogy')) {
      return {
        markdownContent: `### Intuitive Breakdown: ${topicTitle}

Think of this condition through an everyday mechanical analogy:

> **The Highway & Plumbing Analogy**:
> Imagine a high-pressure municipal plumbing system. When resistance downstream increases or the pump's mechanical seals fail, fluid backs up behind the blockage while forward output crashes.

#### Key Mechanism in 3 Steps:
1. **The Insult**: Sudden ischemia, microvascular thrombosis, or cellular inflammatory cascade disrupts mitochondrial ATP synthesis.
2. **The Back-Pressure**: Cells lose sodium-potassium ATPase pump activity, leading to intracellular edema, membrane rupture, and release of intracellular biomarkers.
3. **The Clinical Consequence**: End-organ hypoperfusion (hypotension, altered mental status, oliguria) accompanied by systemic compensatory sympathetic activation (tachycardia, diaphoresis).

*Remember: In acute decompensation, always stabilize airway, breathing, and circulation before chasing esoteric etiology!*`,
        clinicalPearl: `“If the pump fails, pressure builds behind it and delivery falls ahead of it.” Always evaluate right-sided vs. left-sided congestion signs early.`,
        suggestedActions: [
          { id: '1', label: 'Explain in depth', promptToRun: 'Now explain the detailed molecular and cellular mechanism in depth' },
          { id: '2', label: 'Quiz me on this', promptToRun: `Quiz me on high-yield board facts about ${topicTitle}` },
          { id: '3', label: 'Generate Flashcards', promptToRun: `Create 3 active recall flashcards for ${topicTitle}` }
        ]
      };
    }

    if (lower.includes('depth') || lower.includes('deep') || lower.includes('pathophysiology') || lower.includes('molecular')) {
      return {
        markdownContent: `### Deep Cellular Pathophysiology: ${topicTitle}

#### 1. Molecular Cascade & Receptor Level
- **Ischemic Phase / Receptor Trigger**: Within 60 seconds of severe hypoperfusion, oxidative phosphorylation ceases. Glycolysis generates lactic acid, dropping intracellular pH (<6.8).
- **Calcium Dysregulation**: Sodium-calcium exchangers fail. Cytosolic $\\text{Ca}^{2+}$ overload triggers mitochondrial permeability transition pores (mPTP), releasing **Cytochrome c** and initiating caspase-9/caspase-3 apoptosis.
- **Microvascular Remodeling**: Endothelial cell swelling and microthrombi create the **"no-reflow" phenomenon** even after macrovascular recanalization.

#### 2. Diagnostic & Laboratory Correlates
- **Peak Kinetics**: Look for early troponin rise within 2–4 hours (peaking at 18–24h) or creatinine kinase-MB for re-infarction within 48–72h.
- **Electrocardiographic Vector**: Reciprocal ST-depression (e.g., in leads II, III, aVF during anterior STEMI) represents opposite ischemic dipoles.

#### 3. Therapeutic Targets
- **Antiplatelet Synergy**: Dual antiplatelet therapy (Aspirin COX-1 inhibition + P2Y12 receptor blockade like Ticagrelor/Clopidogrel) blocks complementary pathways of platelet activation.`,
        clinicalPearl: `Troponin I and T can remain elevated for 10-14 days. If re-infarction is suspected after 3-4 days, check CK-MB kinetics!`,
        suggestedActions: [
          { id: '1', label: 'Compare with differential', promptToRun: `What are the top 3 deadly mimics of ${topicTitle}?` },
          { id: '2', label: 'Case vignette test', promptToRun: `Give me a realistic USMLE Step 2 clinical case vignette on this` }
        ]
      };
    }

    if (lower.includes('compare') || lower.includes('versus') || lower.includes('diff')) {
      return {
        markdownContent: `### Differential Diagnosis & Comparison

| Feature | ${topicTitle} | Dangerous Mimic A | Benign Mimic B |
| :--- | :--- | :--- | :--- |
| **Onset** | Sudden, progressive (<2h) | Tearing, instantaneous | Positional, pleuritic |
| **ECG** | Regional ST elevation | Normal or non-specific | Diffuse ST elevation + PR depression |
| **Biomarkers** | Elevated Troponin / CK-MB | D-dimer / Mediastinal widening | Normal or mild pericardial enzymes |
| **Immediate Rx** | PCI / Heparin / Antiplatelets | Emergent CT Angiogram / Surgery | NSAIDs / Colchicine |

*Key discriminator: Always check bilateral blood pressures and peripheral pulses to rule out acute aortic dissection before aggressive anticoagulation!*`,
        clinicalPearl: `Never administer anticoagulants for suspected ACS until aortic dissection is confidently excluded by history and bilateral pulse exam!`,
        suggestedActions: [
          { id: '1', label: 'Test my knowledge', promptToRun: `Give me a 3-question mini-quiz on distinguishing these conditions` }
        ]
      };
    }

    // Default tutoring response
    return {
      markdownContent: `### Clinical Analysis: ${topicTitle}

Hello Doctor! Here is the high-yield clinical perspective on **${topicTitle}**:

#### 1. Core Clinical Presentation
- Classic presentation features acute onset symptoms with characteristic radiation and autonomic signs.
- **Risk Stratification**: Always assess age, hemodynamic stability, oxygenation saturation, and cardiac risk factors.

#### 2. First-Line Workup Algorithm
- **Immediate (0–10 min)**: 12-lead ECG, continuous telemetry, IV access, focused cardiopulmonary exam.
- **Urgent Labs**: High-sensitivity cardiac troponins, comprehensive metabolic panel, complete blood count, coagulation profile.
- **Bedside Ultrasound (POCUS)**: Rule out wall motion abnormalities, pericardial effusion, and right ventricular strain.

#### 3. High-Yield Board Trap
*Pay careful attention to atypical presentations in elderly, female, and diabetic patients who often present with isolated dyspnea, nausea, or painless syncope.*`,
      clinicalPearl: `“Anginal equivalent”: In elderly or diabetic patients, unexplained diaphoresis or acute shortness of breath without chest pain warrants immediate ECG!`,
      suggestedActions: [
        { id: '1', label: 'Explain simply', promptToRun: 'Explain the mechanism simply with an analogy' },
        { id: '2', label: 'Explain in depth', promptToRun: 'Give me the deep molecular and pathophysiologic mechanisms' },
        { id: '3', label: 'Launch Patient Case', promptToRun: `Create a patient simulator scenario for ${topicTitle}` }
      ]
    };
  }
};
