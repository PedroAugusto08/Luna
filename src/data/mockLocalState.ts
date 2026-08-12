import { mockDashboard } from './mockDashboard';
import type { ChatMessage } from '@/types/chat';
import type { PersistedStudyState } from '@/types/persistence';

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'l1',
    author: 'luna',
    text: 'Boa tarde, Pedro. Organizei seu foco e as revisões mais importantes de hoje.',
    createdAt: '2026-08-04T14:00:00Z',
  },
  {
    id: 'u1',
    author: 'user',
    text: 'Tenho menos tempo hoje. O que devo priorizar?',
    createdAt: '2026-08-04T14:01:00Z',
  },
  {
    id: 'l2',
    author: 'luna',
    text: 'Faça os 45 minutos de Probabilidade e a revisão de Constitucional. Juntos, eles cobrem as prioridades mais sensíveis.',
    createdAt: '2026-08-04T14:01:10Z',
  },
];

export function createMockLocalState(): PersistedStudyState {
  return {
    studyProfile: null,
    dailyGoal: { ...mockDashboard.dailyGoal },
    activities: mockDashboard.upcomingActivities.map((activity) => ({ ...activity })),
    chatMessages: initialChatMessages.map((message) => ({ ...message })),
    completedSessions: [],
    preferences: { planView: 'Hoje' },
    updatedAt: new Date().toISOString(),
  };
}
