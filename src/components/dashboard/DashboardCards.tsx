import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SectionHeader } from '@/components/common/SectionHeader';
import { getMostUrgentReviews } from '@/services/reviewPriorityService';
import { colors, radius, spacing, typography } from '@/theme';
import type { CurrentFocus, DailyGoal, PendingReview, StudyActivity, StudyActivityType } from '@/types/study';
import type { PerformanceInsight, WeeklySummary } from '@/types/dashboard';
import { getProgress } from '@/utils/progress';
import { formatMinutes } from '@/utils/time';

const activityLabels: Record<StudyActivityType, string> = {
  'new-content': 'Conteúdo', review: 'Revisão', questions: 'Questões', 'mock-exam': 'Simulado', essay: 'Redação',
};

export function FocusCard({ focus }: { focus: CurrentFocus }) {
  return <Card style={styles.focus}><Text style={[styles.eyebrow, { color: colors.atlas }]}>ATLAS RECOMENDA</Text><Text style={styles.focusSubject}>{focus.subject}</Text><Text style={styles.topic}>{focus.topic}</Text><View style={styles.metaRow}><View style={styles.meta}><Ionicons name="time-outline" size={18} color={colors.textSecondary} /><Text style={styles.metaText}>{focus.estimatedMinutes} minutos</Text></View><View style={styles.meta}><Ionicons name="flag-outline" size={18} color={colors.atlas} /><Text style={styles.metaText}>{focus.priorityReason}</Text></View></View><PrimaryButton label="Iniciar sessão" icon="play" tone={colors.atlas} onPress={() => router.push('/study-session')} /></Card>;
}

export function DailyProgressCard({ goal }: { goal: DailyGoal }) {
  const progress = getProgress(goal.completedMinutes, goal.targetMinutes);
  return <Card><SectionHeader eyebrow="Hoje" title="Progresso diário" /><View style={styles.progressValueRow}><Text style={styles.value}>{formatMinutes(goal.completedMinutes)}</Text><Text style={styles.target}>de {formatMinutes(goal.targetMinutes)}</Text><Text style={styles.percentage}>{progress.percentage}%</Text></View><ProgressBar progress={progress.ratio} /><Text style={styles.helper}>{progress.exceeded ? 'Meta superada' : goal.targetMinutes === 0 ? 'Defina uma meta diária no seu plano' : `${formatMinutes(progress.remaining)} restantes hoje`}</Text></Card>;
}

export function UpcomingCard({ activities }: { activities: StudyActivity[] }) {
  const visible = activities.filter((activity) => activity.status !== 'completed').slice(0, 3);
  return <Card><SectionHeader title="Próximas atividades" /><View style={styles.list}>{visible.length ? visible.map((activity) => <View key={activity.id} style={styles.activity}><View style={styles.timeBox}><Text style={styles.time}>{activity.scheduledTime ?? 'Flex'}</Text></View><View style={styles.activityCopy}><Text style={styles.activityType}>{activityLabels[activity.type]} · {activity.estimatedMinutes} min</Text><Text style={styles.activitySubject}>{activity.subject}</Text><Text style={styles.smallTopic} numberOfLines={2}>{activity.topic}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textMuted} /></View>) : <Text style={styles.empty}>Seu dia está livre. Atlas pode sugerir uma atividade.</Text>}</View><TextButton label="Ver plano completo" onPress={() => router.push('/plan')} /></Card>;
}

export function MarleyCard({ reviews }: { reviews: PendingReview[] }) {
  const urgent = getMostUrgentReviews(reviews, 2);
  return <Card style={reviews.length ? styles.urgentCard : undefined}><Text style={[styles.eyebrow, { color: colors.marley }]}>MARLEY ORGANIZOU</Text><SectionHeader title={reviews.length ? `${reviews.length} revisões para hoje` : 'Marley está tranquilo'} /><View style={styles.list}>{urgent.length ? urgent.map((review) => <View key={review.id} style={styles.review}><View style={styles.reviewIcon}><Ionicons name="refresh" size={18} color={review.urgency === 'high' ? colors.urgent : colors.marley} /></View><View style={styles.activityCopy}><Text style={styles.activitySubject}>{review.subject}</Text><Text style={styles.smallTopic}>{review.topic}</Text><Text style={styles.retention}>Retenção estimada: {review.retentionScore}%{review.daysOverdue ? ` · ${review.daysOverdue}d atrasada` : ''}</Text></View></View>) : <Text style={styles.empty}>Nenhuma revisão urgente para hoje.</Text>}</View><TextButton label="Ver revisões" onPress={() => router.push('/agents/marley')} /></Card>;
}

export function PeterCard({ insight }: { insight: PerformanceInsight }) {
  const delta = (insight.currentAccuracy ?? 0) - (insight.previousAccuracy ?? 0);
  return <Card><Text style={[styles.eyebrow, { color: colors.peter }]}>PETER ANALISOU</Text><Text style={styles.insight}>{insight.message}</Text><View style={styles.insightStats}><Text style={styles.value}>{insight.currentAccuracy ?? '—'}% <Text style={styles.target}>de acertos</Text></Text><Text style={[styles.trend, { color: insight.trend === 'down' ? colors.warning : colors.positive }]}>{Math.abs(delta)} pontos {delta >= 0 ? 'acima' : 'abaixo'} do último simulado</Text></View><TextButton label="Ver análise" onPress={() => router.push('/agents/peter')} /></Card>;
}

export function WeeklySummaryCard({ summary }: { summary: WeeklySummary }) {
  const max = Math.max(...summary.dailyMinutes, 1);
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  return <Card><SectionHeader eyebrow="Últimos 7 dias" title="Resumo semanal" /><View style={styles.metrics}><Metric value={formatMinutes(summary.studiedMinutes)} label="estudadas" /><Metric value={`${summary.completedSessions}`} label="sessões" /><Metric value={`${summary.answeredQuestions}`} label="questões" /><Metric value={`${summary.accuracy}%`} label="acertos" /></View><View style={styles.chart}>{summary.dailyMinutes.map((minutes, index) => <View key={`${days[index]}-${index}`} style={styles.barColumn}><View style={styles.barTrack}><View style={[styles.bar, { height: `${Math.max((minutes / max) * 100, 8)}%` }]} /></View><Text style={styles.day}>{days[index]}</Text></View>)}</View></Card>;
}

function Metric({ value, label }: { value: string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }
function TextButton({ label, onPress }: { label: string; onPress: () => void }) { return <AnimatedPressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.textButton}><Text style={styles.textButtonLabel}>{label}</Text><Ionicons name="arrow-forward" size={17} color={colors.lunaLight} /></AnimatedPressable>; }

const styles = StyleSheet.create({
  focus: { backgroundColor: colors.surfaceElevated, borderColor: colors.atlas }, eyebrow: { ...typography.label, marginBottom: spacing.xs }, focusSubject: { ...typography.screenTitle, color: colors.textPrimary },
  topic: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs }, metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.lg }, meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }, metaText: { ...typography.caption, color: colors.textSecondary },
  progressValueRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: spacing.md, gap: spacing.xs }, value: { ...typography.value, color: colors.textPrimary }, target: { ...typography.caption, color: colors.textSecondary }, percentage: { ...typography.bodyStrong, color: colors.lunaLight, marginLeft: 'auto' }, helper: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  list: { gap: spacing.xs, marginTop: spacing.md }, activity: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, timeBox: { width: 50, height: 48, borderRadius: radius.sm, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }, time: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' }, activityCopy: { flex: 1 }, activityType: { ...typography.caption, color: colors.lunaLight }, activitySubject: { ...typography.bodyStrong, color: colors.textPrimary }, smallTopic: { ...typography.caption, color: colors.textSecondary }, empty: { ...typography.body, color: colors.textSecondary, paddingVertical: spacing.md },
  urgentCard: { borderColor: colors.urgent }, review: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs }, reviewIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.urgentTint, alignItems: 'center', justifyContent: 'center' }, retention: { ...typography.caption, color: colors.textSecondary, marginTop: 2 }, insight: { ...typography.cardTitle, color: colors.textPrimary, marginTop: spacing.xs }, insightStats: { marginTop: spacing.lg, gap: spacing.xs }, trend: { ...typography.caption },
  textButton: { minHeight: 44, marginTop: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, textButtonLabel: { ...typography.bodyStrong, color: colors.lunaLight }, metrics: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, gap: spacing.xs }, metric: { width: '48%', padding: spacing.sm, backgroundColor: colors.surfaceElevated, borderRadius: radius.md }, metricValue: { ...typography.bodyStrong, color: colors.textPrimary }, metricLabel: { ...typography.caption, color: colors.textSecondary }, chart: { height: 110, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginTop: spacing.lg }, barColumn: { flex: 1, height: '100%', alignItems: 'center', gap: spacing.xs }, barTrack: { flex: 1, width: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, justifyContent: 'flex-end', overflow: 'hidden' }, bar: { width: '100%', borderRadius: radius.pill, backgroundColor: colors.luna }, day: { ...typography.caption, color: colors.textMuted },
});
