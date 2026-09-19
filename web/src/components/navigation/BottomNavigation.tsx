import React from 'react';
import { Home, BookOpen, HelpCircle, Activity, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { NavigationTab } from '../../types';
import { soundHaptics } from '../../services/SoundHaptics';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  quizDueBadge?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  quizDueBadge
}) => {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'library' as NavigationTab, label: 'Handbook', icon: BookOpen },
    { id: 'quiz' as NavigationTab, label: 'Quiz', icon: HelpCircle, badge: quizDueBadge },
    { id: 'simulator' as NavigationTab, label: 'Simulator', icon: Activity },
    { id: 'ai' as NavigationTab, label: 'AI Doctor', icon: Sparkles, highlight: true }
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="w-full max-w-[390px] px-2 py-1.5 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex items-center justify-between"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              soundHaptics.tap();
              onSelectTab(tab.id);
            }}
            className="relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full transition-colors cursor-pointer select-none"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 border border-cyan-500/30"
              />
            )}

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 scale-110'
                      : tab.highlight
                      ? 'text-purple-500 dark:text-purple-400'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[14px] h-[14px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-700 dark:text-cyan-300 font-bold'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};
