import type { StudyAvailability, Weekday } from '@/types/user';

const weekdays: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

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

function getTimeInMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

export function getAvailabilityMinutes(item: StudyAvailability): number {
  const start = getTimeInMinutes(item.startTime);
  const end = getTimeInMinutes(item.endTime);

  if (start === null || end === null) return 0;
  return Math.max(0, end - start);
}

export function getWeeklyAvailabilityLoad(availability: StudyAvailability[]) {
  const minutesByWeekday = new Map<Weekday, number>();

  availability.forEach((item) => {
    const currentMinutes = minutesByWeekday.get(item.weekday) ?? 0;
    minutesByWeekday.set(item.weekday, currentMinutes + getAvailabilityMinutes(item));
  });

  return weekdays.map((weekday) => ({
    weekday,
    day: getShortWeekdayLabel(weekday),
    minutes: minutesByWeekday.get(weekday) ?? 0,
  }));
}

export function formatAvailabilityMinutes(minutes: number): string {
  if (minutes <= 0) return '0min';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes}`;
}
