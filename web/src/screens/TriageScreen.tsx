import React, { useState } from 'react';
import { 
  AlertTriangle, ArrowLeft, ShieldAlert, HeartPulse, Wind, 
  Activity, Brain, Thermometer, Compass, Moon, Droplets, 
  Flame, CheckCircle2, ChevronRight, AlertCircle, PhoneCall
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { TRIAGE_SCENARIOS_DATA } from '../data/triageScenariosData';
import { TriageScenario, UrgencyCategory } from '../types';
import { soundHaptics } from '../services/SoundHaptics';

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Wind,
  Activity,
  Brain,
  Thermometer,
  Compass,
  Moon,
  ShieldAlert,
  Droplets,
  Flame
};

export const TriageScreen: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TriageScenario | null>(null);
  const [basicAnswers, setBasicAnswers] = useState<Record<string, number>>({});
  const [checkedRedFlagIds, setCheckedRedFlagIds] = useState<string[]>([]);
  const [resultUrgency, setResultUrgency] = useState<UrgencyCategory | null>(null);

  const startScenario = (s: TriageScenario) => {
    soundHaptics.tap();
    setSelectedScenario(s);
    setBasicAnswers({});
    setCheckedRedFlagIds([]);
    setResultUrgency(null);
  };

  const handleEvaluate = () => {
    if (!selectedScenario) return;
    soundHaptics.tap();

    const redFlagsCount = checkedRedFlagIds.length;
    let basicWeightTotal = 0;
    Object.values(basicAnswers).forEach(w => { basicWeightTotal += Number(w); });

    let urgency: UrgencyCategory = 'Routine assessment';

    if (redFlagsCount > 0 || basicWeightTotal >= 6) {
      urgency = 'Emergency';
      soundHaptics.incorrect(); // Urgent alert
    } else if (basicWeightTotal >= 4) {
      urgency = 'Urgent';
    } else if (basicWeightTotal >= 2) {
      urgency = 'Same-day assessment';
    } else if (basicWeightTotal >= 1) {
      urgency = 'Routine assessment';
    } else {
      urgency = 'Self-care / monitoring';
    }

    setResultUrgency(urgency);
  };

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Educational Safety Banner */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-900 dark:text-amber-200 leading-tight">
          <strong className="block font-bold">Educational Triage Simulator Only:</strong>
          This interactive module trains clinical decision-making. It does not diagnose or manage real human patients. In an emergency, dial 911/112 immediately.
        </div>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection List */
        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Emergency & Acute Assessment
            </span>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              Clinical Triage Protocols
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select presenting symptom to practice acuity classification & red flag detection.
            </p>
          </div>

          <div className="space-y-2.5">
            {TRIAGE_SCENARIOS_DATA.map(scenario => {
              const Icon = ICON_MAP[scenario.iconName] || Activity;

              return (
                <GlassCard
                  key={scenario.id}
                  onClick={() => startScenario(scenario)}
                  className="p-3.5 cursor-pointer hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        {scenario.complaintName}
                      </h3>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </GlassCard>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Scenario Evaluation */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedScenario(null)}
              className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Protocols</span>
            </button>
            <Badge variant="red" size="sm">{selectedScenario.complaintName}</Badge>
          </div>

          {!resultUrgency ? (
            <div className="space-y-4">
              {/* Basic Questions */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Step 1: Clinical Presentation
                </span>

                {selectedScenario.basicQuestions.map(q => (
                  <GlassCard key={q.id} className="p-3.5 space-y-2">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {q.question}
                    </h4>
                    <div className="space-y-1.5">
                      {q.options.map((opt, i) => {
                        const isSelected = basicAnswers[q.id] === opt.urgencyWeight;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              soundHaptics.tap();
                              setBasicAnswers({ ...basicAnswers, [q.id]: opt.urgencyWeight });
                            }}
                            className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-950 dark:text-cyan-200 font-semibold'
                                : 'bg-neutral-100/60 dark:bg-neutral-800/60 border-neutral-200/50 dark:border-white/5 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Red-Flag Checkpoints */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Step 2: Emergency Red-Flag Assessment
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedScenario.redFlags.map(rf => {
                    const isChecked = checkedRedFlagIds.includes(rf.id);
                    return (
                      <div
                        key={rf.id}
                        onClick={() => {
                          soundHaptics.tap();
                          setCheckedRedFlagIds(prev => 
                            isChecked ? prev.filter(id => id !== rf.id) : [...prev, rf.id]
                          );
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-red-500/15 border-red-500 text-red-950 dark:text-red-200' 
                            : 'bg-white/70 dark:bg-neutral-900/70 border-neutral-200/70 dark:border-white/5 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 accent-red-500 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-semibold leading-snug">{rf.question}</p>
                            {isChecked && (
                              <p className="text-[11px] text-red-700 dark:text-red-300 mt-1 font-normal italic">
                                ⚠️ {rf.warning}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <GlassButton
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleEvaluate}
              >
                Evaluate Urgency & Acuity &rarr;
              </GlassButton>
            </div>
          ) : (
            /* Result Assessment Card */
            <div className="space-y-4">
              <GlassCard
                variant="elevated"
                className={`p-5 text-center space-y-3 ${
                  resultUrgency === 'Emergency'
                    ? 'border-red-500/60 bg-red-500/10'
                    : resultUrgency === 'Urgent'
                    ? 'border-amber-500/60 bg-amber-500/10'
                    : 'border-cyan-500/40 bg-cyan-500/10'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                  {resultUrgency === 'Emergency' ? (
                    <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Triage Urgency Category
                  </span>
                  <h2 className={`text-2xl font-black mt-0.5 ${
                    resultUrgency === 'Emergency' ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {resultUrgency}
                  </h2>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-neutral-900/80 text-xs text-neutral-800 dark:text-neutral-200 text-left space-y-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white block">Triage Reasoning:</span>
                  <p className="leading-relaxed">
                    {resultUrgency === 'Emergency'
                      ? 'Patient exhibits cardinal red flags or hemodynamic vulnerability indicating risk of rapid physiological collapse. Immediate resuscitation bay transfer required.'
                      : resultUrgency === 'Urgent'
                      ? 'High symptom burden without overt shock. Requires formal clinician evaluation within 1-2 hours.'
                      : 'Hemodynamically stable. Suitable for outpatient workup or conservative watchful waiting.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 text-left">
                  <span className="font-bold text-neutral-900 dark:text-white block">Recommended Next Step:</span>
                  {resultUrgency === 'Emergency' ? (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      🚨 Transfer to Emergency Resuscitation Bay / Call 911 immediately.
                    </span>
                  ) : (
                    <span>Schedule outpatient consultation or monitor vitals at home.</span>
                  )}
                </div>

                <div className="pt-2">
                  <GlassButton
                    variant="glass"
                    fullWidth
                    onClick={() => {
                      setResultUrgency(null);
                      setBasicAnswers({});
                      setCheckedRedFlagIds([]);
                    }}
                  >
                    Reset & Re-triage Case
                  </GlassButton>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
