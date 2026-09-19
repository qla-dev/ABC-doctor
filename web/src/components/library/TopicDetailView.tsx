import React, { useState } from 'react';
import { 
  ArrowLeft, Bookmark, Sparkles, HelpCircle, Layers, 
  Stethoscope, FileText, Share2, CheckCircle2, AlertCircle, 
  Star, Clock, ChevronRight, MessageSquare, Zap, BookOpen, Edit3, Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { Badge } from '../common/Badge';
import { Topic } from '../../types';
import { StorageService } from '../../services/StorageService';
import { soundHaptics } from '../../services/SoundHaptics';

interface TopicDetailViewProps {
  topic: Topic;
  onBack: () => void;
  onInvokeAI: (actionType: 'explain_simply' | 'explain_depth' | 'quiz_me' | 'create_flashcards' | 'clinical_case' | 'summarize', topic: Topic) => void;
  onStartQuizForTopic: (topicId: string) => void;
  onLaunchSimulatorForTopic: (topicId: string) => void;
  onSelectRelatedTopic: (topicId: string) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  onBack,
  onInvokeAI,
  onStartQuizForTopic,
  onLaunchSimulatorForTopic,
  onSelectRelatedTopic
}) => {
  const [isBookmarked, setIsBookmarked] = useState(topic.isBookmarked);
  const [activeTab, setActiveTab] = useState<'article' | 'notes'>('article');
  const [noteText, setNoteText] = useState(() => StorageService.getTopicNote(topic.id));
  const [isSavedNote, setIsSavedNote] = useState(false);

  const handleToggleBookmark = () => {
    soundHaptics.tap();
    const newStatus = StorageService.toggleBookmark(topic.id);
    setIsBookmarked(newStatus);
  };

  const handleSaveNote = () => {
    soundHaptics.tap();
    StorageService.saveTopicNote(topic.id, noteText);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  return (
    <div className="min-h-full pb-20">
      {/* Sticky iOS Navigation Bar */}
      <div className="sticky top-0 z-20 px-4 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/60 dark:border-white/10 flex items-center justify-between">
        <button
          onClick={() => {
            soundHaptics.tap();
            onBack();
          }}
          className="flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Handbook</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                isBookmarked ? 'fill-cyan-500 text-cyan-500' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'article' ? 'notes' : 'article')}
            className={`p-2 rounded-full transition-colors ${
              activeTab === 'notes' ? 'bg-cyan-500/20 text-cyan-500' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'
            }`}
            title="My Notes"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Header Title Section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm">{topic.category}</Badge>
            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {topic.readTimeMinutes} min read
            </span>
            <div className="flex items-center text-amber-500 ml-auto text-xs">
              {Array.from({ length: topic.highYieldRating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] ml-1 font-semibold text-neutral-400">High Yield</span>
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {topic.title}
          </h1>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {topic.subtitle}
          </p>
        </div>

        {/* Quick Action Floating Ribbon (Apple Books style action shortcuts) */}
        <div className="overflow-x-auto no-scrollbar py-1 flex items-center gap-2">
          <GlassButton
            size="sm"
            variant="primary"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => onInvokeAI('explain_simply', topic)}
          >
            Explain simply
          </GlassButton>
          <GlassButton
            size="sm"
            variant="glass"
            icon={<Zap className="w-3.5 h-3.5 text-cyan-500" />}
            onClick={() => onInvokeAI('explain_depth', topic)}
          >
            Explain in depth
          </GlassButton>
          <GlassButton
            size="sm"
            variant="glass"
            icon={<HelpCircle className="w-3.5 h-3.5 text-blue-500" />}
            onClick={() => onStartQuizForTopic(topic.id)}
          >
            Quiz me
          </GlassButton>
          <GlassButton
            size="sm"
            variant="glass"
            icon={<Layers className="w-3.5 h-3.5 text-purple-500" />}
            onClick={() => onInvokeAI('create_flashcards', topic)}
          >
            Create flashcards
          </GlassButton>
          <GlassButton
            size="sm"
            variant="glass"
            icon={<Stethoscope className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={() => onLaunchSimulatorForTopic(topic.id)}
          >
            Clinical case
          </GlassButton>
        </div>

        {activeTab === 'notes' ? (
          /* Notes Screen */
          <GlassCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-cyan-500" />
                Personal Clinical Notes
              </h3>
              {isSavedNote && (
                <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
            <textarea
              rows={8}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your own high-yield mnemonics, ward pearls, or rotation notes..."
              className="w-full p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-white/10 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
            />
            <GlassButton variant="primary" size="sm" onClick={handleSaveNote} fullWidth>
              Save Notes
            </GlassButton>
          </GlassCard>
        ) : (
          /* Main Article Sections */
          <div className="space-y-4">
            {/* Overview & Definitions */}
            <GlassCard className="p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                1. Overview & Formal Definition
              </h3>
              <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
                {topic.overview}
              </p>
              <div className="p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/15">
                <p className="text-xs italic text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 not-italic">Diagnostic Definition: </span>
                  {topic.definitions}
                </p>
              </div>
            </GlassCard>

            {/* Mechanisms & Pathophysiology */}
            <GlassCard className="p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                2. Mechanisms & Cellular Pathophysiology
              </h3>
              <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
                {topic.mechanisms}
              </p>
            </GlassCard>

            {/* Clinical Presentation */}
            <GlassCard className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                3. Clinical Presentation & Physical Signs
              </h3>
              
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                  Cardinal Symptoms:
                </span>
                <ul className="space-y-1.5">
                  {topic.clinicalPresentation.symptoms.map((sym, i) => (
                    <li key={i} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                  Physical Exam Findings:
                </span>
                <ul className="space-y-1.5">
                  {topic.clinicalPresentation.physicalSigns.map((sign, i) => (
                    <li key={i} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {topic.clinicalPresentation.triadsOrPeculiarities && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-bold block mb-0.5">High-Yield Clinical Triad / Sign:</span>
                  {topic.clinicalPresentation.triadsOrPeculiarities}
                </div>
              )}
            </GlassCard>

            {/* Diagnosis & Diagnostic Workup */}
            <GlassCard className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                4. Diagnosis & Gold-Standard Testing
              </h3>
              <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                {topic.diagnosis.criteria}
              </p>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-1">
                  First-Line Laboratory Investigations:
                </span>
                <ul className="space-y-1">
                  {topic.diagnosis.firstLineLabs.map((lab, i) => (
                    <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{lab}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-white/5">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 block">Gold Standard Imaging:</span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">{topic.diagnosis.imagingGoldStandard}</span>
              </div>
            </GlassCard>

            {/* Treatment & Management */}
            <GlassCard className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                5. Acute & Long-Term Management
              </h3>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                  Acute Emergency Protocol:
                </span>
                {topic.treatment.acuteManagement.map((step, i) => (
                  <div key={i} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2 bg-neutral-50 dark:bg-neutral-900/40 p-2 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>

              {topic.treatment.contraindications && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Critical Contraindications:
                  </span>
                  {topic.treatment.contraindications.map((contra, i) => (
                    <p key={i} className="text-[11px] text-red-800 dark:text-red-300 leading-snug">
                      • {contra}
                    </p>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Clinical Pearls & Key Points */}
            <GlassCard variant="accent" className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  High-Yield Clinical Pearls
                </h3>
              </div>

              <div className="space-y-2">
                {topic.clinicalPearls.map((pearl, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-white/5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                    💡 {pearl}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Interactive Bottom Actions */}
            <div className="pt-2 space-y-2">
              <GlassButton
                variant="primary"
                fullWidth
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => onInvokeAI('summarize', topic)}
              >
                Summarize with AI Doctor
              </GlassButton>
              <GlassButton
                variant="glass"
                fullWidth
                icon={<HelpCircle className="w-4 h-4 text-cyan-500" />}
                onClick={() => onStartQuizForTopic(topic.id)}
              >
                Test Knowledge with Quiz
              </GlassButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
