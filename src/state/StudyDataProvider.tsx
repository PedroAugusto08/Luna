import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createMockLocalState } from '@/data/mockLocalState';
import { mockDashboard } from '@/data/mockDashboard';
import { localStudyRepository } from '@/services/localStudyRepository';
import type { ChatMessage } from '@/types/chat';
import type { StudyDashboardData } from '@/types/dashboard';
import type {
  CompletedStudySession,
  LocalStorageStatus,
  PersistedStudyState,
  PlanView,
  StudyPreferences,
} from '@/types/persistence';

interface StudyDataContextValue {
  dashboard: StudyDashboardData;
  chatMessages: ChatMessage[];
  completedSessions: CompletedStudySession[];
  preferences: StudyPreferences;
  storageStatus: LocalStorageStatus;
  updatedAt: string;
  appendChatMessage: (message: ChatMessage) => void;
  completeCurrentSession: (completedMinutes?: number) => void;
  setPlanView: (view: PlanView) => void;
  resetDemoData: () => Promise<void>;
}

const StudyDataContext = createContext<StudyDataContextValue | null>(null);

function withTimestamp(state: PersistedStudyState): PersistedStudyState {
  return { ...state, updatedAt: new Date().toISOString() };
}

export function StudyDataProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedStudyState>(createMockLocalState);
  const [storageStatus, setStorageStatus] = useState<LocalStorageStatus>('loading');
  const hasHydrated = useRef(false);

  useEffect(() => {
    let active = true;

    void localStudyRepository
      .load()
      .then((storedState) => {
        if (!active) return;
        hasHydrated.current = true;
        setState(storedState ?? createMockLocalState());
        setStorageStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        hasHydrated.current = true;
        setStorageStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;

    void localStudyRepository
      .save(state)
      .then(() => setStorageStatus('ready'))
      .catch(() => setStorageStatus('error'));
  }, [state]);

  const appendChatMessage = useCallback((message: ChatMessage) => {
    setState((current) =>
      withTimestamp({
        ...current,
        chatMessages: [...current.chatMessages, message],
      }),
    );
  }, []);

  const completeCurrentSession = useCallback((completedMinutes?: number) => {
    const focus = mockDashboard.currentFocus;
    const minutes = Math.max(0, completedMinutes ?? focus.estimatedMinutes);
    const completedAt = new Date().toISOString();

    setState((current) => {
      const activityIndex = current.activities.findIndex(
        (activity) => activity.subject === focus.subject && activity.status !== 'completed',
      );
      const activities = current.activities.map((activity, index) =>
        index === activityIndex ? { ...activity, status: 'completed' as const } : activity,
      );
      const session: CompletedStudySession = {
        id: `session-${Date.now()}`,
        focusId: focus.id,
        subject: focus.subject,
        topic: focus.topic,
        completedMinutes: minutes,
        completedAt,
      };

      return withTimestamp({
        ...current,
        dailyGoal: {
          ...current.dailyGoal,
          completedMinutes: current.dailyGoal.completedMinutes + minutes,
        },
        activities,
        completedSessions: [...current.completedSessions, session],
      });
    });
  }, []);

  const setPlanView = useCallback((planView: PlanView) => {
    setState((current) =>
      withTimestamp({
        ...current,
        preferences: { ...current.preferences, planView },
      }),
    );
  }, []);

  const resetDemoData = useCallback(async () => {
    try {
      await localStudyRepository.clear();
      setState(createMockLocalState());
      setStorageStatus('ready');
    } catch {
      setState(createMockLocalState());
      setStorageStatus('error');
    }
  }, []);

  const dashboard = useMemo<StudyDashboardData>(() => {
    const addedMinutes = state.completedSessions.reduce(
      (total, session) => total + session.completedMinutes,
      0,
    );
    const dailyMinutes = [...mockDashboard.weeklySummary.dailyMinutes];
    const currentDayIndex = Math.max(0, dailyMinutes.length - 1);
    dailyMinutes[currentDayIndex] = (dailyMinutes[currentDayIndex] ?? 0) + addedMinutes;

    return {
      ...mockDashboard,
      dailyGoal: state.dailyGoal,
      upcomingActivities: state.activities,
      weeklySummary: {
        ...mockDashboard.weeklySummary,
        studiedMinutes: mockDashboard.weeklySummary.studiedMinutes + addedMinutes,
        completedSessions:
          mockDashboard.weeklySummary.completedSessions + state.completedSessions.length,
        dailyMinutes,
      },
    };
  }, [state.activities, state.completedSessions, state.dailyGoal]);

  const value = useMemo<StudyDataContextValue>(
    () => ({
      dashboard,
      chatMessages: state.chatMessages,
      completedSessions: state.completedSessions,
      preferences: state.preferences,
      storageStatus,
      updatedAt: state.updatedAt,
      appendChatMessage,
      completeCurrentSession,
      setPlanView,
      resetDemoData,
    }),
    [
      appendChatMessage,
      completeCurrentSession,
      dashboard,
      resetDemoData,
      setPlanView,
      state.chatMessages,
      state.completedSessions,
      state.preferences,
      state.updatedAt,
      storageStatus,
    ],
  );

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export function useStudyData(): StudyDataContextValue {
  const context = useContext(StudyDataContext);

  if (!context) {
    throw new Error('useStudyData must be used inside StudyDataProvider');
  }

  return context;
}
