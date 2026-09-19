import { Skill, SkillContext, SkillExecutionResult } from '../types';

export const flashcardGeneratorSkill: Skill = {
  id: 'flashcard_generator',
  name: 'Flashcard Generator',
  description: 'Creates targeted active recall cards with clinical mnemonics.',
  iconName: 'Layers',
  badge: 'Retention',
  markdownDoc: '/skills/flashcard_generator.md',
  systemInstructions: `Generate atomic active recall flashcard pairs (Front & Back) optimized for spaced repetition algorithms.`,

  async generateResponse(userMessage: string, context?: SkillContext): Promise<SkillExecutionResult> {
    const topic = context?.currentTopic?.title || 'Emergency Medicine';

    return {
      markdownContent: `### Generated Active Recall Cards for ${topic}

I have synthesized **3 high-yield active recall flashcards** for your study deck:

---

#### 📇 Card 1
- **Front**: What is the definitive initial medication regimen administered to patients presenting with acute STEMI before the catheterization lab?
- **Back**: 
  1. Chewable Aspirin (162–325 mg)
  2. P2Y12 inhibitor loading dose (Ticagrelor 180 mg or Clopidogrel 600 mg)
  3. Anticoagulation (Unfractionated Heparin bolus + infusion)
  4. Sublingual Nitroglycerin (unless RV infarction or recent PDE-5 inhibitor use!)
  5. High-intensity Statin (Atorvastatin 80 mg)

---

#### 📇 Card 2
- **Front**: Why is Nitroglycerin strictly contraindicated in Right Ventricular (RV) myocardial infarction?
- **Back**: RV infarction causes severe preload dependence. Nitroglycerin causes potent venodilation, precipitously dropping preload and inducing catastrophic refractory hypotension.

---

#### 📇 Card 3
- **Front**: What diagnostic triad characterizes cardiac tamponade (Beck's Triad)?
- **Back**: 
  1. Hypotension
  2. Distended jugular veins (JVD)
  3. Muffled heart sounds
  *(Plus Pulsus Paradoxus >10 mmHg drop in SBP during inspiration)*`,
      clinicalPearl: `“MONA” has been replaced in modern guidelines: Oxygen is ONLY indicated if $\\text{SpO}_2 < 90\\%$. Routine hyperoxia causes coronary vasoconstriction!`,
      suggestedActions: [
        { id: '1', label: 'Review Flashcards', promptToRun: 'Open flashcards tab to start spaced repetition' },
        { id: '2', label: 'More cards on pharmacology', promptToRun: `Generate 3 more cards specifically focusing on ${topic} pharmacology` }
      ]
    };
  }
};
