import { PatientCase, DoctorVsDoctorMatch } from '../types';

export const PATIENT_CASES_DATA: PatientCase[] = [
  {
    id: 'case_ami_58m',
    title: 'Acute Sub-sternal Chest Pain in 58M',
    patientName: 'Marcus Vance',
    age: 58,
    gender: 'M',
    triageColor: 'red',
    chiefComplaint: 'Crushing chest pressure radiating to left arm and jaw for 90 minutes',
    historyOfPresentIllness: 'Mr. Vance was in his garage working on his car when he felt a sudden, heavy pressure in the center of his chest. He describes it as "an elephant sitting on my sternum." The pain radiates up into his lower jaw and down the ulnar side of his left arm. He broke into a cold sweat and became nauseous. He called 911 when the pain didn\'t improve after resting.',
    vitals: {
      hr: 104,
      bp: '164/98',
      rr: 22,
      spo2: '94% RA',
      temp: '37.1°C',
      gcs: 15
    },
    historyClues: [
      {
        id: 'h1',
        questionText: 'Can you describe the pain? Is it sharp, tearing, or pressure-like?',
        patientAnswer: 'It\'s not sharp at all. It\'s a heavy, dull crushing weight. Like my chest is squeezed in a vise.',
        isCritical: true
      },
      {
        id: 'h2',
        questionText: 'Did the pain start suddenly or build up gradually?',
        patientAnswer: 'It hit me suddenly about an hour and a half ago. It hasn\'t let up even for a second.',
        isCritical: true
      },
      {
        id: 'h3',
        questionText: 'Do you have medical conditions like diabetes, high blood pressure, or cholesterol?',
        patientAnswer: 'Yes, I have high blood pressure and type 2 diabetes. I\'ll admit I haven\'t been taking my blood pressure pills regularly lately.',
        isCritical: true
      },
      {
        id: 'h4',
        questionText: 'Do you smoke or use other substances?',
        patientAnswer: 'I smoke about a pack a day for the past 30 years. No drugs though.',
        isCritical: false
      },
      {
        id: 'h5',
        questionText: 'Any family members with heart attacks at an early age?',
        patientAnswer: 'My father had a fatal heart attack when he was only 52.',
        isCritical: true
      },
      {
        id: 'h6',
        questionText: 'Have you taken any erectile dysfunction medications like Viagra recently?',
        patientAnswer: 'No, none at all.',
        isCritical: true
      }
    ],
    physicalExamFindings: [
      {
        system: 'General Appearance',
        findings: 'Moderately distressed, pale, diaphoretic, clutching his sternum with a closed fist (Levine sign positive).',
        isAbnormal: true
      },
      {
        system: 'Cardiovascular',
        findings: 'Tachycardic, regular rhythm. Normal S1 and S2. Soft S4 gallop present at the apex. No murmurs or friction rubs heard.',
        isAbnormal: true
      },
      {
        system: 'Lungs / Respiratory',
        findings: 'Mild tachypnea. Clear to auscultation bilaterally. No wheezing, crackles, or rhonchi.',
        isAbnormal: false
      },
      {
        system: 'Neck / Vascular',
        findings: 'JVP is flat at 30 degrees. Radial and femoral pulses are equal and symmetrical bilaterally with brisk upstroke.',
        isAbnormal: false
      },
      {
        system: 'Abdomen',
        findings: 'Soft, non-tender, non-distended. Normal bowel sounds. No pulsatile abdominal mass.',
        isAbnormal: false
      }
    ],
    investigations: [
      {
        id: 'inv_ecg',
        type: 'ecg',
        name: '12-Lead Electrocardiogram (ECG)',
        costOrDelay: '2 min (Stat)',
        result: 'Sinus tachycardia at 102 bpm. Marked 3.5 mm ST-segment elevation in leads V1, V2, V3, and V4 with hyperacute T waves. Reciprocal ST depression in leads II, III, and aVF.',
        isCritical: true
      },
      {
        id: 'inv_trop',
        type: 'lab',
        name: 'High-Sensitivity Cardiac Troponin I',
        costOrDelay: '20 min',
        result: 'hs-cTnI: 480 ng/L (Markedly elevated; Reference URL < 14 ng/L).',
        referenceRange: '< 14 ng/L',
        isCritical: true
      },
      {
        id: 'inv_cxr',
        type: 'imaging',
        name: 'Portable Chest Radiograph',
        costOrDelay: '15 min',
        result: 'Normal cardiothoracic ratio. Mediastinal contours normal without widening. Clear lung parenchyma without pulmonary edema or pneumothorax.',
        isCritical: false
      },
      {
        id: 'inv_bmp',
        type: 'lab',
        name: 'Basic Metabolic Panel (BMP)',
        costOrDelay: '25 min',
        result: 'Na: 138 mEq/L, K: 4.1 mEq/L, Cl: 101 mEq/L, HCO3: 24 mEq/L, BUN: 18 mg/dL, Cr: 1.0 mg/dL, Glucose: 172 mg/dL.',
        referenceRange: 'Normal electrolytes, mild hyperglycemia',
        isCritical: false
      },
      {
        id: 'inv_coag',
        type: 'lab',
        name: 'Coagulation Panel (PT/INR, aPTT)',
        costOrDelay: '25 min',
        result: 'PT: 12.1 sec, INR: 1.0, aPTT: 28 sec (Within normal limits).',
        isCritical: false
      }
    ],
    differentialOptions: [
      'ST-Elevation Myocardial Infarction (STEMI)',
      'Acute Aortic Dissection',
      'Acute Pulmonary Embolism',
      'Acute Pericarditis',
      'Gastroesophageal Reflux Disease (GERD)',
      'Tension Pneumothorax'
    ],
    correctDiagnosis: 'ST-Elevation Myocardial Infarction (STEMI)',
    managementActions: [
      {
        id: 'm1',
        name: 'Activate Cardiac Catheterization Lab for Emergent Primary PCI',
        category: 'immediate',
        points: 30,
        feedback: 'Excellent! Immediate catheterization lab activation is the single most critical intervention for acute STEMI (target door-to-balloon < 90 min).'
      },
      {
        id: 'm2',
        name: 'Administer Chewable Aspirin 325 mg orally',
        category: 'immediate',
        points: 20,
        feedback: 'Correct. Immediate un-coated chewable aspirin inhibits COX-1 and platelet thromboxane A2 release, reducing mortality.'
      },
      {
        id: 'm3',
        name: 'Administer Ticagrelor 180 mg PO loading dose',
        category: 'immediate',
        points: 20,
        feedback: 'Correct! P2Y12 platelet receptor inhibitor loading dose is indicated prior to or during primary PCI.'
      },
      {
        id: 'm4',
        name: 'Administer Unfractionated Heparin (60 units/kg IV bolus)',
        category: 'immediate',
        points: 15,
        feedback: 'Correct. Therapeutic anticoagulation inhibits further thrombus propagation along the ruptured plaque.'
      },
      {
        id: 'm5',
        name: 'Administer Sublingual Nitroglycerin 0.4 mg for chest pain',
        category: 'immediate',
        points: 10,
        feedback: 'Appropriate. Nitroglycerin reduces myocardial oxygen demand and improves coronary collateral perfusion (safe since SBP > 90 and anterior leads involved).'
      },
      {
        id: 'm6',
        name: 'Administer IV Fibrinolytic (Tenecteplase) immediately',
        category: 'contraindicated',
        points: -25,
        feedback: 'Contraindicated when immediate Primary PCI is readily available within 90 minutes. Fibrinolysis carries unnecessary intracranial hemorrhage risk.'
      },
      {
        id: 'm7',
        name: 'Order 100% High-Flow Oxygen via Non-rebreather mask',
        category: 'contraindicated',
        points: -10,
        feedback: 'Incorrect. Patient\'s SpO2 is 94%. Current ACC/AHA guidelines advise against hyperoxia, which causes reactive coronary vasoconstriction.'
      }
    ],
    scoringRubric: {
      historyMaxPoints: 25,
      investigationMaxPoints: 20,
      diagnosisMaxPoints: 25,
      managementMaxPoints: 30
    },
    teachingPoints: [
      'In anterior STEMI (leads V1–V4), the Left Anterior Descending (LAD) artery is occluded.',
      'Emergency Primary PCI within 90 minutes of medical contact is the treatment of choice.',
      'Always confirm that PDE-5 inhibitors (Viagra/Cialis) have not been taken before giving Nitroglycerin.',
      'Supplemental oxygen is only indicated if SpO2 < 90%.'
    ]
  },
  {
    id: 'case_appendicitis_24f',
    title: 'Acute Migratory RLQ Pain in 24F',
    patientName: 'Elena Rostova',
    age: 24,
    gender: 'F',
    triageColor: 'orange',
    chiefComplaint: 'Right lower quadrant abdominal pain for 14 hours with nausea and vomiting',
    historyOfPresentIllness: 'Elena is a 24-year-old graduate student who developed dull, crampy aching around her belly button yesterday evening. Over the past 6 hours, the pain migrated down to her right lower side and became sharp and constant. She feels pain with every step when walking. She vomited twice this morning and has had no appetite at all.',
    vitals: {
      hr: 98,
      bp: '116/74',
      rr: 18,
      spo2: '99% RA',
      temp: '38.1°C',
      gcs: 15
    },
    historyClues: [
      {
        id: 'he1',
        questionText: 'When was your Last Menstrual Period (LMP)?',
        patientAnswer: 'It was about 3 weeks ago, normal flow.',
        isCritical: true
      },
      {
        id: 'he2',
        questionText: 'Are you sexually active, and could you possibly be pregnant?',
        patientAnswer: 'I am sexually active, but we use condoms. I really don\'t think I am pregnant.',
        isCritical: true
      },
      {
        id: 'he3',
        questionText: 'Did the nausea and vomiting start before or after the abdominal pain?',
        patientAnswer: 'The pain started first around dinner time. The nausea came on later in the middle of the night.',
        isCritical: true
      },
      {
        id: 'he4',
        questionText: 'Any burning with urination, frequency, or vaginal discharge?',
        patientAnswer: 'No burning and no unusual discharge.',
        isCritical: false
      }
    ],
    physicalExamFindings: [
      {
        system: 'Abdomen - Palpation',
        findings: 'Maximal exquisite tenderness at McBurney\'s point. Marked involuntary guarding in the RLQ.',
        isAbnormal: true
      },
      {
        system: 'Abdomen - Special Signs',
        findings: 'Rovsing sign positive (palpation of LLQ causes pain in RLQ). Psoas sign positive (pain on passive right hip extension).',
        isAbnormal: true
      },
      {
        system: 'Pelvic Exam',
        findings: 'No cervical motion tenderness. Normal adnexa without palpable masses or fullness.',
        isAbnormal: false
      }
    ],
    investigations: [
      {
        id: 'inv_hcg',
        type: 'lab',
        name: 'Urine & Serum Beta-hCG (Pregnancy Test)',
        costOrDelay: '5 min (Stat)',
        result: 'Negative (< 2 mIU/mL). Confirms patient is not pregnant.',
        isCritical: true
      },
      {
        id: 'inv_cbc',
        type: 'lab',
        name: 'Complete Blood Count (CBC)',
        costOrDelay: '15 min',
        result: 'WBC 14,800/uL with 86% neutrophils and 8% band forms (marked left shift). Hemoglobin 13.2 g/dL.',
        referenceRange: 'WBC 4,500–11,000/uL',
        isCritical: true
      },
      {
        id: 'inv_us',
        type: 'imaging',
        name: 'Graded Compression Abdominal Ultrasound',
        costOrDelay: '25 min',
        result: 'Non-compressible, blind-ending tubular structure in RLQ measuring 8.2 mm in diameter with target sign and hyperemic wall vascularity on color Doppler. Mild pericecal fluid.',
        isCritical: true
      }
    ],
    differentialOptions: [
      'Acute Appendicitis',
      'Ruptured Ectopic Pregnancy',
      'Right Ovarian Torsion',
      'Pelvic Inflammatory Disease (PID)',
      'Mesenteric Adenitis',
      'Acute Gastroenteritis'
    ],
    correctDiagnosis: 'Acute Appendicitis',
    managementActions: [
      {
        id: 'ma1',
        name: 'Make patient NPO and start IV Isotonic Crystalloid fluids',
        category: 'immediate',
        points: 25,
        feedback: 'Essential pre-operative preparation for general anesthesia.'
      },
      {
        id: 'ma2',
        name: 'Request Emergent General Surgery Consultation for Laparoscopic Appendectomy',
        category: 'immediate',
        points: 35,
        feedback: 'Definitive surgical therapy before perforation occurs.'
      },
      {
        id: 'ma3',
        name: 'Administer IV Pre-operative Antibiotics (Cefoxitin 2g IV or Ceftriaxone + Metronidazole)',
        category: 'immediate',
        points: 25,
        feedback: 'Reduces post-operative surgical site and intra-abdominal abscess rates.'
      },
      {
        id: 'ma4',
        name: 'Administer IV Analgesia (Acetaminophen / Fentanyl)',
        category: 'immediate',
        points: 15,
        feedback: 'Correct! Humane pain control does NOT obscure physical exam findings.'
      }
    ],
    scoringRubric: {
      historyMaxPoints: 25,
      investigationMaxPoints: 20,
      diagnosisMaxPoints: 25,
      managementMaxPoints: 30
    },
    teachingPoints: [
      'Always rule out ectopic pregnancy with hCG in women of reproductive age with acute abdominal pain.',
      'Pain migration from periumbilical to RLQ occurs because initial visceral pain (T10) transitions to somatic parietal peritoneal irritation.',
      'Ultrasound is non-invasive and highly effective for appendicitis, especially in young women and pediatric patients.'
    ]
  }
];

export const DOCTOR_VS_DOCTOR_MATCHES: DoctorVsDoctorMatch[] = [
  {
    matchId: 'match_101',
    caseTitle: 'Acute Anterior STEMI (58M)',
    status: 'completed',
    student1: {
      name: 'You (Dr. Candidate)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      score: 95,
      diagnosis: 'Acute STEMI',
      timeFormatted: '4m 12s',
      investigationsOrdered: 3
    },
    student2: {
      name: 'Dr. Sarah Lin (Oxford Med)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      score: 88,
      diagnosis: 'Acute STEMI',
      timeFormatted: '5m 45s',
      investigationsOrdered: 5
    },
    comparisonMetrics: [
      {
        category: 'Time to Cath Lab Activation',
        student1Result: '3 min (Immediate)',
        student2Result: '6 min (Delayed for CXR)',
        winner: 1
      },
      {
        category: 'Diagnostic Accuracy',
        student1Result: '100% (Anterior STEMI)',
        student2Result: '100% (Anterior STEMI)',
        winner: 'tie'
      },
      {
        category: 'Targeted Labs (Cost/Efficiency)',
        student1Result: 'ECG + Troponin (Optimal)',
        student2Result: 'Full Lab Workup (Over-ordered)',
        winner: 1
      },
      {
        category: 'Safety Violations',
        student1Result: '0 (Avoided Nitrates in RV risk)',
        student2Result: '1 (Excess Oxygen administered)',
        winner: 1
      }
    ]
  }
];
