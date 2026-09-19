/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PhoneFrame } from './components/common/PhoneFrame';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeScreen } from './screens/HomeScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { TopicDetailView } from './components/library/TopicDetailView';
import { QuizScreen } from './screens/QuizScreen';
import { FlashcardsScreen } from './screens/FlashcardsScreen';
import { PatientSimulatorScreen } from './screens/PatientSimulatorScreen';
import { TriageScreen } from './screens/TriageScreen';
import { AIScreen } from './screens/AIScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { TOPICS_DATA } from './data/topicsData';
import { StorageService } from './services/StorageService';
import { NavigationTab, ThemeMode, Topic } from './types';
import { soundHaptics } from './services/SoundHaptics';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [aiSkillId, setAiSkillId] = useState<string | undefined>(undefined);
  const [simulatorCaseId, setSimulatorCaseId] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState(() => StorageService.getProgress());

  // Keep progress fresh
  useEffect(() => {
    const handleStorageChange = () => {
      setProgress(StorageService.getProgress());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync Tailwind dark mode class on document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    soundHaptics.tap();
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenTopic = (topicId: string) => {
    soundHaptics.tap();
    setActiveTopicId(topicId);
    setActiveTab('library');
  };

  const handleInvokeAIFromArticle = (
    actionType: 'explain_simply' | 'explain_depth' | 'quiz_me' | 'create_flashcards' | 'clinical_case' | 'summarize',
    topic: Topic
  ) => {
    soundHaptics.tap();
    let prompt = '';
    let skillId = 'medical_tutor';

    switch (actionType) {
      case 'explain_simply':
        prompt = `Explain ${topic.title} simply for a junior medical student. Include the core pathophysiologic mechanism and key signs.`;
        skillId = 'medical_tutor';
        break;
      case 'explain_depth':
        prompt = `Explain ${topic.title} in deep clinical detail: hemodynamics, cellular molecular pathophysiology, diagnostic criteria, and guidelines.`;
        skillId = 'medical_tutor';
        break;
      case 'quiz_me':
        prompt = `Generate a high-yield USMLE Step 2 clinical question testing diagnostic or management pitfalls in ${topic.title}.`;
        skillId = 'quiz_generator';
        break;
      case 'create_flashcards':
        prompt = `Create 3 high-yield spaced repetition flashcards for ${topic.title} with prompt, answer, and clinical hint.`;
        skillId = 'flashcard_generator';
        break;
      case 'clinical_case':
        prompt = `Present an authentic clinical case of ${topic.title} with age, presentation, vitals, and physical examination.`;
        skillId = 'clinical_case';
        break;
      case 'summarize':
        prompt = `Summarize the high-yield board pearls, acute emergency management, and contraindications for ${topic.title}.`;
        skillId = 'medical_tutor';
        break;
    }

    setAiPrompt(prompt);
    setAiSkillId(skillId);
    setActiveTopicId(null);
    setActiveTab('ai');
  };

  const handleStartQuizForTopic = (topicId: string) => {
    soundHaptics.tap();
    setActiveTopicId(null);
    setActiveTab('quiz');
  };

  const handleLaunchSimulator = (caseId?: string) => {
    soundHaptics.tap();
    setSimulatorCaseId(caseId);
    setActiveTopicId(null);
    setActiveTab('simulator');
  };

  const activeTopic = activeTopicId ? TOPICS_DATA.find(t => t.id === activeTopicId) : null;

  return (
    <PhoneFrame
      theme={theme}
      onToggleTheme={handleToggleTheme}
      activeTabTitle={activeTab}
      bottomNav={
        !activeTopic ? (
          <BottomNavigation
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTopicId(null);
              setActiveTab(tab);
            }}
            quizDueBadge={3}
          />
        ) : undefined
      }
    >
      {/* Screen Router */}
      <div className="relative min-h-full">
        {activeTab === 'home' && (
          <HomeScreen
            progress={progress}
            topics={TOPICS_DATA}
            onNavigate={(tab) => {
              setActiveTopicId(null);
              setActiveTab(tab);
            }}
            onOpenTopic={handleOpenTopic}
            onLaunchSimulator={handleLaunchSimulator}
            onStartQuiz={(mode) => {
              setActiveTab('quiz');
            }}
            onInvokeAI={(prompt, skillId) => {
              setAiPrompt(prompt);
              setAiSkillId(skillId);
              setActiveTab('ai');
            }}
          />
        )}

        {activeTab === 'library' && (
          activeTopic ? (
            <TopicDetailView
              topic={activeTopic}
              onBack={() => setActiveTopicId(null)}
              onInvokeAI={handleInvokeAIFromArticle}
              onStartQuizForTopic={handleStartQuizForTopic}
              onLaunchSimulatorForTopic={(tId) => handleLaunchSimulator('case_ami_58m')}
              onSelectRelatedTopic={handleOpenTopic}
            />
          ) : (
            <LibraryScreen
              topics={TOPICS_DATA}
              onSelectTopic={handleOpenTopic}
            />
          )
        )}

        {activeTab === 'quiz' && (
          <QuizScreen
            onAskAIAboutQuestion={(q) => {
              setAiPrompt(`Explain the clinical reasoning for this question on ${q.topicTitle}: "${q.question}" — why the correct answer is right and why the distractors are incorrect.`);
              setAiSkillId('medical_tutor');
              setActiveTab('ai');
            }}
            onGenerateAIQuiz={() => {
              setAiPrompt('Generate 3 USMLE Step 2 clinical vignette questions on Acute Coronary Syndromes and Heart Failure GDMT with full explanations.');
              setAiSkillId('quiz_generator');
              setActiveTab('ai');
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <PatientSimulatorScreen
            initialCaseId={simulatorCaseId}
            onAskAI={(prompt, skillId) => {
              setAiPrompt(prompt);
              setAiSkillId(skillId);
              setActiveTab('ai');
            }}
          />
        )}

        {activeTab === 'ai' && (
          <AIScreen
            initialPrompt={aiPrompt}
            initialSkillId={aiSkillId || 'medical_tutor'}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsScreen
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'triage' && (
          <TriageScreen />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            progress={progress}
            onBack={() => setActiveTab('home')}
            onDrillWeakTopic={(topic) => {
              setActiveTab('quiz');
            }}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
