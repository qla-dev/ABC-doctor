import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, HelpCircle, Sparkles, 
  ArrowRight, RotateCcw, Award, Check, Clock, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { Badge } from '../common/Badge';
import { QuizQuestion, QuizResultRecord } from '../../types';
import { soundHaptics } from '../../services/SoundHaptics';
import { StorageService } from '../../services/StorageService';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  quizTitle: string;
  onExit: () => void;
  onAskAIAboutQuestion?: (question: QuizQuestion) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  questions,
  quizTitle,
  onExit,
  onAskAIAboutQuestion
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  const currentQuestion = questions[currentIndex];
  const isMultiple = currentQuestion?.isMultipleCorrect ?? false;

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundHaptics.tap();

    if (isMultiple) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter(id => id !== optionId));
      } else {
        setSelectedOptionIds([...selectedOptionIds, optionId]);
      }
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIds.length === 0 || isAnswerSubmitted) return;

    const correctOptionIds = currentQuestion.options.filter(o => o.isCorrect).map(o => o.id);
    const isCorrect = 
      correctOptionIds.length === selectedOptionIds.length &&
      correctOptionIds.every(id => selectedOptionIds.includes(id));

    if (isCorrect) {
      soundHaptics.correct();
      setScore(s => s + 1);
    } else {
      soundHaptics.incorrect();
    }

    setUserAnswers(prev => [...prev, { questionId: currentQuestion.id, isCorrect }]);
    setIsAnswerSubmitted(true);
  };

  const handleNext = () => {
    soundHaptics.tap();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOptionIds([]);
      setIsAnswerSubmitted(false);
    } else {
      // Complete quiz
      setIsCompleted(true);
      const finalScorePct = Math.round(((score + (isCurrentCorrect() ? 1 : 0)) / questions.length) * 100);
      StorageService.recordQuizCompletion(quizTitle, finalScorePct, score, questions.length);

      if (finalScorePct >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const isCurrentCorrect = () => {
    const correctOptionIds = currentQuestion.options.filter(o => o.isCorrect).map(o => o.id);
    return (
      correctOptionIds.length === selectedOptionIds.length &&
      correctOptionIds.every(id => selectedOptionIds.includes(id))
    );
  };

  if (!currentQuestion) return null;

  if (isCompleted) {
    const finalScorePct = Math.round((score / questions.length) * 100);
    return (
      <div className="px-4 py-6 space-y-5">
        <GlassCard variant="elevated" className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Quiz Completed
            </span>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              {finalScorePct >= 80 ? 'Mastery Achieved!' : finalScorePct >= 60 ? 'Solid Clinical Effort' : 'Needs Reinforcement'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              You scored <span className="font-bold text-neutral-900 dark:text-white">{score} out of {questions.length}</span> ({finalScorePct}%) on {quizTitle}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Correct</span>
              <span className="text-xl font-black text-emerald-500">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Incorrect</span>
              <span className="text-xl font-black text-red-500">{questions.length - score}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={onExit}
            >
              Return to Quizzes
            </GlassButton>
            <GlassButton
              variant="glass"
              fullWidth
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOptionIds([]);
                setIsAnswerSubmitted(false);
                setScore(0);
                setIsCompleted(false);
                setUserAnswers([]);
              }}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Quiz
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20">
      {/* Top Header with Progress */}
      <div className="sticky top-0 z-20 px-4 py-2.5 backdrop-blur-xl bg-white/85 dark:bg-neutral-900/85 border-b border-neutral-200/60 dark:border-white/10 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-20 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Badge variant={currentQuestion.difficulty === 'hard' ? 'red' : 'cyan'} size="sm">
          {currentQuestion.difficulty}
        </Badge>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Clinical Vignette */}
        <GlassCard className="p-4 space-y-2.5 border-neutral-200/80 dark:border-white/10">
          <div className="flex items-center justify-between">
            <Badge variant="blue" size="sm">{currentQuestion.category}</Badge>
            {isMultiple && (
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Multi-Select Question
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal">
            {currentQuestion.vignette}
          </p>

          <div className="pt-2 border-t border-neutral-200/50 dark:border-white/5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
              {currentQuestion.question}
            </h4>
          </div>
        </GlassCard>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, index) => {
            const isSelected = selectedOptionIds.includes(opt.id);
            let stateStyle = 'bg-white/80 dark:bg-neutral-900/80 border-neutral-200/80 dark:border-white/10';

            if (isAnswerSubmitted) {
              if (opt.isCorrect) {
                stateStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200';
              } else if (isSelected && !opt.isCorrect) {
                stateStyle = 'bg-red-500/15 border-red-500 text-red-950 dark:text-red-200';
              } else {
                stateStyle = 'opacity-50 border-neutral-200/40 dark:border-white/5';
              }
            } else if (isSelected) {
              stateStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-100 shadow-sm';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${stateStyle}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isAnswerSubmitted && opt.isCorrect
                    ? 'bg-emerald-500 text-white'
                    : isAnswerSubmitted && isSelected
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-cyan-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug font-medium">
                    {opt.text}
                  </p>

                  {/* Post-submit explanation for this option */}
                  {isAnswerSubmitted && (
                    <p className={`text-[11px] mt-2 pt-2 border-t leading-relaxed ${
                      opt.isCorrect 
                        ? 'border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                        : 'border-red-500/20 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {opt.explanation}
                    </p>
                  )}
                </div>

                {isAnswerSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Clinical Pearl Card revealed after answering */}
        {isAnswerSubmitted && (
          <GlassCard variant="accent" className="p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High-Yield Board Pearl
              </span>
              {onAskAIAboutQuestion && (
                <button
                  onClick={() => onAskAIAboutQuestion(currentQuestion)}
                  className="text-[11px] font-semibold text-cyan-500 hover:underline"
                >
                  Ask AI Tutor &rarr;
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
              💡 {currentQuestion.highYieldPearl}
            </p>
          </GlassCard>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {!isAnswerSubmitted ? (
            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={selectedOptionIds.length === 0}
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </GlassButton>
          ) : (
            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
};
