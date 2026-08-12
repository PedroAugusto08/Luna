import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ChatMessage } from '@/types/chat';
import type {
  CompletedStudySession,
  PersistedStudyState,
  PlanView,
  StudyPreferences,
} from '@/types/persistence';
import type { DailyGoal, StudyActivity, StudyActivityType } from '@/types/study';
import type { StudyAvailability, StudyGoalType, StudyProfile, Weekday } from '@/types/user';

const STORAGE_KEY = '@luna/study-state';
const SCHEMA_VERSION = 2;
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

function isTime(value: unknown): value is string {
  if (!isString(value) || !/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function isStudyAvailability(value: unknown): value is StudyAvailability {
  return (
    isRecord(value) &&
    isString(value.weekday) &&
    weekdays.includes(value.weekday as Weekday) &&
    isTime(value.startTime) &&
    isTime(value.endTime) &&
    value.startTime < value.endTime
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

type LegacyPersistedStudyState = Omit<PersistedStudyState, 'studyProfile'>;

function isLegacyPersistedStudyState(value: unknown): value is LegacyPersistedStudyState {
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

function isPersistedStudyState(value: unknown): value is PersistedStudyState {
  if (!isRecord(value)) {
    return false;
  }

  const studyProfile = value.studyProfile;
  return (
    isLegacyPersistedStudyState(value) &&
    (studyProfile === null || isStudyProfile(studyProfile))
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

  if (parsed.version === 1 && isLegacyPersistedStudyState(parsed.state)) {
    return {
      ...parsed.state,
      studyProfile: null,
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
