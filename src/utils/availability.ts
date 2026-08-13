import type { StudyAvailability, Weekday } from '@/types/user';

const weekdayOrder: Record<Weekday, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const weekdayShortLabels: Record<Weekday, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
};

export function sortStudyAvailability(
  availability: StudyAvailability[],
): StudyAvailability[] {
  return [...availability].sort(
    (first, second) => weekdayOrder[first.weekday] - weekdayOrder[second.weekday],
  );
}

export function getShortWeekdayLabel(weekday: Weekday): string {
  return weekdayShortLabels[weekday];
}
