import type { StudyDashboardData } from '@/types/dashboard';

export const mockDashboard: StudyDashboardData = {
  date: '2026-08-04',
  user: { id: 'user-1', firstName: 'Pedro', fullName: 'Pedro Almeida', currentStreak: 7, plan: 'pro', primaryGoal: 'OAB — 1ª fase' },
  currentFocus: { id: 'focus-1', subject: 'Matemática', topic: 'Probabilidade e análise combinatória', estimatedMinutes: 45, priorityReason: 'Prioridade alta no edital', recommendedBy: 'atlas' },
  dailyGoal: { completedMinutes: 82, targetMinutes: 180 },
  upcomingActivities: [
    { id: 'a1', type: 'new-content', subject: 'Matemática', topic: 'Probabilidade', estimatedMinutes: 45, scheduledTime: '14:00', status: 'pending' },
    { id: 'a2', type: 'questions', subject: 'Direito Constitucional', topic: 'Controle de constitucionalidade', estimatedMinutes: 30, scheduledTime: '15:10', status: 'pending' },
    { id: 'a3', type: 'review', subject: 'Português', topic: 'Concordância verbal', estimatedMinutes: 20, scheduledTime: '16:00', status: 'pending' },
    { id: 'a4', type: 'essay', subject: 'Redação', topic: 'Tese e repertório', estimatedMinutes: 40, scheduledTime: '18:00', status: 'pending' },
  ],
  pendingReviews: [
    { id: 'r1', subject: 'Português', topic: 'Concordância verbal', retentionScore: 58, urgency: 'medium', daysOverdue: 0, nextReviewDate: '2026-08-04' },
    { id: 'r2', subject: 'Direito Constitucional', topic: 'Controle de constitucionalidade', retentionScore: 41, urgency: 'high', daysOverdue: 2, nextReviewDate: '2026-08-02' },
    { id: 'r3', subject: 'Matemática', topic: 'Probabilidade', retentionScore: 49, urgency: 'high', daysOverdue: 0, nextReviewDate: '2026-08-04' },
  ],
  performanceInsight: { id: 'p1', message: 'Você melhorou 12% em Matemática nesta semana.', subject: 'Matemática', currentAccuracy: 72, previousAccuracy: 64, trend: 'up' },
  weeklySummary: { studiedMinutes: 785, completedSessions: 14, answeredQuestions: 286, accuracy: 72, dailyMinutes: [90, 145, 75, 180, 120, 95, 80] },
};
