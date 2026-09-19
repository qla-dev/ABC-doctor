import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeTabTitle?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  bottomNav,
  theme,
  onToggleTheme,
  activeTabTitle
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${hours}:${formattedMins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`h-full w-full flex items-center justify-center p-0 sm:p-4 md:p-6 transition-colors duration-300 overflow-hidden select-none ${
      theme === 'dark' 
        ? 'bg-[#06090e] text-neutral-100' 
        : 'bg-neutral-100 text-neutral-900'
    }`}>
      {/* Background ambient lighting for desktop presentation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      {/* Main iPhone Device Container */}
      <div className={`relative w-full h-full sm:h-[860px] sm:max-h-[92vh] sm:max-w-[412px] sm:rounded-[50px] sm:border-[8px] sm:border-neutral-900/90 dark:sm:border-neutral-800/90 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-[#090d16] ring-1 ring-white/10'
          : 'bg-[#f8fafc] ring-1 ring-black/5'
      }`}>
        {/* Top App Header / Status Bar */}
        <div className="relative z-30 shrink-0 h-12 pt-2 sm:pt-2.5 px-4 sm:px-6 flex items-center justify-between select-none text-xs font-semibold tracking-tight border-b border-black/[0.03] dark:border-white/[0.04]">
          {/* Mobile Brand / Desktop Clock */}
          <div className="flex items-center gap-2">
            <span className="w-12 text-left font-medium text-neutral-800 dark:text-neutral-200 hidden sm:inline-block">
              {currentTime}
            </span>
            <div className="sm:hidden flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white">ABC Doktori</span>
            </div>
          </div>

          {/* Dynamic Island Capsule (Desktop frame) */}
          <div className="hidden sm:flex h-6 px-3 rounded-full bg-neutral-900 dark:bg-black text-white items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium tracking-tight text-neutral-300">ABC Doktori</span>
          </div>

          {/* Theme Switch & Indicators */}
          <div className="flex items-center justify-end gap-2 text-neutral-700 dark:text-neutral-300">
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-1.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800/70 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-500">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Scrollable Mobile Viewport - Only content scrolls */}
        <div className="relative flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
          {children}
        </div>

        {/* Floating Liquid Glass Bottom Navigation - Firmly pinned above home indicator */}
        {bottomNav && (
          <div className="absolute bottom-4 sm:bottom-5 left-3 right-3 z-30 pointer-events-auto flex justify-center">
            {bottomNav}
          </div>
        )}

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1 left-0 right-0 h-3 flex items-center justify-center pointer-events-none z-40">
          <div className="w-32 h-1 rounded-full bg-neutral-400/40 dark:bg-white/30 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
};
