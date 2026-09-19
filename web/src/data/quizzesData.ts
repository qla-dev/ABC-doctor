import { QuizQuestion } from '../types';

export const QUIZZES_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    topicId: 'ami',
    topicTitle: 'Acute Myocardial Infarction',
    category: 'Cardiology',
    difficulty: 'hard',
    vignette: 'A 61-year-old male with a history of tobacco use and diabetes presents to the ED with 90 minutes of acute crushing substernal chest pain. Blood pressure is 88/56 mmHg, heart rate is 52 bpm, and oxygen saturation is 96% on room air. Lungs are clear to auscultation bilaterally. Jugular venous distension is 5 cm above the sternal angle. 12-lead ECG reveals 3 mm ST elevation in leads II, III, and aVF with reciprocal ST depression in lead I and aVL. A right-sided ECG shows 2 mm ST elevation in lead V4R.',
    question: 'Which of the following is the most appropriate initial management step for this patient\'s hypotension?',
    isMultipleCorrect: false,
    highYieldPearl: 'Right ventricular infarction is preload-sensitive: treat hypotension with rapid IV crystalloids. Avoid venodilators like nitrates and diuretics!',
    options: [
      {
        id: 'opt1',
        text: 'Rapid intravenous normal saline bolus (500–1000 mL)',
        isCorrect: true,
        explanation: 'The patient has an acute inferior STEMI with right ventricular (RV) involvement (ST elevation in V4R, hypotension, clear lungs, elevated JVD). The ischemic right ventricle is severely preload-dependent. Volume loading with IV normal saline boluses optimizes RV filling and restores left ventricular preload and cardiac output.'
      },
      {
        id: 'opt2',
        text: 'Sublingual nitroglycerin 0.4 mg every 5 minutes',
        isCorrect: false,
        explanation: 'Nitroglycerin is a potent venodilator that precipitously decreases venous return and preload. In right ventricular infarction, administering nitrates can trigger catastrophic, refractory hypotension and cardiogenic shock.'
      },
      {
        id: 'opt3',
        text: 'Intravenous furosemide 40 mg bolus',
        isCorrect: false,
        explanation: 'Loop diuretics promote volume depletion and further drop RV preload in a patient who already has clear lungs and hypotension. Diuretics are contraindicated in RV infarction.'
      },
      {
        id: 'opt4',
        text: 'Immediate IV metoprolol 5 mg bolus',
        isCorrect: false,
        explanation: 'Beta-blockers are contraindicated in patients with acute cardiogenic shock, hypotension (SBP < 90), or bradycardia (HR < 60).'
      }
    ]
  },
  {
    id: 'q2',
    topicId: 'pe',
    topicTitle: 'Pulmonary Embolism',
    category: 'Emergency Medicine',
    difficulty: 'medium',
    vignette: 'A 34-year-old female who recently returned from a 14-hour international flight presents with acute pleuritic chest pain and shortness of breath. Vital signs: BP 124/82 mmHg, HR 112 bpm, RR 24/min, SpO2 93% on room air. Focused cardiac ultrasound shows a normal right ventricle without strain. Wells score calculation yields 4.5 points (PE likely). D-dimer is pending.',
    question: 'What is the most definitive gold-standard diagnostic imaging test to confirm the suspected diagnosis?',
    isMultipleCorrect: false,
    highYieldPearl: 'CT Pulmonary Angiography (CTPA) is the diagnostic test of choice for pulmonary embolism in stable patients with normal renal function.',
    options: [
      {
        id: 'opt1',
        text: 'Computed Tomography Pulmonary Angiography (CTPA)',
        isCorrect: true,
        explanation: 'CTPA is the gold-standard diagnostic imaging modality with high sensitivity and specificity for visualizing filling defects in the pulmonary arterial tree down to subsegmental branches.'
      },
      {
        id: 'opt2',
        text: 'Ventilation-Perfusion (V/Q) Lung Scan',
        isCorrect: false,
        explanation: 'V/Q scans are primarily reserved for patients with severe renal impairment (eGFR < 30), severe contrast allergy, or pregnancy with negative lower extremity dopplers.'
      },
      {
        id: 'opt3',
        text: 'Standard Posteroanterior Chest Radiograph',
        isCorrect: false,
        explanation: 'Chest X-ray is useful to exclude other causes of acute dyspnea (pneumothorax, pneumonia), but is normal or non-specifically abnormal in the majority of PE cases and cannot confirm the diagnosis.'
      },
      {
        id: 'opt4',
        text: 'Transthoracic Echocardiography',
        isCorrect: false,
        explanation: 'Echocardiography assesses for RV strain or McConnell\'s sign in unstable patients, but lacks sensitivity to rule out submassive or low-risk PE.'
      }
    ]
  },
  {
    id: 'q3',
    topicId: 'heart_failure',
    topicTitle: 'Congestive Heart Failure',
    category: 'Cardiology',
    difficulty: 'hard',
    vignette: 'A 68-year-old female with newly diagnosed HFrEF (ejection fraction 32%) is being initiated on guideline-directed medical therapy (GDMT). She is currently on low-dose lisinopril and furosemide. Her serum creatinine is 1.1 mg/dL, and potassium is 4.4 mEq/L. Blood pressure is 128/78 mmHg, HR is 76 bpm.',
    question: 'Which of the following drug classes have proven all-cause mortality reduction in patients with HFrEF? (Select all that apply)',
    isMultipleCorrect: true,
    highYieldPearl: 'The "Four Pillars" of HFrEF mortality reduction: ARNI/ACEi/ARB, Evidence-based Beta-blockers, Mineralocorticoid Receptor Antagonists, and SGLT2 inhibitors.',
    options: [
      {
        id: 'opt1',
        text: 'Angiotensin Receptor-Neprilysin Inhibitor (Sacubitril/Valsartan)',
        isCorrect: true,
        explanation: 'ARNIs demonstrated a 20% reduction in cardiovascular death and HF hospitalization compared to enalapril in the landmark PARADIGM-HF trial.'
      },
      {
        id: 'opt2',
        text: 'Evidence-based Beta-blockers (e.g. Carvedilol, Metoprolol succinate)',
        isCorrect: true,
        explanation: 'Beta-blockers block chronic sympathetic adrenergic toxicity, reverse adverse LV remodeling, and significantly decrease sudden cardiac death.'
      },
      {
        id: 'opt3',
        text: 'Sodium-Glucose Cotransporter-2 (SGLT2) Inhibitors (e.g. Dapagliflozin)',
        isCorrect: true,
        explanation: 'SGLT2 inhibitors significantly reduce cardiovascular death and heart failure worsening in HFrEF regardless of whether the patient has type 2 diabetes.'
      },
      {
        id: 'opt4',
        text: 'Loop Diuretics (Furosemide)',
        isCorrect: false,
        explanation: 'Loop diuretics are critical for symptomatic relief of congestion and fluid overload, but have NOT been demonstrated in randomized trials to reduce long-term all-cause mortality.'
      }
    ]
  },
  {
    id: 'q4',
    topicId: 'stroke',
    topicTitle: 'Acute Ischemic Stroke',
    category: 'Neurology',
    difficulty: 'medium',
    vignette: 'A 72-year-old woman is brought to the ED by ambulance. Her family states she was completely normal eating breakfast at 7:30 AM, but at 9:00 AM she developed acute right-sided facial weakness and difficulty speaking. She arrives at 9:45 AM. Non-contrast head CT reveals no evidence of hemorrhage or early ischemic changes. Fingerstick glucose is 118 mg/dL. Blood pressure is 172/96 mmHg. NIHSS is 11.',
    question: 'Assuming no other contraindications exist, which of the following is the next most appropriate step in management?',
    isMultipleCorrect: false,
    highYieldPearl: 'Intravenous thrombolytic therapy (Alteplase or Tenecteplase) is indicated for acute ischemic stroke within 4.5 hours of symptom onset once intracranial hemorrhage is excluded.',
    options: [
      {
        id: 'opt1',
        text: 'Administer intravenous thrombolysis (Tenecteplase or Alteplase)',
        isCorrect: true,
        explanation: 'The patient presents within the 4.5-hour therapeutic window (symptom onset ~2 hours prior). CT has excluded intracranial hemorrhage, blood pressure is below the 185/110 mmHg threshold, and blood glucose is normal. IV thrombolysis should be initiated without delay.'
      },
      {
        id: 'opt2',
        text: 'Administer oral aspirin 325 mg immediately',
        isCorrect: false,
        explanation: 'If a patient is a candidate for IV thrombolysis, antiplatelet and anticoagulant agents are held for 24 hours after thrombolytic administration until a repeat CT confirms absence of hemorrhagic transformation.'
      },
      {
        id: 'opt3',
        text: 'Lower blood pressure aggressively to < 120/80 mmHg with IV nitroprusside',
        isCorrect: false,
        explanation: 'Aggressive BP reduction precipitates severe hypoperfusion of the ischemic penumbra. In candidates for thrombolysis, BP is maintained < 185/110 mmHg, not aggressively normalized.'
      },
      {
        id: 'opt4',
        text: 'Wait for brain MRI diffusion-weighted imaging before making treatment decisions',
        isCorrect: false,
        explanation: 'A normal non-contrast CT is expected in early acute ischemic stroke and is sufficient to rule out hemorrhage. Waiting for an MRI causes irreversible loss of cerebral penumbra ("time is brain").'
      }
    ]
  },
  {
    id: 'q5',
    topicId: 'appendicitis',
    topicTitle: 'Acute Appendicitis',
    category: 'Surgery',
    difficulty: 'easy',
    vignette: 'A 19-year-old male college student presents with 18 hours of abdominal pain that began periumbilically and migrated to the right lower quadrant. He has not eaten since yesterday morning. On examination, he is exquisitely tender over McBurney\'s point with localized peritoneal guarding. Palpation of the left lower quadrant causes sharp pain in the right lower quadrant.',
    question: 'What is the specific eponym for pain experienced in the right lower quadrant during deep palpation of the left lower quadrant?',
    isMultipleCorrect: false,
    highYieldPearl: 'Rovsing\'s sign: Deep pressure in the LLQ pushes peritoneal fluid and colonic gas toward the cecum, stretching the inflamed RLQ peritoneum.',
    options: [
      {
        id: 'opt1',
        text: 'Rovsing\'s sign',
        isCorrect: true,
        explanation: 'Rovsing\'s sign is defined as referred pain in the right lower quadrant upon palpation of the left lower quadrant, reflecting localized peritoneal irritation in the right iliac fossa.'
      },
      {
        id: 'opt2',
        text: 'Murphy\'s sign',
        isCorrect: false,
        explanation: 'Murphy\'s sign is inspiratory arrest during deep palpation of the right upper quadrant, characteristic of acute cholecystitis.'
      },
      {
        id: 'opt3',
        text: 'Psoas sign',
        isCorrect: false,
        explanation: 'Psoas sign is right lower quadrant pain provoked by passive extension of the right hip, indicating retrocecal appendiceal inflammation abutting the iliopsoas muscle.'
      },
      {
        id: 'opt4',
        text: 'Cullen\'s sign',
        isCorrect: false,
        explanation: 'Cullen\'s sign is periumbilical ecchymosis indicating retroperitoneal hemorrhage (seen in severe acute pancreatitis or ruptured ectopic pregnancy).'
      }
    ]
  },
  {
    id: 'q6',
    topicId: 't2dm',
    topicTitle: 'Type 2 Diabetes & Acute Crises',
    category: 'Internal Medicine',
    difficulty: 'hard',
    vignette: 'A 26-year-old woman with type 1 diabetes presents with nausea, vomiting, and diffuse abdominal pain. Lab results: Blood glucose 380 mg/dL, Na+ 132 mEq/L, K+ 3.1 mEq/L, HCO3- 11 mEq/L, arterial pH 7.21, serum beta-hydroxybutyrate 5.2 mmol/L. She is tachypneic with Kussmaul breathing.',
    question: 'What is the single most critical immediate action before initiating intravenous insulin infusion?',
    isMultipleCorrect: false,
    highYieldPearl: 'Never start insulin in DKA if potassium is < 3.3 mEq/L! Insulin drives potassium into cells, triggering fatal ventricular arrhythmias.',
    options: [
      {
        id: 'opt1',
        text: 'Administer IV potassium chloride and withhold insulin until K+ > 3.3 mEq/L',
        isCorrect: true,
        explanation: 'Insulin stimulates the Na+/K+ ATPase, driving potassium from extracellular fluid into cells. If insulin is started with a baseline K+ < 3.3 mEq/L, serum potassium will crash, precipitating fatal cardiac arrhythmias (ventricular fibrillation, asystole) and respiratory muscle paralysis.'
      },
      {
        id: 'opt2',
        text: 'Administer IV regular insulin bolus (0.14 units/kg) immediately',
        isCorrect: false,
        explanation: 'Starting insulin before correcting hypokalemia is a critical medical error.'
      },
      {
        id: 'opt3',
        text: 'Administer sodium bicarbonate infusion',
        isCorrect: false,
        explanation: 'Bicarbonate is not indicated unless arterial pH < 6.9; routine bicarbonate causes paradoxical CSF acidosis and worsening intracellular hypokalemia.'
      },
      {
        id: 'opt4',
        text: 'Switch IV fluids to 5% Dextrose in water',
        isCorrect: false,
        explanation: 'Dextrose is added to fluids only when plasma glucose reaches 200–250 mg/dL, not at 380 mg/dL.'
      }
    ]
  }
];

export const QUIZ_QUESTIONS_DATA = QUIZZES_DATA;
