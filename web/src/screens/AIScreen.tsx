import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Stethoscope, HelpCircle, Layers, 
  Activity, GraduationCap, AlertTriangle, ShieldCheck, 
  RotateCcw, User, Bot, Copy, Check
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { AIMessage } from '../types';
import { AIService } from '../services/AIService';
import { SKILL_METADATA } from '../skills/SkillRegistry';
import { soundHaptics } from '../services/SoundHaptics';

interface AIScreenProps {
  initialPrompt?: string;
  initialSkillId?: string;
}

export const AIScreen: React.FC<AIScreenProps> = ({
  initialPrompt,
  initialSkillId = 'medical_tutor'
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState(initialSkillId);
  const [inputQuery, setInputQuery] = useState(initialPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **ABC Doktori AI Educational Mentor**.\n\nI can break down complex medical mechanisms, generate Step 1/2 vignettes, test your differential reasoning, or act as an oral board examiner.\n\nSelect a specialized mode above or try one of the clinical drill prompts below.`,
      timestamp: 'Just now',
      skillId: 'medical_tutor'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Handle auto-send if initialPrompt was provided
  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendPrompt(initialPrompt, initialSkillId);
    }
  }, [initialPrompt]);

  const handleSendPrompt = async (promptToSend: string, skillIdToUse?: string) => {
    const text = promptToSend.trim();
    if (!text || isGenerating) return;

    soundHaptics.tap();
    const effectiveSkillId = skillIdToUse || selectedSkillId;

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      const response = await AIService.generateResponse(text, effectiveSkillId);
      soundHaptics.correct();

      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.markdownContent,
        timestamp: 'Just now',
        skillId: effectiveSkillId,
        clinicalPearl: response.clinicalPearl
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      soundHaptics.incorrect();
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while generating the educational response. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    soundHaptics.tap();
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickChips = [
    { label: 'Explain simply', prompt: 'Explain the pathophysiology and clinical hallmarks simply in high-yield terms.' },
    { label: 'Explain in depth', prompt: 'Explain the cellular mechanisms, hemodynamics, and diagnostic criteria in depth.' },
    { label: 'Clinical example', prompt: 'Give me a realistic USMLE Step 2 clinical case presentation and explain the key findings.' },
    { label: 'Quiz me', prompt: 'Quiz me with a difficult multi-step clinical question with 5 options.' },
    { label: 'Oral exam questions', prompt: 'Act as an attending physician and ask me 3 rigorous oral board questions.' }
  ];

  return (
    <div className="flex flex-col h-full min-h-[580px]">
      {/* Top Specialty Skill Selector */}
      <div className="shrink-0 px-4 pt-3 pb-2 space-y-2 border-b border-neutral-200/60 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h1 className="text-base font-extrabold text-neutral-900 dark:text-white">AI Doctor Tutor</h1>
          </div>
          <Badge variant="purple" size="sm">GenAI Clinical Engine</Badge>
        </div>

        {/* Horizontal Skill Badges */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-0.5 -mx-4 px-4">
          {SKILL_METADATA.map(skill => {
            const isSelected = selectedSkillId === skill.id;

            return (
              <button
                key={skill.id}
                onClick={() => {
                  soundHaptics.tap();
                  setSelectedSkillId(skill.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                {skill.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="shrink-0 px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900/60 text-[10px] text-neutral-500 dark:text-neutral-400 text-center border-b border-neutral-200/40 dark:border-white/5">
        🔒 For medical education & OSCE training only. Not a licensed physician.
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500 text-white font-medium rounded-br-sm shadow-sm'
                    : 'bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-white/10 text-neutral-800 dark:text-neutral-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-normal">
                  {msg.content}
                </div>

                {msg.clinicalPearl && (
                  <div className="mt-2.5 pt-2 border-t border-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold">
                    💡 <span className="underline">High-Yield Pearl:</span> {msg.clinicalPearl}
                  </div>
                )}

                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-neutral-200/40 dark:border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="hover:text-neutral-600 dark:hover:text-neutral-200 flex items-center gap-1"
                    >
                      {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-white/10 text-xs text-neutral-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>Formulating clinical synthesis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Ribbon */}
      <div className="shrink-0 px-4 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-t border-neutral-200/40 dark:border-white/5">
        {quickChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleSendPrompt(chip.prompt)}
            className="px-2.5 py-1 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Field Bar */}
      <div className="shrink-0 p-3 pb-20 bg-white/75 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200/60 dark:border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about pathology, drugs, vignettes, or ECGs..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isGenerating}
            className="p-2.5 rounded-2xl bg-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
