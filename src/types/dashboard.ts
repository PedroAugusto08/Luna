import type { UserProfile } from './user';
import type { CurrentFocus, DailyGoal, PendingReview, StudyActivity } from './study';
export interface PerformanceInsight { id: string; message: string; subject?: string; currentAccuracy?: number; previousAccuracy?: number; trend: 'up' | 'down' | 'stable'; }
export interface WeeklySummary { studiedMinutes: number; completedSessions: number; answeredQuestions: number; accuracy: number; dailyMinutes: number[]; }
export interface StudyDashboardData { date: string; user: UserProfile; currentFocus: CurrentFocus; dailyGoal: DailyGoal; upcomingActivities: StudyActivity[]; pendingReviews: PendingReview[]; performanceInsight: PerformanceInsight; weeklySummary: WeeklySummary; }
