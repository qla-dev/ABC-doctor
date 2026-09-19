import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, Star, Bookmark, Filter, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { ProgressRing } from '../components/common/ProgressRing';
import { Topic, MedicalCategory } from '../types';
import { soundHaptics } from '../services/SoundHaptics';

interface LibraryScreenProps {
  topics: Topic[];
  onSelectTopic: (topicId: string) => void;
}

const CATEGORIES: MedicalCategory[] = [
  'Cardiology',
  'Internal Medicine',
  'Emergency Medicine',
  'Neurology',
  'Surgery',
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pathology',
  'Pharmacology',
  'Microbiology',
  'Immunology',
  'Pediatrics',
  'Dermatology',
  'Psychiatry',
  'Radiology'
];

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  topics,
  onSelectTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
      const matchesBookmark = !filterBookmarkedOnly || topic.isBookmarked;

      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [topics, searchQuery, selectedCategory, filterBookmarkedOnly]);

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Knowledge Base
          </span>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Medical Handbook
          </h1>
        </div>

        <button
          onClick={() => {
            soundHaptics.tap();
            setFilterBookmarkedOnly(!filterBookmarkedOnly);
          }}
          className={`p-2 rounded-2xl border transition-all ${
            filterBookmarkedOnly 
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-500' 
              : 'bg-white/70 dark:bg-neutral-900/70 border-neutral-200 dark:border-white/10 text-neutral-500'
          }`}
          title="Filter saved bookmarks"
        >
          <Bookmark className={`w-4 h-4 ${filterBookmarkedOnly ? 'fill-cyan-500' : ''}`} />
        </button>
      </div>

      {/* iOS Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search diseases, presentations, mechanisms..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/70 border border-neutral-300/40 dark:border-white/5 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Horizontal Specialty Categories Carousel */}
      <div className="overflow-x-auto no-scrollbar py-0.5 flex items-center gap-1.5 -mx-4 px-4">
        <button
          onClick={() => {
            soundHaptics.tap();
            setSelectedCategory('All');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
          }`}
        >
          All Topics ({topics.length})
        </button>

        {CATEGORIES.map(cat => {
          const count = topics.filter(t => t.category === cat).length;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => {
                soundHaptics.tap();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {cat} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Topic List Cards */}
      <div className="space-y-3 pt-1">
        {filteredTopics.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-neutral-400 opacity-60" />
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No handbook topics found</h4>
            <p className="text-xs text-neutral-500">Try adjusting your search terms or filter category.</p>
          </GlassCard>
        ) : (
          filteredTopics.map(topic => (
            <GlassCard
              key={topic.id}
              onClick={() => {
                soundHaptics.tap();
                onSelectTopic(topic.id);
              }}
              className="p-4 cursor-pointer hover:border-cyan-500/40 transition-all flex items-center justify-between group"
            >
              <div className="space-y-1 pr-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">{topic.category}</Badge>
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {topic.readTimeMinutes} min
                  </span>
                  {topic.isBookmarked && (
                    <Bookmark className="w-3 h-3 fill-cyan-500 text-cyan-500" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-cyan-500 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                  {topic.subtitle}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <ProgressRing percentage={topic.completionPercentage} size={38} strokeWidth={4} colorClassName="text-cyan-500">
                  <span className="text-[9px] font-bold text-neutral-700 dark:text-neutral-300">
                    {topic.completionPercentage}%
                  </span>
                </ProgressRing>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
