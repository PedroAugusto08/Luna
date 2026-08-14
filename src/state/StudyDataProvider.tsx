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
  CompletedReview,
  CompletedStudySession,
  LocalStorageStatus,
  PersistedStudyState,
  PlanView,
  StudyPreferences,
} from '@/types/persistence';
import type { PendingReview, StudyActivity } from '@/types/study';
import type { StudyProfile } from '@/types/user';
import { getFirstName } from '@/utils/userProfile';

interface StudyDataContextValue {
  dashboard: StudyDashboardData;
  chatMessages: ChatMessage[];
  completedSessions: CompletedStudySession[];
  completedReviews: CompletedReview[];
  studyProfile: StudyProfile | null;
  preferences: StudyPreferences;
  storageStatus: LocalStorageStatus;
  updatedAt: string;
  appendChatMessage: (message: ChatMessage) => void;
  completeStudySession: (activity?: StudyActivity, completedMinutes?: number) => void;
  completeReview: (review: PendingReview) => void;
  setPlanView: (view: PlanView) => void;
  saveStudyProfile: (profile: StudyProfile) => void;
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

  const completeStudySession = useCallback((activity?: StudyActivity, completedMinutes?: number) => {
    const focus = mockDashboard.currentFocus;
    const sessionSource = activity ?? focus;
    const minutes = Math.max(0, completedMinutes ?? sessionSource.estimatedMinutes);
    const completedAt = new Date().toISOString();

    setState((current) => {
      const storedActivity = activity
        ? current.activities.find((item) => item.id === activity.id)
        : undefined;

      if (activity && (!storedActivity || storedActivity.status === 'completed')) {
        return current;
      }

      const activityIndex = current.activities.findIndex((item) =>
        activity
          ? item.id === activity.id
          : item.subject === focus.subject && item.status !== 'completed',
      );
      const activities = current.activities.map((item, index) =>
        index === activityIndex ? { ...item, status: 'completed' as const } : item,
      );
      const session: CompletedStudySession = {
        id: `session-${Date.now()}`,
        focusId: sessionSource.id,
        subject: sessionSource.subject,
        topic: sessionSource.topic,
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

  const completeReview = useCallback((review: PendingReview) => {
    setState((current) => {
      if (current.completedReviews.some((item) => item.reviewId === review.id)) {
        return current;
      }

      const completedReview: CompletedReview = {
        id: `review-${Date.now()}`,
        reviewId: review.id,
        subject: review.subject,
        topic: review.topic,
        completedAt: new Date().toISOString(),
      };

      return withTimestamp({
        ...current,
        completedReviews: [...current.completedReviews, completedReview],
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

  const saveStudyProfile = useCallback((studyProfile: StudyProfile) => {
    setState((current) =>
      withTimestamp({
        ...current,
        studyProfile,
        dailyGoal: {
          ...current.dailyGoal,
          targetMinutes: studyProfile.dailyTargetMinutes,
        },
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

    const user = state.studyProfile
      ? {
          ...mockDashboard.user,
          firstName: getFirstName(state.studyProfile.fullName),
          fullName: state.studyProfile.fullName,
          primaryGoal: state.studyProfile.goalName,
        }
      : mockDashboard.user;

    return {
      ...mockDashboard,
      dailyGoal: state.dailyGoal,
      user,
      upcomingActivities: state.activities,
      pendingReviews: mockDashboard.pendingReviews.filter(
        (review) => !state.completedReviews.some((item) => item.reviewId === review.id),
      ),
      weeklySummary: {
        ...mockDashboard.weeklySummary,
        studiedMinutes: mockDashboard.weeklySummary.studiedMinutes + addedMinutes,
        completedSessions:
          mockDashboard.weeklySummary.completedSessions + state.completedSessions.length,
        dailyMinutes,
      },
    };
  }, [
    state.activities,
    state.completedReviews,
    state.completedSessions,
    state.dailyGoal,
    state.studyProfile,
  ]);

  const value = useMemo<StudyDataContextValue>(
    () => ({
      dashboard,
      chatMessages: state.chatMessages,
      completedSessions: state.completedSessions,
      completedReviews: state.completedReviews,
      studyProfile: state.studyProfile,
      preferences: state.preferences,
      storageStatus,
      updatedAt: state.updatedAt,
      appendChatMessage,
      completeStudySession,
      completeReview,
      setPlanView,
      saveStudyProfile,
      resetDemoData,
    }),
    [
      appendChatMessage,
      completeStudySession,
      completeReview,
      dashboard,
      resetDemoData,
      setPlanView,
      saveStudyProfile,
      state.chatMessages,
      state.completedSessions,
      state.completedReviews,
      state.preferences,
      state.studyProfile,
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
