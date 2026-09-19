import { Topic } from '../types';

export const TOPICS_DATA: Topic[] = [
  {
    id: 'ami',
    title: 'Acute Myocardial Infarction',
    subtitle: 'Coronary artery occlusion, ischemic necrosis, and reperfusion paradigms',
    category: 'Cardiology',
    readTimeMinutes: 12,
    completionPercentage: 72,
    isBookmarked: true,
    highYieldRating: 5,
    overview: 'Acute Myocardial Infarction (AMI) is myocardial cell death attributable to prolonged ischemia. It is classified into ST-segment elevation myocardial infarction (STEMI) and non-ST-segment elevation myocardial infarction (NSTEMI) based on initial 12-lead ECG findings.',
    definitions: 'Myocardial necrosis diagnosed by a rise and/or fall of cardiac biomarkers (preferably high-sensitivity cardiac troponin) with at least one value above the 99th percentile upper reference limit, accompanied by symptoms of ischemia, new ischemic ECG changes, or development of pathological Q waves.',
    mechanisms: 'Most frequently caused by acute rupture or erosion of a vulnerable atherosclerotic plaque with thin fibrous cap, leading to platelet aggregation, thrombin generation, and occlusive intraluminal thrombosis. Complete persistent occlusion leads to transmural STEMI; partial or intermittent occlusion leads to subendocardial NSTEMI. Within 20-30 minutes of complete occlusion, ischemic necrosis initiates in the vulnerable subendocardium and radiates outward as a wave of necrosis across the ventricular wall over 6-12 hours.',
    clinicalPresentation: {
      symptoms: [
        'Retrosternal chest pressure, heaviness, or squeezing ("elephant on chest")',
        'Radiation to left arm, neck, lower jaw, or epigastrium',
        'Dyspnea, diaphoresis, lightheadedness, and acute presyncope',
        'Nausea and vomiting (especially common in inferior wall MI due to vagal stimulation)',
        'Atypical or painless presentation in diabetics, females, and elderly ("silent ischemia")'
      ],
      physicalSigns: [
        'Diaphoresis, pale cool extremities, and anxiety (Levine\'s sign positive)',
        'Fourth heart sound (S4 gallop) indicating non-compliant ischemic ventricle',
        'New apical systolic murmur indicating papillary muscle rupture / acute mitral regurgitation',
        'Basilar pulmonary crackles or elevated JVD in congestive left/right ventricular failure'
      ],
      triadsOrPeculiarities: 'Right Ventricular Infarction Triad (seen in 30-50% of inferior STEMIs due to proximal RCA occlusion): Hypotension, Clear Lung Fields, and Elevated Jugular Venous Distension (JVD).'
    },
    diagnosis: {
      criteria: '12-lead ECG acquired within 10 minutes. STEMI criteria: New ST-elevation at J-point in ≥2 contiguous leads (≥1 mm in limb/precordial leads; in V2-V3: ≥2 mm in men ≥40y, ≥2.5 mm in men <40y, ≥1.5 mm in women).',
      firstLineLabs: [
        'High-sensitivity Cardiac Troponin (hs-cTnI or hs-cTnT) at presentation and 1-3 hours',
        'Complete Blood Count (CBC) and Basic Metabolic Panel (BMP with eGFR)',
        'Coagulation profile (PT/INR, aPTT) prior to anticoagulation',
        'Lipid panel and HbA1c during hospitalization'
      ],
      imagingGoldStandard: 'Immediate Emergency Coronary Angiography (Primary PCI) is the gold standard diagnostic and therapeutic intervention.'
    },
    treatment: {
      acuteManagement: [
        'Primary PCI within ≤90 minutes (door-to-balloon) at PCI centers, or ≤120 minutes if transferred',
        'If PCI delay >120 minutes: Fibrinolytic therapy (Tenecteplase/Alteplase) within ≤30 minutes of arrival (door-to-needle)',
        'Chewable non-enteric Aspirin 162–325 mg immediately upon first medical contact',
        'P2Y12 receptor antagonist: Ticagrelor 180 mg or Prasugrel 60 mg (preferred over Clopidogrel 600 mg)',
        'Anticoagulation: Unfractionated Heparin (weight-adjusted IV bolus + drip) or Enoxaparin',
        'Sublingual Nitroglycerin 0.4 mg q5min (up to 3 doses) for ischemic pain relief',
        'Supplemental Oxygen ONLY if SpO2 < 90% (routine oxygen causes reactive coronary vasoconstriction)'
      ],
      longTermManagement: [
        'Dual Antiplatelet Therapy (DAPT) with Aspirin + P2Y12 inhibitor for at least 12 months post-PCI',
        'High-intensity Statin therapy (Atorvastatin 80 mg or Rosuvastatin 40 mg) indefinitely',
        'Beta-blocker (Metoprolol succinate or Carvedilol) initiated within 24 hours if hemodynamically stable',
        'ACE inhibitor or ARB within 24 hours, especially if LVEF ≤ 40%, anterior STEMI, or heart failure'
      ],
      contraindications: [
        'Nitrates are strictly contraindicated if SBP < 90 mmHg, HR < 50 bpm, suspected RV infarction, or phosphodiesterase-5 inhibitor use within 24-48 hours',
        'Beta-blockers contraindicated during acute cardiogenic shock, active bronchospasm, or PR interval > 0.24s'
      ]
    },
    clinicalPearls: [
      'Right ventricular infarction is preload-dependent: treat hypotension with IV crystalloid boluses; avoid nitrates and diuretics!',
      'Reciprocal ST-depression in opposite leads has >90% positive predictive value for acute coronary occlusion.',
      'New or presumed new Left Bundle Branch Block (LBBB) with Sgarbossa criteria should be treated as STEMI equivalent.'
    ],
    keyPoints: [
      'Time is muscle: every 30-minute delay in PCI increases 1-year mortality by 7.5%.',
      'Door-to-balloon benchmark: ≤90 minutes. Door-to-needle: ≤30 minutes.',
      'Cardiac troponin peaks around 12–24 hours and remains elevated for up to 10–14 days.'
    ],
    relatedTopicIds: ['heart_failure', 'stroke', 'pulmonary_embolism']
  },
  {
    id: 'heart_failure',
    title: 'Congestive Heart Failure',
    subtitle: 'HFrEF, HFpEF, neurohormonal activation, and guideline-directed medical therapy',
    category: 'Cardiology',
    readTimeMinutes: 14,
    completionPercentage: 45,
    isBookmarked: false,
    highYieldRating: 5,
    overview: 'Heart Failure (HF) is a complex clinical syndrome resulting from structural or functional impairment of ventricular filling or ejection. It is categorized into HF with reduced ejection fraction (HFrEF; LVEF ≤ 40%) and HF with preserved ejection fraction (HFpEF; LVEF ≥ 50%).',
    definitions: 'A clinical syndrome characterized by cardinal symptoms (dyspnea, orthopnea, ankle swelling) and signs (elevated JVP, pulmonary crackles, displaced apex) caused by elevated intracardiac pressures and/or inadequate cardiac output at rest or during stress.',
    mechanisms: 'Initial myocardial injury (ischemia, hypertension, cardiomyopathy) reduces cardiac output. In response, compensatory neurohormonal pathways activate: the Sympathetic Nervous System (SNS) and the Renin-Angiotensin-Aldosterone System (RAAS). While initially maintaining arterial pressure, chronic hyperactivation leads to maladaptive left ventricular remodeling, cardiomyocyte apoptosis, interstitial fibrosis, and volume overload.',
    clinicalPresentation: {
      symptoms: [
        'Exertional dyspnea progressing to orthopnea (pillow count) and Paroxysmal Nocturnal Dyspnea (PND)',
        'Fatigue, poor exercise tolerance, and cold extremities',
        'Rapid involuntary weight gain due to fluid retention',
        'Right-sided symptoms: right upper quadrant discomfort (hepatic congestion), early satiety, bilateral ankle edema'
      ],
      physicalSigns: [
        'Elevated Jugular Venous Pressure (JVP) with positive abdominojugular reflux',
        'Third heart sound (S3 gallop) due to rapid ventricular filling in dilated ventricle',
        'Laterally displaced, sustained apical impulse (cardiac enlargement)',
        'Bilateral inspiratory bibasilar crackles that do not clear with coughing',
        'Pitting pretibial and sacral edema'
      ],
      triadsOrPeculiarities: 'Framingham Criteria: requires simultaneous presence of at least 2 major criteria (or 1 major + 2 minor criteria) for clinical diagnosis.'
    },
    diagnosis: {
      criteria: 'Clinical signs and symptoms supported by elevated natriuretic peptides (BNP > 100 pg/mL or NT-proBNP > 300 pg/mL in acute decompensation) and transthoracic echocardiography.',
      firstLineLabs: [
        'Serum BNP or NT-proBNP (elevated levels confirm cardiac etiology of dyspnea)',
        'Comprehensive Metabolic Panel (serum creatinine, electrolytes, sodium, potassium, liver transaminases)',
        'Complete Blood Count (rule out severe anemia as high-output failure trigger)',
        'Serum ferritin and transferrin saturation (screen for iron deficiency)'
      ],
      imagingGoldStandard: 'Comprehensive Transthoracic Echocardiogram (TTE) with Doppler to calculate LVEF, ventricular volumes, diastolic filling indices, and valvular pathologies.'
    },
    treatment: {
      acuteManagement: [
        'Upright posture and supplemental oxygen (or non-invasive positive pressure ventilation/BiPAP for acute SCAPE)',
        'Intravenous Loop Diuretic (Furosemide or Bumetanide) bolus at 2–2.5x the patient\'s home oral dose',
        'Vasodilators (IV Nitroglycerin or Nitroprusside) for severe hypertensive acute heart failure',
        'Avoid routine inotropes unless profound cardiogenic shock with end-organ hypoperfusion'
      ],
      longTermManagement: [
        'Four Pillars of GDMT for HFrEF: 1. ARNI (Sacubitril/Valsartan) or ACEi/ARB',
        '2. Evidence-based Beta-blocker (Carvedilol, Metoprolol succinate, or Bisoprolol)',
        '3. Mineralocorticoid Receptor Antagonist (MRA: Spironolactone or Eplerenone)',
        '4. SGLT2 inhibitor (Dapagliflozin or Empagliflozin) regardless of diabetes status',
        'Implantable Cardioverter-Defibrillator (ICD) if LVEF ≤ 35% after ≥3 months optimal GDMT'
      ],
      contraindications: [
        'Do not initiate or uptitrate beta-blockers during acute decompensated volume overload',
        'Avoid non-dihydropyridine calcium channel blockers (Verapamil, Diltiazem) in HFrEF due to negative inotropy'
      ]
    },
    clinicalPearls: [
      'S3 is specific for volume overload and increased LV filling pressures in adults over 40.',
      'SGLT2 inhibitors confer mortality and hospitalization reduction in BOTH HFrEF and HFpEF.',
      'Always check renal function and potassium 1-2 weeks after initiating or uptitrating ACEi/ARNI/MRA.'
    ],
    keyPoints: [
      'Four pillars of GDMT substantially reduce all-cause mortality and hospitalizations in HFrEF.',
      'BNP can be falsely lower in obese patients and elevated in renal impairment and atrial fibrillation.',
      'Sacubitril/Valsartan requires a 36-hour washout period if switching from an ACE inhibitor to prevent fatal angioedema.'
    ],
    relatedTopicIds: ['ami', 'pulmonary_embolism', 'pneumonia']
  },
  {
    id: 'asthma',
    title: 'Asthma & Acute Exacerbation',
    subtitle: 'Reversible airway hyperresponsiveness, type 2 inflammation, and emergency management',
    category: 'Pulmonology' as any,
    readTimeMinutes: 10,
    completionPercentage: 88,
    isBookmarked: false,
    highYieldRating: 4,
    overview: 'Asthma is a chronic inflammatory disorder of the airways characterized by episodic, reversible airflow obstruction, bronchial hyperresponsiveness, and airway remodeling.',
    definitions: 'Obstructive lung disease defined by respiratory symptoms (wheeze, shortness of breath, chest tightness, cough) that vary over time and in intensity, along with variable expiratory airflow limitation.',
    mechanisms: 'Driven by T-helper 2 (Th2) cell-mediated allergic inflammation. Inhaled allergens cross-link IgE on mast cells, triggering degranulation of histamine, leukotrienes (C4, D4, E4), and prostaglandin D2. Eosinophils and neutrophils infiltrate airway submucosa, producing epithelial sloughing, goblet cell hyperplasia with mucus plugging, and bronchial smooth muscle hypertrophy.',
    clinicalPresentation: {
      symptoms: [
        'Triad: Episodic dyspnea, wheezing, and chronic nocturnal or early morning cough',
        'Chest tightness exacerbated by exercise, viral infections, cold air, or emotional stress',
        'Symptom-free intervals between acute exacerbations'
      ],
      physicalSigns: [
        'Diffuse high-pitched expiratory polyphonic wheezes on chest auscultation',
        'Prolonged expiratory phase with tachypnea',
        'Severe exacerbation signs: Accessory muscle use (intercostal/sternocleidomastoid retractions), pulsus paradoxus > 12 mmHg',
        'Impending respiratory failure: "Silent chest" (lack of wheezing due to severely reduced air movement), diaphoresis, inability to speak full sentences'
      ],
      triadsOrPeculiarities: 'Samter\'s Triad (Aspirin-Exacerbated Respiratory Disease / AERD): Asthma, chronic rhinosinusitis with nasal polyps, and bronchospasm upon ingestion of aspirin or NSAIDs.'
    },
    diagnosis: {
      criteria: 'Spirometry demonstrating airflow limitation (FEV1/FVC < 0.70) that reverses significantly after inhaled short-acting bronchodilator (increase in FEV1 by > 12% and > 200 mL).',
      firstLineLabs: [
        'Peak Expiratory Flow (PEF) for rapid bedside assessment during acute exacerbations',
        'Arterial Blood Gas (ABG) in severe exacerbation: initial respiratory alkalosis (low PaCO2); a "normal" or rising PaCO2 signals respiratory muscle exhaustion and impending arrest',
        'Complete blood count (peripheral eosinophilia) and total serum IgE level'
      ],
      imagingGoldStandard: 'Chest Radiography is obtained primarily to exclude complications (pneumothorax, pneumomediastinum, foreign body, pneumonia).'
    },
    treatment: {
      acuteManagement: [
        'Inhaled Short-Acting Beta-2 Agonist (SABA: Albuterol 2.5–5 mg nebulized or 4–8 puffs via spacer q20min x 3)',
        'Inhaled Anticholinergic (Ipratropium bromide 0.5 mg nebulized) combined with albuterol (DuoNeb)',
        'Early Systemic Corticosteroids: Oral Prednisone 40–50 mg or IV Methylprednisolone 60–125 mg',
        'Intravenous Magnesium Sulfate (2 g IV infusion over 20 min) for severe refractory exacerbations',
        'Heliox or Non-Invasive Ventilation / Ketamine-assisted RSI if impending mechanical failure'
      ],
      longTermManagement: [
        'GINA Stepwise Guidelines: As-needed low-dose Inhaled Corticosteroid (ICS)-formoterol as preferred reliever across all stages',
        'Daily low-to-high dose maintenance ICS plus Long-Acting Beta Agonist (LABA)',
        'Leukotriene Receptor Antagonists (Montelukast) particularly useful in exercise-induced and AERD',
        'Biologic therapies targeting IgE (Omalizumab) or IL-5/IL-4R for severe refractory eosinophilic asthma'
      ],
      contraindications: [
        'LABA monotherapy is strictly contraindicated without an ICS (significant increase in asthma-related death)',
        'Avoid sedatives during acute exacerbation as they blunt respiratory drive'
      ]
    },
    clinicalPearls: [
      'A "normal" PaCO2 (40 mmHg) in a tachypneic asthmatic is an ominous sign of respiratory failure requiring immediate ICU transfer!',
      'Silent chest occurs when airflow is so low that wheezing cannot be generated—do not mistake this for improvement!',
      'Spirometry is the most reliable tool for diagnosis, but peak flow meters provide rapid home tracking.'
    ],
    keyPoints: [
      'Reversibility: >12% and >200 mL improvement in FEV1 post-bronchodilator.',
      'First-line controller: Inhaled corticosteroids (ICS) address the underlying chronic inflammation.',
      'Acute exacerbation: SABA + Ipratropium + systemic steroids + IV Magnesium sulfate.'
    ],
    relatedTopicIds: ['pneumonia', 'pulmonary_embolism', 'heart_failure']
  },
  {
    id: 'pneumonia',
    title: 'Community-Acquired Pneumonia',
    subtitle: 'Alveolar exudation, CURB-65 risk stratification, and empiric antimicrobial therapy',
    category: 'Internal Medicine',
    readTimeMinutes: 11,
    completionPercentage: 60,
    isBookmarked: false,
    highYieldRating: 4,
    overview: 'Community-Acquired Pneumonia (CAP) is an acute infection of the pulmonary parenchyma acquired outside of healthcare facilities, resulting in alveolar consolidation and systemic inflammatory response.',
    definitions: 'Infection of the lung parenchyma presenting with clinical symptoms of acute lower respiratory tract infection accompanied by a new radiographic infiltrate on chest imaging.',
    mechanisms: 'Aspiration of oropharyngeal flora or inhalation of aerosolized pathogens overwhelms alveolar macrophage defenses. Microorganisms multiply in alveolar spaces, provoking intense release of IL-1, TNF-alpha, and IL-8. Neutrophil recruitment, capillary leakage, and purulent exudate fill alveolar sacs (red/gray hepatization), creating ventilation-perfusion mismatch and hypoxemia.',
    clinicalPresentation: {
      symptoms: [
        'Fever, shaking rigors, and night sweats',
        'Cough with purulent sputum ("rust-colored" in Streptococcus pneumoniae)',
        'Pleuritic chest pain (sharp, worsens with deep inspiration or coughing)',
        'Dyspnea, tachypnea, and generalized malaise',
        'Confusion and altered mental status in elderly patients with blunted febrile responses'
      ],
      physicalSigns: [
        'Signs of consolidation: Dullness to percussion, increased tactile fremitus, and bronchial breath sounds',
        'Ego-phony ("E to A" transition over consolidated area) and whispered pectoriloquy',
        'Inspiratory localized crackles / rales over affected lobe',
        'Hypoxemia (SpO2 < 92%) and tachypnea (RR > 20/min)'
      ],
      triadsOrPeculiarities: 'CURB-65 Criteria for hospital admission: Confusion, Urea > 7 mmol/L (BUN > 19), Respiratory rate ≥ 30, Blood pressure (SBP < 90 or DBP ≤ 60), Age ≥ 65.'
    },
    diagnosis: {
      criteria: 'Clinical signs of acute infection (fever, cough, crackles) PLUS demonstration of an acute infiltrate on chest radiograph or chest CT.',
      firstLineLabs: [
        'Complete Blood Count (leukocytosis with left shift / immature bands)',
        'Comprehensive Metabolic Panel (serum creatinine, BUN, electrolytes)',
        'Blood cultures (2 sets) and sputum Gram stain/culture for hospitalized moderate-to-severe CAP',
        'Urinary antigen tests for Streptococcus pneumoniae and Legionella pneumophila'
      ],
      imagingGoldStandard: 'Posteroanterior (PA) and lateral Chest Radiography demonstrating focal consolidation, air bronchograms, or interstitial infiltrates.'
    },
    treatment: {
      acuteManagement: [
        'Outpatient (No comorbidities): High-dose Amoxicillin 1 g PO TID OR Doxycycline 100 mg BID',
        'Outpatient (With comorbidities: COPD, diabetes, renal disease): Augmentin + Macrolide (Azithromycin) OR Respiratory Fluoroquinolone (Levofloxacin/Moxifloxacin)',
        'Inpatient (Non-severe): Ceftriaxone 1–2 g IV daily + Azithromycin 500 mg IV daily (or Levofloxacin IV)',
        'Inpatient (Severe / ICU): Beta-lactam (Ceftriaxone or Ampicillin-sulbactam) + Azithromycin OR Fluoroquinolone. Add Vancomycin/Linezolid if MRSA suspected, Cefepime/Piperacillin-tazobactam if Pseudomonas suspected',
        'Initiate first dose of antibiotic within ≤4 hours of hospital arrival'
      ],
      longTermManagement: [
        'Antibiotic duration typically 5 days if afebrile for ≥48 hours and clinically stable',
        'Follow-up chest X-ray at 6-8 weeks for patients >50y or smokers to ensure resolution and rule out underlying malignancy',
        'Pneumococcal conjugate (PCV20 or PCV15 followed by PPSV23) and annual influenza vaccination'
      ],
      contraindications: [
        'Macrolide monotherapy should not be used where pneumococcal macrolide resistance exceeds 25%',
        'Avoid fluoroquinolones when alternative beta-lactam therapies are available due to tendinopathy and aortic dissection risks'
      ]
    },
    clinicalPearls: [
      'In elderly patients, pneumonia frequently presents atypically with acute confusion, delirium, falls, or tachypnea without fever or cough!',
      'Streptococcus pneumoniae remains the #1 cause of CAP across all age groups.',
      'Legionella pneumonia often presents with high fever, relative bradycardia (Faget sign), diarrhea, and profound hyponatremia.'
    ],
    keyPoints: [
      'CURB-65 score: 0-1 = outpatient; 2 = consider inpatient; ≥3 = inpatient / ICU evaluation.',
      'Golden rule: New pulmonary infiltrate on chest imaging is required for definitive diagnosis.',
      'First dose of antibiotics should be administered promptly without delaying for cultures.'
    ],
    relatedTopicIds: ['asthma', 'heart_failure', 'pulmonary_embolism']
  },
  {
    id: 'stroke',
    title: 'Acute Ischemic Stroke',
    subtitle: 'Cerebral ischemia, penumbra salvage, IV thrombolysis, and mechanical thrombectomy',
    category: 'Neurology',
    readTimeMinutes: 15,
    completionPercentage: 55,
    isBookmarked: true,
    highYieldRating: 5,
    overview: 'Acute Ischemic Stroke (AIS) is an acute neurological deficit caused by sudden focal hypoperfusion and infarction of central nervous system tissue, accounting for 87% of all cerebrovascular accidents.',
    definitions: 'Episode of neurological dysfunction caused by focal cerebral, spinal, or retinal infarction confirmed by imaging or enduring clinical deficits.',
    mechanisms: 'Results from large vessel thromboembolism (cardioembolic from atrial fibrillation, or artery-to-artery from carotid atherosclerotic plaque) or small-vessel in situ lipohyalinosis (lacunar stroke). Interruption of cerebral blood flow creates an irreversible necrotic core surrounded by a salvageable "ischemic penumbra" that can be rescued by timely recanalization.',
    clinicalPresentation: {
      symptoms: [
        'Sudden focal neurological deficits (BE-FAST: Balance, Eyes, Face drooping, Arm weakness, Speech difficulty, Time to call)',
        'Middle Cerebral Artery (MCA) syndrome: Contralateral hemiparesis and sensory loss (face/arm > leg), contralateral homonymous hemianopia, gaze preference toward infarct',
        'Dominant hemisphere MCA: Aphasia (Broca expressive or Wernicke receptive); Non-dominant: Hemineglect and anosognosia',
        'Anterior Cerebral Artery (ACA): Contralateral motor/sensory deficits (leg > arm/face), urinary incontinence, abulia',
        'Posterior Circulation / Basilar: Vertigo, ataxia, bilateral weakness, cranial nerve palsies ("crossed signs")'
      ],
      physicalSigns: [
        'National Institutes of Health Stroke Scale (NIHSS) scoring 0–42 points',
        'Facial droop (sparing the forehead in UMN lesion, vs. Bell\'s palsy which involves forehead)',
        'Pronator drift and asymmetrical deep tendon hyperreflexia with extensor Babinski sign'
      ],
      triadsOrPeculiarities: 'Horner\'s Syndrome (Ptosis, Miosis, Anhidrosis) accompanied by neck pain suggests internal carotid artery dissection!'
    },
    diagnosis: {
      criteria: 'Acute neurological deficit with emergent non-contrast head CT immediately excluding intracranial hemorrhage, followed by CT Angiography (CTA) from aortic arch to vertex to identify Large Vessel Occlusion (LVO).',
      firstLineLabs: [
        'Rapid point-of-care fingerstick Blood Glucose (to rule out hypoglycemia mimic)',
        'Complete blood count (platelet count > 100,000/uL required for thrombolysis)',
        'Coagulation parameters (PT/INR ≤ 1.7, aPTT normal unless on anticoagulants)',
        'Troponin and 12-lead ECG (evaluate for concurrent MI and atrial fibrillation)'
      ],
      imagingGoldStandard: 'Non-contrast Head CT is mandatory first-line to rule out hemorrhage. CT Perfusion or MRI Diffusion-Weighted Imaging (DWI) / FLAIR mismatch precisely quantifies core infarct vs. salvageable penumbra.'
    },
    treatment: {
      acuteManagement: [
        'Intravenous Thrombolysis (Tenecteplase 0.25 mg/kg IV bolus OR Alteplase 0.9 mg/kg IV infusion) within ≤4.5 hours of symptom onset ("last known normal")',
        'Endovascular Mechanical Thrombectomy (EVT) within ≤6 hours (and up to 24 hours in selected patients with DAWN/DEFUSE-3 imaging criteria) for Large Vessel Occlusions (ICA or proximal MCA M1)',
        'Blood pressure management before thrombolysis: Must be lowered to < 185/110 mmHg (IV Labetalol or Nicardipine) and maintained < 180/105 mmHg for 24h post-lysis',
        'Maintain permissive hypertension (up to 220/120 mmHg) if NOT eligible for thrombolysis/EVT to maintain penumbral perfusion',
        'Avoid antiplatelet or anticoagulant agents for 24 hours post-thrombolysis until 24h follow-up CT rules out intracranial hemorrhage'
      ],
      longTermManagement: [
        'Aspirin 81–325 mg daily (or DAPT with Aspirin + Clopidogrel for 21 days for minor stroke/TIA)',
        'High-intensity statin (Atorvastatin 80 mg daily) to achieve LDL < 70 mg/dL',
        'Oral anticoagulation (DOACs: Apixaban/Rivaroxaban) for cardioembolic stroke due to atrial fibrillation (initiated after 3–14 days depending on infarct size)',
        'Carotid endarterectomy or stenting for symptomatic ipsilateral carotid stenosis 70–99%'
      ],
      contraindications: [
        'Absolute contraindications to IV thrombolysis: Evidence of active intracranial hemorrhage on CT, intracranial neoplasm, recent head trauma/stroke within 3 months, active internal bleeding, platelet count < 100k, INR > 1.7, direct thrombin inhibitor or Xa inhibitor within 48 hours'
      ]
    },
    clinicalPearls: [
      '"Time is Brain": 1.9 million neurons die every minute an ischemic stroke goes untreated.',
      'Always test fingerstick capillary glucose first: severe hypoglycemia (<50 mg/dL) can perfectly mimic dense hemiplegia and aphasia!',
      'Upper Motor Neuron (UMN) facial weakness spares forehead wrinkling due to bilateral cortical innervation; Lower Motor Neuron (Bell\'s palsy) involves both upper and lower facial muscles.'
    ],
    keyPoints: [
      'Thrombolytic window: ≤ 4.5 hours from last known normal.',
      'Mechanical thrombectomy window: up to 24 hours for Large Vessel Occlusion with perfusion mismatch.',
      'Non-contrast CT must be completed immediately upon arrival to rule out hemorrhage.'
    ],
    relatedTopicIds: ['ami', 'heart_failure', 'pulmonary_embolism']
  },
  {
    id: 'appendicitis',
    title: 'Acute Appendicitis',
    subtitle: 'Luminal obstruction, transmural bacterial invasion, and surgical decision-making',
    category: 'Surgery',
    readTimeMinutes: 9,
    completionPercentage: 90,
    isBookmarked: false,
    highYieldRating: 4,
    overview: 'Acute Appendicitis is acute inflammation of the vermiform appendix, representing the most common surgical emergency of the abdomen worldwide.',
    definitions: 'Transmural inflammation of the appendix caused by luminal obstruction, progressing to distension, ischemia, gangrene, and potential free perforation with peritonitis.',
    mechanisms: 'Luminal obstruction by a fecalith (in adults), lymphoid hyperplasia (in children following viral infection), foreign body, or carcinoid tumor. Continued mucosal secretion raises intraluminal pressure, collapsing venous and lymphatic outflow. Bacterial overgrowth (Escherichia coli, Bacteroides fragilis) invades the ischemic wall, leading to transmural necrosis and perforation into the peritoneal cavity.',
    clinicalPresentation: {
      symptoms: [
        'Classic migratory abdominal pain: Periumbilical dull visceral aching that migrates to the Right Lower Quadrant (RLQ) over 12–24 hours',
        'Anorexia (Hamburger sign positive: patient refuses favorite food)',
        'Nausea and vomiting occurring AFTER the onset of abdominal pain (if vomiting precedes pain, consider gastroenteritis)',
        'Low-grade fever (37.8°C–38.5°C); high spiking fevers (>39°C) suggest gangrenous perforation or intra-abdominal abscess'
      ],
      physicalSigns: [
        'Maximal tenderness at McBurney\'s point (one-third distance from the right ASIS to the umbilicus)',
        'Rovsing\'s sign: Deep palpation in LLQ elicits pain in the RLQ',
        'Psoas sign: Pain on passive extension of right hip (indicates retrocecal appendix)',
        'Obturator sign: Pain on passive internal rotation of flexed right hip (pelvic appendix)',
        'Peritoneal signs: Involuntary guarding, rebound tenderness, and rigidity'
      ],
      triadsOrPeculiarities: 'Alvarado Score (MANTRELS): Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness in RLQ (2), Rebound pain (1), Elevated temperature (1), Leukocytosis (2), Shift of neutrophils to left (1). Score ≥7 strongly predicts appendicitis.'
    },
    diagnosis: {
      criteria: 'Clinical suspicion based on Alvarado score confirmed by diagnostic imaging and inflammatory biomarkers.',
      firstLineLabs: [
        'Complete Blood Count: Leukocytosis (WBC 10,000–18,000/uL with neutrophilia and bandemia)',
        'Urine Pregnancy Test (hCG) in ALL females of reproductive age to rule out ectopic pregnancy',
        'Urinalysis (to rule out nephrolithiasis and UTI; mild sterile pyuria can occur if appendix abuts ureter/bladder)',
        'Serum C-reactive protein (CRP)'
      ],
      imagingGoldStandard: 'Abdominal CT with IV contrast is the gold standard in non-pregnant adults (sensitivity > 95%; shows dilated appendix > 6 mm, wall thickening, periappendiceal fat stranding, appendicolith). Grayscale and Doppler Ultrasound is first-line in children and pregnant patients.'
    },
    treatment: {
      acuteManagement: [
        'NPO (nil per os) status and intravenous fluid resuscitation with balanced isotonic crystalloids',
        'Intravenous broad-spectrum empiric antibiotics covering enteric Gram-negatives and anaerobes: Cefoxitin 2 g IV OR Ceftriaxone 1–2 g IV + Metronidazole 500 mg IV',
        'Adequate analgesia (IV acetaminophen or titrated opioids do NOT mask physical examination findings)',
        'Laparoscopic Appendectomy is the definitive standard of care'
      ],
      longTermManagement: [
        'Postoperative antibiotic continuation only if perforated, gangrenous, or peritonitis present (typically 4 days oral/IV)',
        'Pathology review of the resected appendix to rule out neuroendocrine (carcinoid) tumor or adenocarcinoma'
      ],
      contraindications: [
        'Avoid oral cathartics or enemas as increased intraluminal pressure can provoke perforation',
        'Do not delay surgical exploration in patients with diffuse peritonitis and septic shock'
      ]
    },
    clinicalPearls: [
      'In pregnant women, the growing uterus pushes the appendix upward and laterally toward the right upper quadrant (RUQ).',
      'Retrocecal appendicitis may present with minimal anterior abdominal tenderness but prominent right flank pain or positive psoas sign.',
      'Sudden temporary relief of severe pain is a classic harbinger of appendiceal perforation!'
    ],
    keyPoints: [
      'Classic pain migration: Visceral periumbilical (T10 dermatome) to somatic RLQ (McBurney\'s point).',
      'Urine pregnancy test is non-negotiable in female patients of childbearing age.',
      'Abdominal CT is gold standard for non-pregnant adults; Ultrasound is first-line for children/pregnancy.'
    ],
    relatedTopicIds: ['t2dm', 'ami']
  },
  {
    id: 't2dm',
    title: 'Type 2 Diabetes & Acute Crises',
    subtitle: 'Insulin resistance, glucotoxicity, DKA vs HHS comparison, and modern pharmacotherapy',
    category: 'Internal Medicine',
    readTimeMinutes: 13,
    completionPercentage: 35,
    isBookmarked: false,
    highYieldRating: 5,
    overview: 'Type 2 Diabetes Mellitus (T2DM) is a chronic metabolic disorder characterized by progressive peripheral insulin resistance coupled with relative beta-cell secretory defect, resulting in chronic hyperglycemia and micro/macrovascular complications.',
    definitions: 'Diagnosed by Fasting Plasma Glucose ≥ 126 mg/dL (7.0 mmol/L), 2-hour 75g OGTT ≥ 200 mg/dL, HbA1c ≥ 6.5%, or random plasma glucose ≥ 200 mg/dL with classic hyperglycemic symptoms.',
    mechanisms: 'Complex interplay of genetic predisposition and lifestyle factors. Adipocyte hypertrophy and ectopic lipid deposition (liver, muscle) cause receptor and post-receptor insulin signaling defects. Compensatory hyperinsulinemia initially maintains euglycemia until pancreatic beta cells undergo secretory exhaustion and amyloid deposition. Acute decompensation under metabolic stress (infection, MI, medication non-adherence) can trigger Diabetic Ketoacidosis (DKA) or Hyperosmolar Hyperglycemic State (HHS).',
    clinicalPresentation: {
      symptoms: [
        'Classic osmotic symptoms: Polyuria, polydipsia, polyphagia, and unintentional weight loss',
        'Blurred vision due to hyperosmolar changes in the lens',
        'Chronic fatigue, recurrent candidal vulvovaginitis, and poor wound healing',
        'DKA presentation: Rapid onset (<24h), Kussmaul respirations, fruity acetone breath odor, nausea, vomiting, diffuse abdominal pain',
        'HHS presentation: Insidious onset over days to weeks, profound dehydration, lethargy, focal seizures, and coma'
      ],
      physicalSigns: [
        'Acanthosis nigricans (hyperpigmented velvety plaques on neck/axillae indicating severe insulin resistance)',
        'Signs of dehydration: Decreased skin turgor, dry mucous membranes, sunken eyes, orthostatic hypotension',
        'Peripheral neuropathy: Loss of protective sensation using 10g Semmes-Weinstein monofilament'
      ],
      triadsOrPeculiarities: 'DKA vs HHS comparison: DKA features Glucose > 250, high anion gap metabolic acidosis (pH < 7.3, HCO3 < 18), and positive serum ketones. HHS features Glucose > 600 mg/dL, serum osmolality > 320 mOsm/kg, minimal or absent ketones, and normal pH (>7.30).'
    },
    diagnosis: {
      criteria: 'Fasting glucose ≥ 126 mg/dL or HbA1c ≥ 6.5% on two separate occasions (or single test if unequivocal symptoms present).',
      firstLineLabs: [
        'Comprehensive Metabolic Panel (serum glucose, sodium, potassium, BUN, creatinine)',
        'Calculate Corrected Sodium: Measured Na + 1.6 * ((Glucose - 100) / 100)',
        'Serum beta-hydroxybutyrate (preferred over urine acetoacetate for ketone quantification in DKA)',
        'Arterial or Venous Blood Gas (VBG pH is approximately 0.03 lower than ABG and clinically sufficient)',
        'Serum Osmolality = 2 * Na + (Glucose / 18) + (BUN / 2.8)'
      ],
      imagingGoldStandard: 'Diagnostic testing is laboratory-based. Chest radiography and urinalysis are obtained to identify precipitating infectious causes.'
    },
    treatment: {
      acuteManagement: [
        'Acute DKA/HHS Protocol: #1 Fluid Resuscitation: 0.9% Normal Saline 1000–1500 mL/hr for initial 1–2 hours',
        '#2 Potassium Correction FIRST: If K+ < 3.3 mEq/L, HOLD insulin and replete potassium until > 3.3 to prevent fatal cardiac arrhythmias',
        '#3 IV Regular Insulin: 0.1 units/kg bolus followed by 0.1 units/kg/hr infusion (target glucose drop of 50–75 mg/dL/hr)',
        'When glucose drops to 200–250 mg/dL: Add 5% Dextrose (D5W) to fluids while CONTINUING insulin infusion until anion gap closes (anion gap < 12 and HCO3 ≥ 18)'
      ],
      longTermManagement: [
        'First-line oral pharmacotherapy: Metformin (titrated to 2000 mg/day)',
        'SGLT2 inhibitors (Empagliflozin, Dapagliflozin) for patients with established ASCVD, heart failure, or CKD',
        'GLP-1 receptor agonists (Semaglutide, Liraglutide) for ASCVD risk reduction and substantial weight loss',
        'Basal-bolus insulin regimens for advanced insulin-deficient patients'
      ],
      contraindications: [
        'Metformin is contraindicated if eGFR < 30 mL/min due to risk of lactic acidosis',
        'SGLT2 inhibitors can precipitate "Euglycemic DKA" (DKA with near-normal blood glucose levels < 250 mg/dL)'
      ]
    },
    clinicalPearls: [
      'In DKA, total body potassium is always severely depleted despite initial normal or elevated serum potassium levels due to extracellular acidotic shifting!',
      'Never stop the insulin infusion in DKA just because glucose drops to normal; add dextrose to fluids and continue insulin until the anion gap is completely resolved!',
      'SGLT2 inhibitors confer renal and cardiac protection independently of glucose lowering.'
    ],
    keyPoints: [
      'DKA = Acidosis + Ketones + rapid onset. HHS = Extreme hyperglycemia (>600) + Hyperosmolality + days to weeks.',
      'Step 1 of DKA/HHS management is always aggressive fluid resuscitation.',
      'Check potassium before starting insulin!'
    ],
    relatedTopicIds: ['ami', 'heart_failure', 'stroke']
  },
  {
    id: 'pe',
    title: 'Pulmonary Embolism',
    subtitle: 'Thromboembolism, right ventricular strain, Wells score, and hemodynamic classification',
    category: 'Emergency Medicine',
    readTimeMinutes: 11,
    completionPercentage: 20,
    isBookmarked: false,
    highYieldRating: 5,
    overview: 'Pulmonary Embolism (PE) is the sudden occlusion of the pulmonary arterial bed by a thrombus dislodged from the deep venous system of the lower extremities or pelvis.',
    definitions: 'Obstruction of pulmonary blood flow classified into Massive (hemodynamically unstable with hypotension/shock), Submassive (normotensive with right ventricular dysfunction or elevated troponins), and Low-risk PE.',
    mechanisms: 'Thrombus originates in deep veins of lower extremity (femoral, popliteal, iliac) promoted by Virchow\'s Triad (endothelial injury, stasis, hypercoagulability). The embolus travels through right heart chambers and lodges in pulmonary arteries. Mechanical obstruction and neurohumoral vasoconstriction increase pulmonary vascular resistance (PVR). The thin-walled Right Ventricle dilates, shifting the interventricular septum into the LV (McConnell\'s sign), decreasing LV preload and causing cardiogenic shock.',
    clinicalPresentation: {
      symptoms: [
        'Sudden-onset unexplained dyspnea (most common symptom, >75% of cases)',
        'Pleuritic chest pain (sharp, aggravated by inspiration, caused by peripheral pulmonary infarction)',
        'Hemoptysis, lightheadedness, or sudden syncope (strongly suggests massive saddle PE)',
        'Unilateral calf pain and swelling preceding presentation'
      ],
      physicalSigns: [
        'Tachypnea (RR > 20) and resting tachycardia (HR > 100 bpm)',
        'Hypoxemia with wide alveolar-arterial (A-a) oxygen gradient on arterial blood gas',
        'Accentuated second heart sound (loud pulmonic component P2)',
        'Unilateral lower extremity edema, tenderness, and warmth (DVT signs)'
      ],
      triadsOrPeculiarities: 'Wells Score for PE: Clinical signs of DVT (3), PE most likely diagnosis (3), Tachycardia > 100 (1.5), Immobilization/surgery in 4 weeks (1.5), Prior DVT/PE (1.5), Hemoptysis (1), Malignancy (1). Score > 4 = PE likely.'
    },
    diagnosis: {
      criteria: 'Risk stratification using Wells score or PERC rule (Pulmonary Embolism Rule-out Criteria), followed by D-dimer or imaging.',
      firstLineLabs: [
        'Age-adjusted D-dimer test (age x 10 ug/L if age > 50) for PE-unlikely patients; high negative predictive value (>98%) to rule out PE',
        'Cardiac biomarkers: High-sensitivity Troponin and BNP/NT-proBNP (elevations indicate RV microinfarction and strain)',
        'Arterial Blood Gas: Hypoxemia, hypocapnia, respiratory alkalosis, and elevated A-a gradient',
        '12-lead ECG: Sinus tachycardia is most common. Classic S1Q3T3 pattern (deep S wave in lead I, Q wave in lead III, inverted T wave in lead III) indicates acute cor pulmonale'
      ],
      imagingGoldStandard: 'Computed Tomography Pulmonary Angiography (CTPA) is the definitive gold standard. Ventilation-Perfusion (V/Q) scan is preferred if severe renal insufficiency or iodinated contrast allergy.'
    },
    treatment: {
      acuteManagement: [
        'Massive / Hemodynamically Unstable PE (SBP < 90 mmHg or shock): Systemic Thrombolytic therapy (Alteplase 100 mg IV over 2 hours) or catheter-directed thrombectomy / surgical embolectomy',
        'Submassive & Low-Risk PE: Immediate therapeutic anticoagulation (Low Molecular Weight Heparin like Enoxaparin 1 mg/kg SC BID, or direct oral anticoagulants Apixaban/Rivaroxaban)',
        'Supportive IV fluids: Judicious crystalloid boluses (≤500 mL) to avoid over-distending the failing right ventricle; Norepinephrine for vasopressor support'
      ],
      longTermManagement: [
        'Anticoagulation duration: Minimum 3 months for provoked PE (after surgery or transient risk factor)',
        'Indefinite anticoagulation for unprovoked PE or persistent active cancer / thrombophilia',
        'Inferior Vena Cava (IVC) filter placement indicated ONLY when anticoagulation is strictly contraindicated or recurrent PE occurs despite therapeutic anticoagulation'
      ],
      contraindications: [
        'Avoid aggressive fluid over-resuscitation in RV failure as it worsens septal bowing and drops LV cardiac output'
      ]
    },
    clinicalPearls: [
      'Sinus tachycardia is the single most common ECG finding in PE, not S1Q3T3 (which is specific but only present in ~10–15% of cases)!',
      'Normal chest X-ray in a severely dyspneic, hypoxemic patient is highly suspicious for acute pulmonary embolism!',
      'Hampton\'s hump (wedge-shaped peripheral opacity) and Westermark\'s sign (focal oligemia) are rare classic radiographic signs of pulmonary infarction.'
    ],
    keyPoints: [
      'Wells score determines whether D-dimer or immediate CTPA is the first diagnostic step.',
      'Massive PE is defined by hypotension (SBP < 90 mmHg for >15 min) and requires thrombolysis.',
      'Therapeutic anticoagulation should be initiated immediately while awaiting confirmatory imaging if clinical suspicion is high.'
    ],
    relatedTopicIds: ['ami', 'asthma', 'pneumonia']
  }
];
