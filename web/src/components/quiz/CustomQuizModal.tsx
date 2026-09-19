import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { QuizConfig } from '../../types';
import { soundHaptics } from '../../services/SoundHaptics';

interface CustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomQuiz: (config: QuizConfig) => void;
}

export const CustomQuizModal: React.FC<CustomQuizModalProps> = ({
  isOpen,
  onClose,
  onStartCustomQuiz
}) => {
  const [topic, setTopic] = useState('All Topics');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('hard');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState<'all' | 'single' | 'multiple'>('all');
  const [timeLimit, setTimeLimit] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = () => {
    soundHaptics.tap();
    onStartCustomQuiz({
      mode: 'custom',
      difficulty,
      questionCount,
      questionType,
      timeLimitMinutes: timeLimit
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <GlassCard variant="elevated" className="w-full max-w-sm p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Custom Quiz Builder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Medical Specialty</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All Topics">All Specialties (USMLE Mix)</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Neurology">Neurology</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Target Difficulty</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  difficulty === diff
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Number of Questions</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[3, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  questionCount === num
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Question Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Question Format</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'all', label: 'Mixed' },
              { id: 'single', label: 'Single Best' },
              { id: 'multiple', label: 'Multi-Select' }
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setQuestionType(type.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  questionType === type.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
            Time Limit: <span className="text-cyan-500">{timeLimit} Minutes</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <GlassButton variant="primary" fullWidth size="lg" onClick={handleSubmit}>
          Create & Start Quiz
        </GlassButton>
      </GlassCard>
    </div>
  );
};
