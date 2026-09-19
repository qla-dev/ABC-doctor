import React, { useState } from 'react';
import { 
  HelpCircle, Zap, BookOpen, Clock, Target, Sliders, 
  Sparkles, Award, ChevronRight, Play, CheckCircle2 
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { CustomQuizModal } from '../components/quiz/CustomQuizModal';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { QUIZ_QUESTIONS_DATA } from '../data/quizzesData';
import { QuizQuestion, QuizConfig } from '../types';
import { soundHaptics } from '../services/SoundHaptics';

interface QuizScreenProps {
  onAskAIAboutQuestion?: (question: QuizQuestion) => void;
  onGenerateAIQuiz?: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  onAskAIAboutQuestion,
  onGenerateAIQuiz
}) => {
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const startQuickQuiz = () => {
    soundHaptics.tap();
    setActiveQuizTitle('Rapid USMLE High-Yield');
    setActiveQuizQuestions(QUIZ_QUESTIONS_DATA.slice(0, 3));
  };

  const startExamMode = () => {
    soundHaptics.tap();
    setActiveQuizTitle('Step 1 & 2 Clinical Exam Mode');
    setActiveQuizQuestions([...QUIZ_QUESTIONS_DATA].sort(() => 0.5 - Math.random()));
  };

  const startWeakAreasQuiz = () => {
    soundHaptics.tap();
    setActiveQuizTitle('Weak Areas: ACS & Heart Failure');
    setActiveQuizQuestions(QUIZ_QUESTIONS_DATA.filter(q => q.category === 'Cardiology'));
  };

  const handleCustomQuiz = (config: QuizConfig) => {
    let pool = [...QUIZ_QUESTIONS_DATA];
    if (config.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === config.difficulty);
      if (pool.length === 0) pool = QUIZ_QUESTIONS_DATA;
    }
    setActiveQuizTitle(`Custom Quiz (${config.difficulty} · ${config.questionCount} Qs)`);
    setActiveQuizQuestions(pool.slice(0, config.questionCount));
  };

  if (activeQuizQuestions) {
    return (
      <QuizPlayer
        questions={activeQuizQuestions}
        quizTitle={activeQuizTitle}
        onExit={() => setActiveQuizQuestions(null)}
        onAskAIAboutQuestion={onAskAIAboutQuestion}
      />
    );
  }

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Assessment Center
          </span>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Clinical Quiz Engine
          </h1>
        </div>

        <GlassButton
          size="sm"
          variant="glass"
          icon={<Sliders className="w-3.5 h-3.5 text-cyan-500" />}
          onClick={() => setIsCustomModalOpen(true)}
        >
          Custom
        </GlassButton>
      </div>

      {/* Hero Mode: Quick Rapid Fire */}
      <GlassCard
        variant="accent"
        onClick={startQuickQuiz}
        className="p-4 cursor-pointer hover:border-cyan-400/60 transition-all border-cyan-500/30"
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="cyan" size="sm">Rapid Mode</Badge>
          <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> 3 High-Yield Qs
          </span>
        </div>

        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
          Quick Quiz Session
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Bite-sized clinical vignettes with full rationale breakdowns and board pearls.
        </p>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <span>Start Instant Practice</span>
          <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center">
            <Play className="w-3 h-3 fill-white ml-0.5" />
          </div>
        </div>
      </GlassCard>

      {/* Quiz Modes Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Exam Mode */}
        <GlassCard
          onClick={startExamMode}
          className="p-3.5 cursor-pointer hover:border-neutral-400 dark:hover:border-white/20 transition-all space-y-1.5"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Exam Simulation</h4>
          <p className="text-[11px] text-neutral-500 line-clamp-2">
            Timed blocks modeled after USMLE Step 1/2 CK.
          </p>
        </GlassCard>

        {/* Weak Areas Mode */}
        <GlassCard
          onClick={startWeakAreasQuiz}
          className="p-3.5 cursor-pointer hover:border-neutral-400 dark:hover:border-white/20 transition-all space-y-1.5"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Weak Areas</h4>
          <p className="text-[11px] text-neutral-500 line-clamp-2">
            Reinforce cardiology & acid-base gaps.
          </p>
        </GlassCard>
      </div>

      {/* AI Generated Adaptive Quiz */}
      <GlassCard
        onClick={() => {
          soundHaptics.tap();
          if (onGenerateAIQuiz) onGenerateAIQuiz();
        }}
        className="p-4 cursor-pointer hover:border-purple-400/50 transition-all border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-transparent"
      >
        <div className="flex items-center justify-between mb-1.5">
          <Badge variant="purple" size="sm">GenAI Engine</Badge>
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
          Generate Adaptive AI Quiz
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Have the Medical AI Tutor synthesize brand-new, customized case vignettes on your requested topic.
        </p>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
          <span>Synthesize Questions</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </GlassCard>

      {/* Specialty Drill Decks */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
          Specialty Question Banks
        </h3>

        {[
          { name: 'Cardiology & Hemodynamics', count: 18, accuracy: '89%' },
          { name: 'Emergency & Critical Care', count: 15, accuracy: '82%' },
          { name: 'Gastroenterology & Surgery', count: 12, accuracy: '74%' }
        ].map((bank, i) => (
          <GlassCard
            key={i}
            onClick={() => {
              soundHaptics.tap();
              setActiveQuizTitle(bank.name);
              setActiveQuizQuestions(QUIZ_QUESTIONS_DATA);
            }}
            className="p-3.5 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-900/90 transition-all flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{bank.name}</h4>
              <span className="text-[11px] text-neutral-500">{bank.count} questions available</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{bank.accuracy}</span>
              <span className="block text-[9px] text-neutral-400">Past Avg</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <CustomQuizModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onStartCustomQuiz={handleCustomQuiz}
      />
    </div>
  );
};
