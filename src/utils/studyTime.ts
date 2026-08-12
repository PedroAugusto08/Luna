const timePattern = /^\d{2}:\d{2}$/;

export function isValidStudyTime(value: string): boolean {
  if (!timePattern.test(value)) return false;

  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export function isValidStudyTimeRange(startTime: string, endTime: string): boolean {
  return (
    isValidStudyTime(startTime) && isValidStudyTime(endTime) && startTime < endTime
  );
}
