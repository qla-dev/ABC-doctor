import React, { useState } from 'react';
import { 
  Activity, ArrowLeft, Heart, Stethoscope, FileText, CheckCircle2, 
  AlertTriangle, Users, Award, Clock, ChevronRight, Check, X, ShieldAlert,
  Flame, HelpCircle, RefreshCw, Send, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { ProgressRing } from '../components/common/ProgressRing';
import { PATIENT_CASES_DATA, DOCTOR_VS_DOCTOR_MATCHES } from '../data/patientCasesData';
import { PatientCase, InvestigationResult, HistoryClue } from '../types';
import { soundHaptics } from '../services/SoundHaptics';
import { StorageService } from '../services/StorageService';

interface PatientSimulatorScreenProps {
  initialCaseId?: string;
  onAskAI?: (prompt: string, skillId: string) => void;
}

export const PatientSimulatorScreen: React.FC<PatientSimulatorScreenProps> = ({
  initialCaseId,
  onAskAI
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'duel'>('cases');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(() => {
    if (initialCaseId) {
      return PATIENT_CASES_DATA.find(c => c.id === initialCaseId) || null;
    }
    return null;
  });

  // Simulation interactive state
  const [step, setStep] = useState<'presentation' | 'history' | 'exam' | 'investigations' | 'diagnosis' | 'management' | 'debrief'>('presentation');
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [examinedSystems, setExaminedSystems] = useState<string[]>([]);
  const [orderedInvestigationIds, setOrderedInvestigationIds] = useState<string[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startCase = (c: PatientCase) => {
    soundHaptics.tap();
    setSelectedCase(c);
    setStep('presentation');
    setAskedQuestionIds([]);
    setExaminedSystems([]);
    setOrderedInvestigationIds([]);
    setSelectedDiagnosis(null);
    setSelectedActionIds([]);
    setElapsedSeconds(0);
  };

  const handleAskQuestion = (clueId: string) => {
    soundHaptics.tap();
    if (!askedQuestionIds.includes(clueId)) {
      setAskedQuestionIds(prev => [...prev, clueId]);
    }
  };

  const handleExamineSystem = (systemName: string) => {
    soundHaptics.tap();
    if (!examinedSystems.includes(systemName)) {
      setExaminedSystems(prev => [...prev, systemName]);
    }
  };

  const handleOrderInvestigation = (invId: string) => {
    soundHaptics.tap();
    if (!orderedInvestigationIds.includes(invId)) {
      setOrderedInvestigationIds(prev => [...prev, invId]);
    }
  };

  const handleToggleAction = (actionId: string) => {
    soundHaptics.tap();
    if (selectedActionIds.includes(actionId)) {
      setSelectedActionIds(prev => prev.filter(id => id !== actionId));
    } else {
      setSelectedActionIds(prev => [...prev, actionId]);
    }
  };

  const handleFinalizeCase = () => {
    if (!selectedCase) return;
    soundHaptics.correct();
    setStep('debrief');

    // Calculate score
    let score = 0;
    // History points
    const criticalAsked = selectedCase.historyClues.filter(c => c.isCritical && askedQuestionIds.includes(c.id)).length;
    score += criticalAsked * 5;

    // Investigations
    const criticalOrdered = selectedCase.investigations.filter(i => i.isCritical && orderedInvestigationIds.includes(i.id)).length;
    score += criticalOrdered * 7;

    // Diagnosis
    if (selectedDiagnosis === selectedCase.correctDiagnosis) {
      score += 25;
    }

    // Management
    selectedCase.managementActions.forEach(action => {
      if (selectedActionIds.includes(action.id)) {
        score += action.points;
      }
    });

    const finalScore = Math.max(20, Math.min(100, score));
    StorageService.recordSimulationCompletion(finalScore);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // Case Selector View
  if (!selectedCase) {
    return (
      <div className="px-4 pt-3 pb-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Clinical Bedside
            </span>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              Patient Simulator
            </h1>
          </div>

          <div className="flex rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'cases' ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500'
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => setActiveTab('duel')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                activeTab === 'duel' ? 'bg-cyan-500 text-white shadow-sm' : 'text-neutral-500'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Duel</span>
            </button>
          </div>
        </div>

        {activeTab === 'duel' ? (
          /* Doctor vs Doctor Architecture Preview */
          <div className="space-y-3">
            <GlassCard variant="accent" className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm">Multiplayer Mode Preview</Badge>
                <Users className="w-4 h-4 text-cyan-500" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Doctor vs Doctor Matchmaker
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Two medical students solve the same clinical patient encounter independently. The engine benchmarks clinical reasoning velocity, investigation parsimony, and patient safety outcomes.
              </p>
            </GlassCard>

            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1 pt-2">
              Recent Case Head-to-Head
            </h4>

            {DOCTOR_VS_DOCTOR_MATCHES.map(match => (
              <GlassCard key={match.matchId} className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-white/10">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">{match.caseTitle}</span>
                  <Badge variant="green" size="sm">Completed</Badge>
                </div>

                {/* Students Comparison Header */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                    <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 block truncate">{match.student1.name}</span>
                    <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{match.student1.score}</span>
                    <span className="text-[10px] text-neutral-500 block">{match.student1.timeFormatted}</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
                    <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block truncate">{match.student2.name}</span>
                    <span className="text-xl font-black text-neutral-700 dark:text-neutral-300">{match.student2.score}</span>
                    <span className="text-[10px] text-neutral-500 block">{match.student2.timeFormatted}</span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-1.5 pt-1">
                  {match.comparisonMetrics.map((m, i) => (
                    <div key={i} className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 text-[11px] flex items-center justify-between">
                      <span className="font-semibold text-neutral-600 dark:text-neutral-400">{m.category}</span>
                      <span className={`font-bold ${m.winner === 1 ? 'text-cyan-600 dark:text-cyan-400' : 'text-neutral-500'}`}>
                        {m.student1Result}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          /* Cases List */
          <div className="space-y-3">
            {PATIENT_CASES_DATA.map(c => (
              <GlassCard
                key={c.id}
                onClick={() => startCase(c)}
                className="p-4 cursor-pointer hover:border-blue-500/40 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={c.triageColor === 'red' ? 'red' : 'orange'} size="sm">
                      {c.triageColor === 'red' ? 'Emergent (Red)' : 'Urgent (Orange)'}
                    </Badge>
                    <span className="text-xs text-neutral-400">{c.age}y · {c.gender === 'M' ? 'Male' : 'Female'}</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-500 group-hover:translate-x-0.5 transition-transform">
                    Enter Bay &rarr;
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {c.patientName} — {c.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2">
                  {c.chiefComplaint}
                </p>

                {/* Vitals preview pills */}
                <div className="pt-2 border-t border-neutral-200/50 dark:border-white/5 flex items-center gap-3 text-[10px] text-neutral-500">
                  <span>HR: <strong className="text-neutral-800 dark:text-neutral-200">{c.vitals.hr}</strong></span>
                  <span>BP: <strong className="text-neutral-800 dark:text-neutral-200">{c.vitals.bp}</strong></span>
                  <span>SpO2: <strong className="text-neutral-800 dark:text-neutral-200">{c.vitals.spo2}</strong></span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Simulation Workflow
  return (
    <div className="min-h-full pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-4 py-2.5 backdrop-blur-xl bg-white/85 dark:bg-neutral-900/85 border-b border-neutral-200/60 dark:border-white/10 flex items-center justify-between">
        <button
          onClick={() => setSelectedCase(null)}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Bay</span>
        </button>

        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[160px]">
          {selectedCase.patientName} ({selectedCase.age}{selectedCase.gender})
        </span>

        <Badge variant={selectedCase.triageColor === 'red' ? 'red' : 'orange'} size="sm">
          {step.toUpperCase()}
        </Badge>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Step 1: Presentation & Vitals */}
        {step === 'presentation' && (
          <div className="space-y-4">
            <GlassCard className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="red" size="sm">Chief Complaint</Badge>
                <span className="text-[10px] text-neutral-400">Triage Assessment</span>
              </div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                "{selectedCase.chiefComplaint}"
              </p>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedCase.historyOfPresentIllness}
              </p>
            </GlassCard>

            {/* Vitals Monitor Card */}
            <GlassCard variant="elevated" className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Vital Signs Monitor
                </span>
                <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Telemetry Live
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Heart Rate</span>
                  <span className={`text-base font-black ${selectedCase.vitals.hr > 100 ? 'text-red-500' : 'text-neutral-900 dark:text-white'}`}>
                    {selectedCase.vitals.hr} <span className="text-[10px] font-normal">bpm</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Blood Pressure</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white">
                    {selectedCase.vitals.bp}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Oxygen Sat</span>
                  <span className="text-base font-black text-cyan-500">
                    {selectedCase.vitals.spo2}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Resp Rate</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white">
                    {selectedCase.vitals.rr} /min
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">Temperature</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white">
                    {selectedCase.vitals.temp}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
                  <span className="text-[9px] uppercase font-bold text-neutral-400 block">GCS Mentation</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white">
                    {selectedCase.vitals.gcs} / 15
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setStep('history')}
            >
              Proceed to Clinical History &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 2: History Taking */}
        {step === 'history' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Phase 2: Anamnesis</span>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Select Questions to Ask {selectedCase.patientName}
              </h3>
              <p className="text-xs text-neutral-500">
                Critical clues will influence your differential and safety rating.
              </p>
            </div>

            <div className="space-y-2.5">
              {selectedCase.historyClues.map(clue => {
                const isAsked = askedQuestionIds.includes(clue.id);

                return (
                  <GlassCard
                    key={clue.id}
                    onClick={() => handleAskQuestion(clue.id)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isAsked ? 'border-cyan-500/40 bg-cyan-500/5' : 'hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white pr-2">
                        "{clue.questionText}"
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isAsked ? 'bg-cyan-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {isAsked ? 'Answered' : 'Ask'}
                      </span>
                    </div>

                    {isAsked && (
                      <div className="mt-2.5 pt-2.5 border-t border-cyan-500/20 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                        🗣️ <span className="italic">"{clue.patientAnswer}"</span>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={askedQuestionIds.length === 0}
              onClick={() => setStep('exam')}
            >
              Perform Physical Exam &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 3: Physical Examination */}
        {step === 'exam' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">Phase 3: Physical Examination</span>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Perform Targeted System Exam
              </h3>
              <p className="text-xs text-neutral-500">
                Tap each physiological system to inspect, palpate, percuss, and auscultate.
              </p>
            </div>

            <div className="space-y-2.5">
              {selectedCase.physicalExamFindings.map(finding => {
                const isExamined = examinedSystems.includes(finding.system);

                return (
                  <GlassCard
                    key={finding.system}
                    onClick={() => handleExamineSystem(finding.system)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isExamined 
                        ? finding.isAbnormal
                          ? 'border-amber-500/40 bg-amber-500/5'
                          : 'border-emerald-500/40 bg-emerald-500/5'
                        : 'hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {finding.system}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExamined ? 'bg-neutral-800 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                      }`}>
                        {isExamined ? 'Examined' : 'Examine'}
                      </span>
                    </div>

                    {isExamined && (
                      <div className="mt-2.5 pt-2.5 border-t border-neutral-200/50 dark:border-white/5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                        {finding.isAbnormal && (
                          <span className="text-[10px] font-bold text-amber-500 uppercase block mb-0.5">
                            Abnormal Finding Detected:
                          </span>
                        )}
                        {finding.findings}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={examinedSystems.length === 0}
              onClick={() => setStep('investigations')}
            >
              Order Investigations &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 4: Request Investigations */}
        {step === 'investigations' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Phase 4: Diagnostics</span>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Request Labs, ECG & Imaging
              </h3>
              <p className="text-xs text-neutral-500">
                Prioritize high-yield studies. Avoid unnecessary delays in emergent presentations.
              </p>
            </div>

            <div className="space-y-2.5">
              {selectedCase.investigations.map(inv => {
                const isOrdered = orderedInvestigationIds.includes(inv.id);

                return (
                  <GlassCard
                    key={inv.id}
                    onClick={() => handleOrderInvestigation(inv.id)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isOrdered ? 'border-cyan-500 bg-cyan-500/10' : 'hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={inv.type === 'ecg' ? 'red' : inv.type === 'imaging' ? 'purple' : 'cyan'} size="sm">
                            {inv.type.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-neutral-400">{inv.costOrDelay}</span>
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-1">
                          {inv.name}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOrdered ? 'bg-cyan-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {isOrdered ? 'Returned' : 'Order Stat'}
                      </span>
                    </div>

                    {isOrdered && (
                      <div className="mt-2.5 pt-2.5 border-t border-cyan-500/20 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-semibold">
                        🔬 Result: {inv.result}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={orderedInvestigationIds.length === 0}
              onClick={() => setStep('diagnosis')}
            >
              Synthesize Diagnosis &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 5: Differential & Final Diagnosis */}
        {step === 'diagnosis' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-500">Phase 5: Diagnostic Decision</span>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Select Definitive Final Diagnosis
              </h3>
              <p className="text-xs text-neutral-500">
                Based on history, examination, ECG, and investigation results.
              </p>
            </div>

            <div className="space-y-2">
              {selectedCase.differentialOptions.map((diag, i) => {
                const isSelected = selectedDiagnosis === diag;

                return (
                  <GlassCard
                    key={i}
                    onClick={() => setSelectedDiagnosis(diag)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected ? 'border-cyan-500 bg-cyan-500/15' : 'hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {diag}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-500" />}
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={!selectedDiagnosis}
              onClick={() => setStep('management')}
            >
              Choose Acute Management &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 6: Clinical Management */}
        {step === 'management' && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Phase 6: Therapeutic Plan</span>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Select Immediate Interventions
              </h3>
              <p className="text-xs text-neutral-500">
                Choose all appropriate medications, consults, and interventions. Avoid contraindicated treatments!
              </p>
            </div>

            <div className="space-y-2">
              {selectedCase.managementActions.map(act => {
                const isSelected = selectedActionIds.includes(act.id);

                return (
                  <GlassCard
                    key={act.id}
                    onClick={() => handleToggleAction(act.id)}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-500/15' : 'hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-neutral-900 dark:text-white">
                        {act.name}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-neutral-300 dark:border-neutral-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={selectedActionIds.length === 0}
              onClick={handleFinalizeCase}
            >
              Finalize Case & View Assessment &rarr;
            </GlassButton>
          </div>
        )}

        {/* Step 7: Debrief & Comprehensive Scoring */}
        {step === 'debrief' && (
          <div className="space-y-4">
            <GlassCard variant="elevated" className="p-5 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Simulation Concluded
                </span>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white mt-0.5">
                  Clinical Performance Debrief
                </h2>
                <p className="text-xs text-neutral-500">
                  Definitive Diagnosis: <strong className="text-neutral-900 dark:text-white">{selectedCase.correctDiagnosis}</strong>
                </p>
              </div>

              {/* Status Banner */}
              <div className={`p-3 rounded-2xl text-xs font-semibold ${
                selectedDiagnosis === selectedCase.correctDiagnosis
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
                  : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/25'
              }`}>
                {selectedDiagnosis === selectedCase.correctDiagnosis
                  ? '✓ Correct Primary Diagnosis Identified'
                  : `✗ Misdiagnosed as ${selectedDiagnosis}`}
              </div>
            </GlassCard>

            {/* Management Decisions Assessment */}
            <GlassCard className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Management Assessment & Patient Safety
              </h3>
              <div className="space-y-2">
                {selectedCase.managementActions.map(action => {
                  const wasChosen = selectedActionIds.includes(action.id);
                  const isContraindicated = action.category === 'contraindicated';

                  if (!wasChosen && !isContraindicated) return null;

                  return (
                    <div
                      key={action.id}
                      className={`p-3 rounded-2xl text-xs ${
                        wasChosen && !isContraindicated
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                          : wasChosen && isContraindicated
                          ? 'bg-red-500/15 border border-red-500/30 text-red-900 dark:text-red-200'
                          : 'bg-neutral-100 dark:bg-neutral-800/40 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>{action.name}</span>
                        <span>{wasChosen && !isContraindicated ? '+Pts' : wasChosen && isContraindicated ? 'Safety Violation' : 'Omitted'}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {action.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Clinical Pearls for this Case */}
            <GlassCard variant="accent" className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Key Teaching Points
              </span>
              <ul className="space-y-1.5">
                {selectedCase.teachingPoints.map((tp, i) => (
                  <li key={i} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <div className="pt-2 space-y-2">
              <GlassButton
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setSelectedCase(null)}
              >
                Back to Simulator Bay
              </GlassButton>
              {onAskAI && (
                <GlassButton
                  variant="glass"
                  fullWidth
                  onClick={() => onAskAI(`Explain the clinical pathophysiology and catheterization indications for this patient case: ${selectedCase.patientName} (${selectedCase.correctDiagnosis})`, 'clinical_case')}
                >
                  Discuss Case with AI Doctor &rarr;
                </GlassButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
