export type StudyGoalType = 'public-exam' | 'entrance-exam' | 'oab' | 'certification';

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface StudyAvailability {
  weekday: Weekday;
  startTime: string;
  endTime: string;
}

export interface StudyProfile {
  fullName: string;
  goalType: StudyGoalType;
  goalName: string;
  dailyTargetMinutes: number;
  availability: StudyAvailability[];
  completedAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  fullName: string;
  avatarUrl?: string;
  currentStreak: number;
  plan: 'free' | 'pro';
  primaryGoal: string;
}
