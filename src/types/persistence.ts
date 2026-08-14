import type { ChatMessage } from './chat';
import type { DailyGoal, StudyActivity } from './study';
import type { StudyProfile } from './user';

export type PlanView = 'Hoje' | 'Semana' | 'Calendário' | 'Matérias' | 'Edital';
export type LocalStorageStatus = 'loading' | 'ready' | 'error';

export interface CompletedStudySession {
  id: string;
  focusId: string;
  subject: string;
  topic: string;
  completedMinutes: number;
  completedAt: string;
}

export interface CompletedReview {
  id: string;
  reviewId: string;
  subject: string;
  topic: string;
  completedAt: string;
}

export interface StudyPreferences {
  planView: PlanView;
}

export interface PersistedStudyState {
  dailyGoal: DailyGoal;
  studyProfile: StudyProfile | null;
  activities: StudyActivity[];
  chatMessages: ChatMessage[];
  completedSessions: CompletedStudySession[];
  completedReviews: CompletedReview[];
  preferences: StudyPreferences;
  updatedAt: string;
}
