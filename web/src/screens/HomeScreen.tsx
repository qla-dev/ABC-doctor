import React from 'react';
import { 
  Flame, Clock, Target, ArrowRight, Sparkles, Activity, 
  HelpCircle, Layers, AlertTriangle, ShieldCheck, ChevronRight,
  TrendingUp, Award, BookOpen, Stethoscope
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { ProgressRing } from '../components/common/ProgressRing';
import { Badge } from '../components/common/Badge';
import { UserProgressState, Topic, NavigationTab } from '../types';
import { soundHaptics } from '../services/SoundHaptics';

interface HomeScreenProps {
  progress: UserProgressState;
  topics: Topic[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenTopic: (topicId: string) => void;
  onLaunchSimulator: (caseId?: string) => void;
  onStartQuiz: (mode: string, topicId?: string) => void;
  onInvokeAI: (prompt?: string, skillId?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  topics,
  onNavigate,
  onOpenTopic,
  onLaunchSimulator,
  onStartQuiz,
  onInvokeAI
}) => {
  const continueTopic = topics.find(t => t.id === 'ami') || topics[0];
  const recommendedTopic = topics.find(t => t.id === 'heart_failure') || topics[1];

  const dailyGoalPct = Math.min(100, Math.round((progress.todayMinutes / progress.dailyGoalMinutes) * 100));

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            Good afternoon, Dr. Candidate
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Ready to learn?
          </h1>
        </div>

        {/* Study Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span className="text-xs font-bold">{progress.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Daily Progress & Readiness Card */}
      <GlassCard variant="elevated" className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Daily Study Goal
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">{progress.todayMinutes}</span>
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">/ {progress.dailyGoalMinutes} min</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{dailyGoalPct}% accomplished today</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ProgressRing percentage={dailyGoalPct} size={68} strokeWidth={7} colorClassName="text-cyan-500">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{dailyGoalPct}%</span>
            </ProgressRing>

            <button
              onClick={() => onNavigate('progress')}
              className="p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="View detailed progress"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Prominent Quick Actions: AI Doctor & Patient Simulator */}
      <div className="grid grid-cols-2 gap-3">
        {/* AI Doctor Shortcut */}
        <GlassCard
          variant="accent"
          onClick={() => {
            soundHaptics.tap();
            onNavigate('ai');
          }}
          className="p-3.5 cursor-pointer hover:border-cyan-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <Badge variant="cyan" size="sm">Tutor</Badge>
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-cyan-500 transition-colors">
            AI Doctor
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
            Pathology & case queries
          </p>
        </GlassCard>

        {/* Patient Simulator Shortcut */}
        <GlassCard
          variant="default"
          onClick={() => {
            soundHaptics.tap();
            onLaunchSimulator('case_ami_58m');
          }}
          className="p-3.5 cursor-pointer hover:border-blue-400/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <Badge variant="blue" size="sm">Bedside</Badge>
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
            Patient Simulator
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
            Marcus Vance (58M)
          </p>
        </GlassCard>
      </div>

      {/* Secondary Fast Tools: Flashcards & Triage */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard
          onClick={() => {
            soundHaptics.tap();
            onNavigate('flashcards');
          }}
          className="p-3 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-900/90 transition-all flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">Flashcards</h4>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">12 Due Today</span>
          </div>
        </GlassCard>

        <GlassCard
          onClick={() => {
            soundHaptics.tap();
            onNavigate('triage');
          }}
          className="p-3 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-900/90 transition-all flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">Clinical Triage</h4>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">10 Scenarios</span>
          </div>
        </GlassCard>
      </div>

      {/* Continue Learning Card */}
      {continueTopic && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
              Continue Learning
            </span>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5"
            >
              Handbook <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <GlassCard
            onClick={() => onOpenTopic(continueTopic.id)}
            className="p-4 cursor-pointer hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="sm">{continueTopic.category}</Badge>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {continueTopic.readTimeMinutes} min
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                  {continueTopic.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {continueTopic.subtitle}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-1">
                <ProgressRing percentage={continueTopic.completionPercentage} size={44} strokeWidth={5} colorClassName="text-cyan-500">
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">
                    {continueTopic.completionPercentage}%
                  </span>
                </ProgressRing>
              </div>
            </div>

            {/* Resume button row */}
            <div className="mt-3 pt-3 border-t border-neutral-200/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
                Resume Pathophysiology section
              </span>
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Weak Topics Card */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-500/15 text-red-500 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Targeted Weak Topics
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500">Based on recent quizzes</span>
        </div>

        <div className="space-y-2">
          {progress.weakTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => onStartQuiz('weak')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/40 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{topic}</span>
              </div>
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">Practice &rarr;</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Quiz Result & Recommended Topic */}
      <div className="grid grid-cols-1 gap-3">
        {progress.recentQuizResult && (
          <GlassCard className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Recent Quiz Result</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{progress.recentQuizResult.topic}</h4>
              <span className="text-[11px] text-neutral-500">{progress.recentQuizResult.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {progress.recentQuizResult.score}%
                </span>
                <span className="block text-[9px] font-semibold text-neutral-400">Accuracy</span>
              </div>
              <GlassButton size="sm" variant="glass" onClick={() => onStartQuiz('quick')}>
                Retake
              </GlassButton>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Recommended Clinical Simulation */}
      <GlassCard
        onClick={() => onLaunchSimulator('case_appendicitis_24f')}
        className="p-4 cursor-pointer hover:border-amber-500/40 transition-all border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent"
      >
        <div className="flex items-center justify-between mb-1.5">
          <Badge variant="orange" size="sm">Recommended Simulation</Badge>
          <span className="text-[11px] text-neutral-500">OSCE Station</span>
        </div>
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
          Elena Rostova, 24F - Acute Migratory RLQ Pain
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
          Test clinical reasoning, ultrasound order sequencing, and avoiding surgical pitfalls.
        </p>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span>Start Simulation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </GlassCard>
    </div>
  );
};
