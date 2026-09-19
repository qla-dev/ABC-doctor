import { TriageScenario } from '../types';

export const TRIAGE_SCENARIOS_DATA: TriageScenario[] = [
  {
    id: 'triage_chest_pain',
    complaintName: 'Chest Pain',
    iconName: 'HeartPulse',
    description: 'Crushing discomfort, pressure, or pleuritic retrosternal pain.',
    typicalCases: 'STEMI, NSTEMI, Aortic Dissection, PE, Pericarditis, Costochondritis.',
    basicQuestions: [
      {
        id: 'cp_q1',
        question: 'Onset & Character of the Pain',
        options: [
          { text: 'Sudden, severe tearing or crushing pressure', urgencyWeight: 3 },
          { text: 'Gradual onset with exertion, relieves with rest', urgencyWeight: 2 },
          { text: 'Sharp, increases with deep inspiration or coughing', urgencyWeight: 1 },
          { text: 'Reproducible sharp pain with chest wall pressing', urgencyWeight: 0 }
        ]
      },
      {
        id: 'cp_q2',
        question: 'Pain Radiation',
        options: [
          { text: 'Radiates to jaw, left shoulder, or back between scapulae', urgencyWeight: 3 },
          { text: 'Radiates to epigastrium with mild nausea', urgencyWeight: 2 },
          { text: 'Localized to a single spot on the sternum', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_cp_1', question: 'Is the patient pale, profusely diaphoretic (cold sweat), or cyanotic?', warning: 'Severe autonomic instability strongly correlates with acute coronary occlusion or massive PE.' },
      { id: 'rf_cp_2', question: 'Is there a pulse differential or >20 mmHg SBP difference between both arms?', warning: 'Asymmetric upper extremity pulses with severe pain is classic for acute Stanford Type A Aortic Dissection.' },
      { id: 'rf_cp_3', question: 'Is systolic blood pressure < 90 mmHg or heart rate > 120 bpm?', warning: 'Cardiogenic or obstructive shock requires immediate resuscitation bay activation.' }
    ]
  },
  {
    id: 'triage_sob',
    complaintName: 'Shortness of Breath',
    iconName: 'Wind',
    description: 'Acute dyspnea, wheezing, orthopnea, or respiratory distress.',
    typicalCases: 'Asthma exacerbation, Acute Pulmonary Edema, Anaphylaxis, Pneumothorax.',
    basicQuestions: [
      {
        id: 'sob_q1',
        question: 'Ability to Speak',
        options: [
          { text: 'Inability to speak; only 1-2 words between breaths', urgencyWeight: 4 },
          { text: 'Speaks in short phrases with noticeable effort', urgencyWeight: 2 },
          { text: 'Speaks in full sentences comfortably', urgencyWeight: 0 }
        ]
      },
      {
        id: 'sob_q2',
        question: 'Positioning & Work of Breathing',
        options: [
          { text: 'Tripod positioning with intercostal retractions and tracheal tug', urgencyWeight: 3 },
          { text: 'Requires 3 pillows to lie flat (orthopnea)', urgencyWeight: 2 },
          { text: 'Normal chest wall excursion without retractions', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_sob_1', question: 'Is there audible inspiratory stridor or tongue/lip swelling?', warning: 'Upper airway compromise / impending angioedema requires immediate airway management.' },
      { id: 'rf_sob_2', question: 'Is oxygen saturation < 88% on room air or falling rapidly?', warning: 'Severe refractory hypoxemia indicates alveolar flooding, shunt, or massive PE.' },
      { id: 'rf_sob_3', question: 'Is there a "silent chest" with no breath sounds on auscultation?', warning: 'Silent chest in an asthmatic signals imminent respiratory arrest from severe airflow limitation.' }
    ]
  },
  {
    id: 'triage_abdominal_pain',
    complaintName: 'Abdominal Pain',
    iconName: 'Activity',
    description: 'Acute abdomen, periumbilical pain, RUQ/RLQ colic, or peritoneal signs.',
    typicalCases: 'Appendicitis, Ruptured Ectopic, Cholecystitis, Bowel Obstruction, Perforated Viscus.',
    basicQuestions: [
      {
        id: 'ab_q1',
        question: 'Character & Pain Progression',
        options: [
          { text: 'Rigid board-like abdomen, excruciating pain with slightest movement', urgencyWeight: 4 },
          { text: 'Migrated from belly button to right lower quadrant', urgencyWeight: 2 },
          { text: 'Intermittent crampy gas-like bloating after meals', urgencyWeight: 0 }
        ]
      },
      {
        id: 'ab_q2',
        question: 'Associated Signs',
        options: [
          { text: 'Feculent vomiting or coffee-ground hematemesis', urgencyWeight: 3 },
          { text: 'Fever > 38.5°C and inability to keep fluids down', urgencyWeight: 2 },
          { text: 'Normal bowel movements without vomiting', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_ab_1', question: 'Is there involuntary guarding, rebound tenderness, or board-like rigidity?', warning: 'Peritoneal signs denote peritonitis from ruptured hollow viscus requiring emergent surgery.' },
      { id: 'rf_ab_2', question: 'Is the patient a female of reproductive age with acute pelvic pain?', warning: 'Ruptured ectopic pregnancy can cause rapid fatal hemoperitoneum.' },
      { id: 'rf_ab_3', question: 'Is there a pulsatile, tender abdominal mass in an older patient?', warning: 'Rupturing Abdominal Aortic Aneurysm (AAA) is an immediate surgical emergency.' }
    ]
  },
  {
    id: 'triage_headache',
    complaintName: 'Headache',
    iconName: 'Brain',
    description: 'Sudden thunderclap cephalalgia, focal deficits, or meningeal signs.',
    typicalCases: 'Subarachnoid Hemorrhage, Meningitis, Temporal Arteritis, Migraine.',
    basicQuestions: [
      {
        id: 'ha_q1',
        question: 'Onset Speed & Severity',
        options: [
          { text: 'Thunderclap: Peak 10/10 maximum pain within 60 seconds ("worst of my life")', urgencyWeight: 4 },
          { text: 'Gradually worsening over 3 days with neck stiffness', urgencyWeight: 2 },
          { text: 'Unilateral throbbing with photophobia, similar to past migraines', urgencyWeight: 1 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_ha_1', question: 'Is there fever accompanied by marked nuchal rigidity (stiff neck)?', warning: 'Meningitis requires immediate blood cultures, LP, and empiric IV Ceftriaxone + Vancomycin.' },
      { id: 'rf_ha_2', question: 'Are there new focal neurological deficits (droop, hemiparesis, dilated pupil)?', warning: 'Intracranial mass effect or uncal herniation from acute bleed.' }
    ]
  },
  {
    id: 'triage_fever',
    complaintName: 'Fever',
    iconName: 'Thermometer',
    description: 'Pyrexia, rigors, suspected bacteremia, neutropenic fever, or sepsis.',
    typicalCases: 'Severe Sepsis, Pyelonephritis, Meningitis, Endocarditis, Viral syndrome.',
    basicQuestions: [
      {
        id: 'fe_q1',
        question: 'Host Vulnerability Status',
        options: [
          { text: 'Immunocompromised (active chemotherapy, asplenic, or transplant)', urgencyWeight: 4 },
          { text: 'Elderly (>75y) with acute confusion or lethargy', urgencyWeight: 3 },
          { text: 'Young healthy adult with mild coryzal symptoms', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_fe_1', question: 'Is there non-blanching petechial or purpuric rash?', warning: 'Meningococcemia with purpura fulminans can proceed to Waterhouse-Friderichsen syndrome.' },
      { id: 'rf_fe_2', question: 'qSOFA score ≥ 2 (RR ≥ 22, altered mentation, SBP ≤ 100)?', warning: 'Severe sepsis with high mortality risk requiring immediate lactate, blood cultures, and fluids.' }
    ]
  },
  {
    id: 'triage_dizziness',
    complaintName: 'Dizziness',
    iconName: 'Compass',
    description: 'Rotational vertigo, presyncope, gait instability, or lightheadedness.',
    typicalCases: 'Posterior Circulation Stroke, BPPV, Vestibular Neuritis, Orthostatic Hypotension.',
    basicQuestions: [
      {
        id: 'dz_q1',
        question: 'Nature of Dizziness',
        options: [
          { text: 'Constant spinning with severe gait ataxia (cannot stand unsupported)', urgencyWeight: 3 },
          { text: 'Brief episodes lasting seconds provoked by turning in bed', urgencyWeight: 1 },
          { text: 'Lightheadedness only when standing up rapidly', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_dz_1', question: 'Is there spontaneous vertical or direction-changing nystagmus (HINTS exam)?', warning: 'Central vertigo sign indicative of cerebellar or brainstem stroke.' },
      { id: 'rf_dz_2', question: 'Are there cranial nerve palsies, dysphagia, or diplopia?', warning: 'Wallenberg lateral medullary syndrome or basilar artery ischemia.' }
    ]
  },
  {
    id: 'triage_fainting',
    complaintName: 'Fainting (Syncope)',
    iconName: 'Moon',
    description: 'Transient loss of consciousness, postural collapse, and spontaneous recovery.',
    typicalCases: 'Arrhythmogenic syncope, Aortic Stenosis, Vasovagal, Orthostatic, PE.',
    basicQuestions: [
      {
        id: 'sy_q1',
        question: 'Circumstances of Collapse',
        options: [
          { text: 'Occurred during active physical exertion or while supine', urgencyWeight: 4 },
          { text: 'Preceded by palpitations and sudden blackness without warning', urgencyWeight: 3 },
          { text: 'Prolonged standing in warm room preceded by tunnel vision and nausea', urgencyWeight: 1 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_sy_1', question: 'Did syncope occur during active exertion (e.g. running or stairs)?', warning: 'Exertional syncope strongly suggests critical aortic stenosis or hypertrophic cardiomyopathy.' },
      { id: 'rf_sy_2', question: 'Is there a family history of unexplained sudden cardiac death at young age?', warning: 'Congenital long QT, Brugada syndrome, or ARVD.' }
    ]
  },
  {
    id: 'triage_allergic',
    complaintName: 'Allergic Reaction',
    iconName: 'ShieldAlert',
    description: 'Urticaria, pruritus, angioedema, food/drug allergy, or anaphylaxis.',
    typicalCases: 'Anaphylaxis, Urticaria, Drug Eruption, Angioedema.',
    basicQuestions: [
      {
        id: 'al_q1',
        question: 'Systems Involved',
        options: [
          { text: 'Skin hives PLUS breathing difficulty, vomiting, or dizziness', urgencyWeight: 4 },
          { text: 'Lip and tongue swelling without respiratory distress', urgencyWeight: 3 },
          { text: 'Localized mild rash with itching on extremities only', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_al_1', question: 'Is there stridor, hoarseness, sensation of throat tightness, or wheezing?', warning: 'Laryngeal edema in anaphylaxis requires immediate intramuscular Epinephrine 0.3-0.5 mg (1:1000).' },
      { id: 'rf_al_2', question: 'Is there dizziness, syncope, or hypotension (SBP < 90)?', warning: 'Anaphylactic distributive shock.' }
    ]
  },
  {
    id: 'triage_gi',
    complaintName: 'Vomiting & Diarrhea',
    iconName: 'Droplets',
    description: 'Gastroenteritis, dehydration, hypokalemia, hematochezia, or obstruction.',
    typicalCases: 'Viral Gastroenteritis, Clostridioides difficile, Foodborne illness, Bowel Ischemia.',
    basicQuestions: [
      {
        id: 'gi_q1',
        question: 'Fluid Intake & Output',
        options: [
          { text: 'No urine output for >12 hours, extreme dry mouth, postural syncope', urgencyWeight: 3 },
          { text: 'Frequent watery stools, able to sip small amounts of oral rehydration', urgencyWeight: 1 },
          { text: 'Mild loose stool with good appetite', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_gi_1', question: 'Is there frank hematochezia (large bloody stools) or black tarry melena?', warning: 'Major lower or upper GI bleed requiring type and screen and urgent endoscopy.' },
      { id: 'rf_gi_2', question: 'Is severe abdominal pain disproportionate to physical examination findings?', warning: 'Acute mesenteric ischemia in elderly or vasculopaths.' }
    ]
  },
  {
    id: 'triage_trauma',
    complaintName: 'Trauma & Injury',
    iconName: 'Flame',
    description: 'Blunt injury, head impact, lacerations, fractures, or mechanism of injury.',
    typicalCases: 'Intracranial bleed, Tension pneumothorax, Spleen laceration, Fracture.',
    basicQuestions: [
      {
        id: 'tr_q1',
        question: 'Mechanism of Injury & Energy',
        options: [
          { text: 'High energy: Fall > 3 meters, motor vehicle collision > 50 km/h, or rollover', urgencyWeight: 4 },
          { text: 'Direct blow with localized deformity or inability to bear weight', urgencyWeight: 2 },
          { text: 'Low-energy slip with minor contusion', urgencyWeight: 0 }
        ]
      }
    ],
    redFlags: [
      { id: 'rf_tr_1', question: 'Was there loss of consciousness followed by a lucid interval then rapid coma?', warning: 'Epidural hematoma from middle meningeal artery laceration.' },
      { id: 'rf_tr_2', question: 'Is there absent pulse, coldness, or pallor distal to an extremity injury?', warning: 'Vascular transection or compartment syndrome requiring immediate surgical revascularization.' }
    ]
  }
];
