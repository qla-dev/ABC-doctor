import React from 'react';
import { 
  Award, Flame, Clock, CheckCircle2, Target, Layers, 
  Activity, TrendingUp, Sparkles, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { ProgressRing } from '../components/common/ProgressRing';
import { Badge } from '../components/common/Badge';
import { UserProgressState } from '../types';
import { soundHaptics } from '../services/SoundHaptics';

interface ProgressScreenProps {
  progress: UserProgressState;
  onBack: () => void;
  onDrillWeakTopic: (topicName: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  progress,
  onBack,
  onDrillWeakTopic
}) => {
  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundHaptics.tap();
            onBack();
          }}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <Badge variant="cyan" size="sm">Academic Analytics</Badge>
      </div>

      {/* Main Readiness Ring Card */}
      <GlassCard variant="elevated" className="p-5 text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          Estimated Clinical Readiness
        </span>

        <div className="py-2 flex justify-center">
          <ProgressRing percentage={progress.examReadinessPercentage} size={110} strokeWidth={10} colorClassName="text-cyan-500">
            <div className="text-center">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">{progress.examReadinessPercentage}%</span>
              <span className="block text-[9px] font-semibold text-neutral-400">Readiness</span>
            </div>
          </ProgressRing>
        </div>

        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
          On Track for Honors Pass
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          Your diagnostic accuracy in acute coronary and trauma modules places you above the 82nd percentile.
        </p>
      </GlassCard>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-white">{progress.streakDays} Days</div>
          <span className="text-[10px] text-emerald-500 font-semibold">Active Record</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Quiz Accuracy</span>
            <Target className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-white">{progress.quizAccuracyPercentage}%</div>
          <span className="text-[10px] text-neutral-400 font-medium">Over last 60 questions</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-white">{progress.topicsCompletedCount}</div>
          <span className="text-[10px] text-neutral-400 font-medium">Handbook articles</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Simulations</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-white">{progress.simulationsCompletedCount}</div>
          <span className="text-[10px] text-neutral-400 font-medium">Cases solved</span>
        </GlassCard>
      </div>

      {/* Spaced Repetition & Study Time Card */}
      <GlassCard className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-500" />
            Spaced Repetition Retention
          </span>
          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
            {progress.flashcardsReviewedCount} Cards Reviewed
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          SM-2 interval scheduling has prioritized 12 review cards due today.
        </p>
      </GlassCard>

      {/* Weak Areas Targeting */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Needs Immediate Reinforcement
            </h3>
          </div>
          <Badge variant="red" size="sm">Focus</Badge>
        </div>

        <div className="space-y-2">
          {progress.weakTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => onDrillWeakTopic(topic)}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 cursor-pointer transition-colors"
            >
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{topic}</span>
              <span className="text-[11px] font-bold text-cyan-500 flex items-center gap-0.5">
                Practice <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
