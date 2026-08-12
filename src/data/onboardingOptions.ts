import type { StudyGoalType, Weekday } from '@/types/user';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const studyGoalOptions: SelectOption<StudyGoalType>[] = [
  { value: 'public-exam', label: 'Concurso público' },
  { value: 'entrance-exam', label: 'Vestibular' },
  { value: 'oab', label: 'OAB' },
  { value: 'certification', label: 'Certificação' },
];

export const weekdayOptions: SelectOption<Weekday>[] = [
  { value: 'monday', label: 'Segunda' },
  { value: 'tuesday', label: 'Terça' },
  { value: 'wednesday', label: 'Quarta' },
  { value: 'thursday', label: 'Quinta' },
  { value: 'friday', label: 'Sexta' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

export const dailyTargetOptions = [30, 60, 90, 120, 180] as const;
