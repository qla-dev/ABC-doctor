import { UserProgressState, Topic, QuizResultRecord } from '../types';

const PROGRESS_STORAGE_KEY = 'abc_doktori_progress_v1';
const BOOKMARKS_STORAGE_KEY = 'abc_doktori_bookmarks_v1';
const QUIZ_HISTORY_KEY = 'abc_doktori_quiz_history_v1';
const TOPIC_NOTES_KEY = 'abc_doktori_notes_v1';

const DEFAULT_PROGRESS: UserProgressState = {
  streakDays: 14,
  todayMinutes: 34,
  dailyGoalMinutes: 45,
  topicsCompletedCount: 12,
  quizAccuracyPercentage: 86,
  flashcardsReviewedCount: 68,
  simulationsCompletedCount: 9,
  weakTopics: ['Acid-Base Disorders', 'Heart Failure Pharmacotherapy', 'Acute Coronary Syndromes'],
  examReadinessPercentage: 78,
  bookmarkedTopicIds: ['ami', 'stroke'],
  recentQuizResult: {
    topic: 'Cardiology Essentials',
    score: 92,
    date: 'Today, 10:45 AM'
  }
};

export class StorageService {
  public static getProgress(): UserProgressState {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROGRESS;
  }

  public static saveProgress(progress: Partial<UserProgressState>): UserProgressState {
    const current = this.getProgress();
    const updated = { ...current, ...progress };
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }

  public static toggleBookmark(topicId: string): boolean {
    const current = this.getProgress();
    const set = new Set(current.bookmarkedTopicIds);
    let isBookmarked = false;
    if (set.has(topicId)) {
      set.delete(topicId);
      isBookmarked = false;
    } else {
      set.add(topicId);
      isBookmarked = true;
    }
    this.saveProgress({ bookmarkedTopicIds: Array.from(set) });
    return isBookmarked;
  }

  public static recordQuizCompletion(topic: string, scorePct: number, correctCount: number, totalCount: number): void {
    const current = this.getProgress();
    const updatedAccuracy = Math.round((current.quizAccuracyPercentage * 0.8) + (scorePct * 0.2));
    this.saveProgress({
      quizAccuracyPercentage: updatedAccuracy,
      todayMinutes: current.todayMinutes + Math.round(totalCount * 1.5),
      recentQuizResult: {
        topic,
        score: scorePct,
        date: 'Just now'
      }
    });
  }

  public static recordFlashcardReview(): void {
    const current = this.getProgress();
    this.saveProgress({
      flashcardsReviewedCount: current.flashcardsReviewedCount + 1,
      todayMinutes: current.todayMinutes + 1
    });
  }

  public static recordSimulationCompletion(score: number): void {
    const current = this.getProgress();
    this.saveProgress({
      simulationsCompletedCount: current.simulationsCompletedCount + 1,
      todayMinutes: current.todayMinutes + 15,
      examReadinessPercentage: Math.min(100, current.examReadinessPercentage + 2)
    });
  }

  public static getTopicNote(topicId: string): string {
    if (typeof window === 'undefined') return '';
    try {
      const notes = JSON.parse(localStorage.getItem(TOPIC_NOTES_KEY) || '{}');
      return notes[topicId] || '';
    } catch {
      return '';
    }
  }

  public static saveTopicNote(topicId: string, noteText: string): void {
    if (typeof window === 'undefined') return;
    try {
      const notes = JSON.parse(localStorage.getItem(TOPIC_NOTES_KEY) || '{}');
      notes[topicId] = noteText;
      localStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }
}
