import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ChatMessage } from '@/types/chat';
import type {
  CompletedReview,
  CompletedStudySession,
  PersistedStudyState,
  PlanView,
  StudyPreferences,
} from '@/types/persistence';
import type { DailyGoal, StudyActivity, StudyActivityType } from '@/types/study';
import { isValidStudyTimeRange } from '@/utils/studyTime';
import type { StudyAvailability, StudyGoalType, StudyProfile, Weekday } from '@/types/user';

const STORAGE_KEY = '@luna/study-state';
const SCHEMA_VERSION = 3;
let saveQueue: Promise<void> = Promise.resolve();

interface StorageEnvelope {
  version: number;
  state: PersistedStudyState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isDailyGoal(value: unknown): value is DailyGoal {
  return (
    isRecord(value) &&
    isFiniteNumber(value.completedMinutes) &&
    isFiniteNumber(value.targetMinutes)
  );
}

const activityTypes: StudyActivityType[] = [
  'new-content',
  'review',
  'questions',
  'mock-exam',
  'essay',
];

const activityStatuses: StudyActivity['status'][] = [
  'pending',
  'in-progress',
  'completed',
  'delayed',
];

function isStudyActivity(value: unknown): value is StudyActivity {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.type) &&
    activityTypes.includes(value.type as StudyActivityType) &&
    isString(value.subject) &&
    isString(value.topic) &&
    isFiniteNumber(value.estimatedMinutes) &&
    (value.scheduledTime === undefined || isString(value.scheduledTime)) &&
    isString(value.status) &&
    activityStatuses.includes(value.status as StudyActivity['status'])
  );
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    isString(value.id) &&
    (value.author === 'user' || value.author === 'luna') &&
    isString(value.text) &&
    isString(value.createdAt)
  );
}

function isCompletedSession(value: unknown): value is CompletedStudySession {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.focusId) &&
    isString(value.subject) &&
    isString(value.topic) &&
    isFiniteNumber(value.completedMinutes) &&
    isString(value.completedAt)
  );
}

function isCompletedReview(value: unknown): value is CompletedReview {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.reviewId) &&
    isString(value.subject) &&
    isString(value.topic) &&
    isString(value.completedAt)
  );
}

const planViews: PlanView[] = ['Hoje', 'Semana', 'Calendário', 'Matérias', 'Edital'];

function isPreferences(value: unknown): value is StudyPreferences {
  return (
    isRecord(value) &&
    isString(value.planView) &&
    planViews.includes(value.planView as PlanView)
  );
}

const studyGoalTypes: StudyGoalType[] = [
  'public-exam',
  'entrance-exam',
  'oab',
  'certification',
];

const weekdays: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function isStudyAvailability(value: unknown): value is StudyAvailability {
  return (
    isRecord(value) &&
    isString(value.weekday) &&
    weekdays.includes(value.weekday as Weekday) &&
    isString(value.startTime) &&
    isString(value.endTime) &&
    isValidStudyTimeRange(value.startTime, value.endTime)
  );
}

function isStudyAvailabilityList(value: unknown): value is StudyAvailability[] {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isStudyAvailability)) {
    return false;
  }

  return new Set(value.map((item) => item.weekday)).size === value.length;
}

function isStudyProfile(value: unknown): value is StudyProfile {
  return (
    isRecord(value) &&
    isString(value.fullName) &&
    value.fullName.trim().length > 0 &&
    isString(value.goalType) &&
    studyGoalTypes.includes(value.goalType as StudyGoalType) &&
    isString(value.goalName) &&
    value.goalName.trim().length > 0 &&
    isFiniteNumber(value.dailyTargetMinutes) &&
    value.dailyTargetMinutes > 0 &&
    isStudyAvailabilityList(value.availability) &&
    isString(value.completedAt)
  );
}

type PersistedStudyStateV2 = Omit<PersistedStudyState, 'completedReviews'>;
type PersistedStudyStateV1 = Omit<PersistedStudyStateV2, 'studyProfile'>;

function isPersistedStudyStateV1(value: unknown): value is PersistedStudyStateV1 {
  return (
    isRecord(value) &&
    isDailyGoal(value.dailyGoal) &&
    Array.isArray(value.activities) &&
    value.activities.every(isStudyActivity) &&
    Array.isArray(value.chatMessages) &&
    value.chatMessages.every(isChatMessage) &&
    Array.isArray(value.completedSessions) &&
    value.completedSessions.every(isCompletedSession) &&
    isPreferences(value.preferences) &&
    isString(value.updatedAt)
  );
}

function isPersistedStudyStateV2(value: unknown): value is PersistedStudyStateV2 {
  if (!isRecord(value)) {
    return false;
  }

  const studyProfile = value.studyProfile;
  return (
    isPersistedStudyStateV1(value) &&
    (studyProfile === null || isStudyProfile(studyProfile))
  );
}

function isPersistedStudyState(value: unknown): value is PersistedStudyState {
  if (!isRecord(value)) {
    return false;
  }

  const completedReviews = value.completedReviews;
  return (
    isPersistedStudyStateV2(value) &&
    Array.isArray(completedReviews) &&
    completedReviews.every(isCompletedReview)
  );
}

function parseEnvelope(rawValue: string): PersistedStudyState | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawValue) as unknown;
  } catch {
    return null;
  }

  if (!isRecord(parsed)) {
    return null;
  }

  if (parsed.version === SCHEMA_VERSION && isPersistedStudyState(parsed.state)) {
    return parsed.state;
  }

  if (parsed.version === 2 && isPersistedStudyStateV2(parsed.state)) {
    return {
      ...parsed.state,
      completedReviews: [],
    };
  }

  if (parsed.version === 1 && isPersistedStudyStateV1(parsed.state)) {
    return {
      ...parsed.state,
      studyProfile: null,
      completedReviews: [],
    };
  }

  return null;
}

export const localStudyRepository = {
  async load(): Promise<PersistedStudyState | null> {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
    return rawValue ? parseEnvelope(rawValue) : null;
  },

  async save(state: PersistedStudyState): Promise<void> {
    const envelope: StorageEnvelope = { version: SCHEMA_VERSION, state };
    const serializedState = JSON.stringify(envelope);
    saveQueue = saveQueue
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serializedState));
    await saveQueue;
  },

  async clear(): Promise<void> {
    await saveQueue.catch(() => undefined);
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
