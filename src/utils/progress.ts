export function getProgress(completed: number, target: number) {
  if (target <= 0) return { ratio: 0, percentage: 0, remaining: 0, exceeded: completed > 0 };
  const raw = completed / target;
  return { ratio: Math.min(Math.max(raw, 0), 1), percentage: Math.round(raw * 100), remaining: Math.max(target - completed, 0), exceeded: completed > target };
}
