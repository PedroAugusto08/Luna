export type StudyActivityType = 'new-content' | 'review' | 'questions' | 'mock-exam' | 'essay';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export interface CurrentFocus { id: string; subject: string; topic: string; estimatedMinutes: number; priorityReason: string; recommendedBy: 'atlas'; }
export interface DailyGoal { completedMinutes: number; targetMinutes: number; }
export interface StudyActivity { id: string; type: StudyActivityType; subject: string; topic: string; estimatedMinutes: number; scheduledTime?: string; status: 'pending' | 'in-progress' | 'completed' | 'delayed'; }
export interface PendingReview { id: string; subject: string; topic: string; retentionScore: number; urgency: UrgencyLevel; daysOverdue: number; nextReviewDate: string; }
export interface SubjectProgress { name: string; progress: number; accuracy?: number; color: string; }
