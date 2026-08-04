import type { PendingReview, UrgencyLevel } from '@/types/study';
const urgencyWeight: Record<UrgencyLevel, number> = { low: 0, medium: 100, high: 200 };
export function getPriorityScore(review: PendingReview) { return urgencyWeight[review.urgency] + review.daysOverdue * 12 + (100 - review.retentionScore); }
export function getMostUrgentReviews(reviews: PendingReview[], limit = 2) { return [...reviews].sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).slice(0, limit); }
