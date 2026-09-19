import React, { useState } from 'react';
import { 
  ArrowLeft, RotateCw, Lightbulb, Bookmark, CheckCircle2, 
  Sparkles, Layers, ChevronRight, Check, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { FLASHCARD_DECKS_DATA, FLASHCARDS_DATA } from '../data/flashcardsData';
import { Flashcard, FlashcardDeck } from '../types';
import { soundHaptics } from '../services/SoundHaptics';
import { StorageService } from '../services/StorageService';

interface FlashcardsScreenProps {
  onBackToHome?: () => void;
}

export const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ onBackToHome }) => {
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [deckCards, setDeckCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startDeck = (deck: FlashcardDeck) => {
    soundHaptics.tap();
    const cards = FLASHCARDS_DATA.filter(c => c.deckId === deck.id);
    setSelectedDeck(deck);
    setDeckCards(cards.length > 0 ? cards : FLASHCARDS_DATA);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsCompleted(false);
  };

  const handleFlip = () => {
    soundHaptics.tap();
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    soundHaptics.tap();
    StorageService.recordFlashcardReview();

    if (currentIndex < deckCards.length - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
      }, 150);
    } else {
      setIsCompleted(true);
    }
  };

  const currentCard = deckCards[currentIndex];

  if (selectedDeck && isCompleted) {
    return (
      <div className="px-4 py-8 space-y-4">
        <GlassCard variant="elevated" className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Deck Completed
            </span>
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
              Spaced Repetition Updated
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              All {deckCards.length} high-yield cards in {selectedDeck.title} have been reviewed.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setSelectedDeck(null)}
            >
              Choose Another Deck
            </GlassButton>
            <GlassButton
              variant="glass"
              fullWidth
              onClick={() => startDeck(selectedDeck)}
            >
              Review Deck Again
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (selectedDeck && currentCard) {
    return (
      <div className="min-h-full pb-20">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-20 px-4 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/60 dark:border-white/10 flex items-center justify-between">
          <button
            onClick={() => setSelectedDeck(null)}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Decks</span>
          </button>

          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {currentIndex + 1} of {deckCards.length}
          </span>

          <Badge variant="purple" size="sm">
            SM-2 Spaced Repetition
          </Badge>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Card Meta Bar */}
          <div className="flex items-center justify-between">
            <Badge variant="neutral" size="sm">{currentCard.topicTitle}</Badge>
            {currentCard.clinicalHint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`text-xs flex items-center gap-1 font-semibold transition-colors ${
                  showHint ? 'text-amber-500' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}
          </div>

          {/* Optional Hint Banner */}
          {showHint && currentCard.clinicalHint && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200"
            >
              💡 <span className="font-semibold">Hint:</span> {currentCard.clinicalHint}
            </motion.div>
          )}

          {/* Interactive 3D Flip Flashcard */}
          <div className="perspective-1000">
            <div
              onClick={handleFlip}
              className={`relative min-h-[300px] w-full rounded-3xl p-6 cursor-pointer select-none transition-transform duration-500 transform-style-3d border shadow-xl flex flex-col justify-between ${
                isFlipped
                  ? 'rotate-y-180 bg-cyan-950/20 dark:bg-cyan-950/40 border-cyan-500/40 text-neutral-900 dark:text-white'
                  : 'bg-white/80 dark:bg-neutral-900/80 border-neutral-200/80 dark:border-white/10 text-neutral-900 dark:text-white'
              }`}
            >
              {!isFlipped ? (
                /* Front View */
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
                      Prompt / Question
                    </span>
                    <RotateCw className="w-3.5 h-3.5 text-neutral-400" />
                  </div>

                  <p className="text-base font-bold text-neutral-900 dark:text-white leading-relaxed my-auto text-center">
                    {currentCard.frontPrompt}
                  </p>

                  <div className="text-center pt-2">
                    <span className="text-[11px] font-semibold text-neutral-400">
                      Tap card to reveal answer
                    </span>
                  </div>
                </div>
              ) : (
                /* Back View */
                <div className="flex-1 flex flex-col justify-between space-y-4 rotate-y-180">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                      Clinical Answer & Mechanism
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="text-xs sm:text-sm font-medium leading-relaxed my-auto space-y-2 whitespace-pre-line text-neutral-800 dark:text-neutral-100">
                    {currentCard.backAnswer}
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[10px] font-semibold text-neutral-400">
                      Select review interval below
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SM-2 Spaced Repetition Buttons */}
          {isFlipped ? (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
                Spaced Repetition Grading
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRateCard('again')}
                  className="p-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-600 dark:text-red-400 text-center transition-all cursor-pointer"
                >
                  <span className="block text-xs font-bold">Again</span>
                  <span className="block text-[9px] opacity-75">&lt; 10m</span>
                </button>

                <button
                  onClick={() => handleRateCard('hard')}
                  className="p-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-center transition-all cursor-pointer"
                >
                  <span className="block text-xs font-bold">Hard</span>
                  <span className="block text-[9px] opacity-75">1 day</span>
                </button>

                <button
                  onClick={() => handleRateCard('good')}
                  className="p-2.5 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-center transition-all cursor-pointer"
                >
                  <span className="block text-xs font-bold">Good</span>
                  <span className="block text-[9px] opacity-75">3 days</span>
                </button>

                <button
                  onClick={() => handleRateCard('easy')}
                  className="p-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center transition-all cursor-pointer"
                >
                  <span className="block text-xs font-bold">Easy</span>
                  <span className="block text-[9px] opacity-75">7 days</span>
                </button>
              </div>
            </div>
          ) : (
            <GlassButton
              variant="glass"
              fullWidth
              size="lg"
              onClick={handleFlip}
              icon={<RotateCw className="w-4 h-4 text-cyan-500" />}
            >
              Reveal Answer
            </GlassButton>
          )}
        </div>
      </div>
    );
  }

  /* Deck Selector View */
  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          Spaced Repetition
        </span>
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
          Flashcard Decks
        </h1>
      </div>

      {/* Decks Grid */}
      <div className="space-y-3">
        {FLASHCARD_DECKS_DATA.map(deck => (
          <GlassCard
            key={deck.id}
            onClick={() => startDeck(deck)}
            className="p-4 cursor-pointer hover:border-purple-500/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1 pr-3">
              <Badge variant="purple" size="sm">{deck.category}</Badge>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-purple-500 transition-colors">
                {deck.title}
              </h3>
              <p className="text-xs text-neutral-500">
                {deck.cardCount} total cards · <span className="text-purple-600 dark:text-purple-400 font-semibold">{deck.dueTodayCount} due today</span>
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-black text-neutral-700 dark:text-neutral-300">{deck.masteryPercentage}%</span>
                <span className="block text-[9px] text-neutral-400">Mastery</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
