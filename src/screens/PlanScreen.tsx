import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { LunaAskBar } from '@/components/navigation/LunaAskBar';
import { planSubjects, weeklyLoad } from '@/data/mockPlan';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, radius, spacing, typography } from '@/theme';
import type { PlanView } from '@/types/persistence';
import { getShortWeekdayLabel, sortStudyAvailability } from '@/utils/availability';

const filters = ['Hoje', 'Semana', 'Calendário', 'Matérias', 'Edital'] as const satisfies readonly PlanView[];

export function PlanScreen() {
  const { dashboard, preferences, setPlanView, studyProfile } = useStudyData();
  const filter = preferences.planView;
  const availability = sortStudyAvailability(studyProfile?.availability ?? []);
  const availabilityTitle =
    availability.length === 1 ? '1 dia configurado' : `${availability.length} dias configurados`;

  return (
    <Screen floating={<LunaAskBar />}>
      <Text style={styles.eyebrow}>PLANO ADAPTATIVO</Text>
      <Text style={styles.title}>Seu caminho até a prova</Text>
      <Text style={styles.intro}>
        Atlas mantém prioridades, carga e atrasos visíveis. Os controles desta versão usam
        dados locais.
      </Text>
      <View style={styles.filters}>
        {filters.map((item) => (
          <AnimatedPressable
            key={item}
            onPress={() => setPlanView(item)}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${item}`}
            accessibilityState={{ selected: filter === item }}
            style={[styles.filter, filter === item && styles.filterActive]}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
      <Text style={styles.filterFeedback}>Visualização selecionada: {filter}</Text>
      <Card>
        <SectionHeader eyebrow="Hoje" title="3 blocos planejados" />
        <View style={styles.timeline}>
          {dashboard.upcomingActivities.slice(0, 3).map((activity) => (
            <View key={activity.id} style={styles.timelineItem}>
              <Text style={styles.time}>{activity.scheduledTime}</Text>
              <View style={styles.dot} />
              <View style={styles.timelineCopy}>
                <Text style={styles.subject}>{activity.subject}</Text>
                <Text style={styles.muted}>
                  {activity.topic} · {activity.estimatedMinutes} min ·{' '}
                  {activity.status === 'completed' ? 'Concluída' : 'Pendente'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <SectionHeader eyebrow="Semana" title="Carga planejada" />
        <View style={styles.week}>
          {weeklyLoad.map((day) => (
            <View key={day.day} style={styles.day}>
              <View style={styles.dayBar}>
                <View
                  style={[
                    styles.dayFill,
                    { height: `${Math.max((day.minutes / 210) * 100, 6)}%` },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <Text style={styles.dayMinutes}>{day.minutes}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <SectionHeader eyebrow="Disponibilidade" title={availabilityTitle} />
        {availability.length > 0 ? (
          <View style={availabilityStyles.list}>
            {availability.map((item) => (
              <View key={item.weekday} style={availabilityStyles.item}>
                <View style={availabilityStyles.day}>
                  <Ionicons name="calendar-outline" size={17} color={colors.atlas} />
                  <Text style={availabilityStyles.dayText}>
                    {getShortWeekdayLabel(item.weekday)}
                  </Text>
                </View>
                <Text style={availabilityStyles.time}>
                  {item.startTime}–{item.endTime}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.muted}>
            Informe seus dias e horários para preparar a base do plano adaptativo.
          </Text>
        )}
      </Card>
      <Card>
        <SectionHeader eyebrow="Matérias" title="Progresso do ciclo" />
        <View style={styles.subjects}>
          {planSubjects.map((subject) => (
            <View key={subject.name} style={styles.subjectRow}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subject}>{subject.name}</Text>
                <Text style={styles.muted}>{subject.progress}%</Text>
              </View>
              <ProgressBar progress={subject.progress / 100} color={subject.color} />
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <SectionHeader eyebrow="Edital" title="42% coberto" />
        <Text style={styles.muted}>
          127 de 302 tópicos concluídos · 18 tópicos têm prioridade alta.
        </Text>
        <View style={styles.editalMeta}>
          <Ionicons name="document-text-outline" size={20} color={colors.lunaLight} />
          <Text style={styles.editalText}>Objetivo ativo: {dashboard.user.primaryGoal}</Text>
        </View>
      </Card>
      <PrimaryButton
        label="Ajustar disponibilidade"
        icon="options-outline"
        onPress={() =>
          router.push(
            studyProfile
              ? { pathname: '/onboarding', params: { mode: 'edit', returnTo: 'plan' } }
              : '/onboarding',
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ eyebrow: { ...typography.label, color: colors.luna }, title: { ...typography.screenTitle, color: colors.textPrimary }, intro: { ...typography.body, color: colors.textSecondary }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginVertical: spacing.xs }, filter: { minHeight: 42, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, filterActive: { backgroundColor: colors.lunaTint, borderColor: colors.luna }, filterText: { ...typography.caption, color: colors.textSecondary }, filterTextActive: { color: colors.lunaLight, fontWeight: '700' }, filterFeedback: { ...typography.caption, color: colors.textMuted }, timeline: { marginTop: spacing.md }, timelineItem: { minHeight: 68, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, time: { ...typography.caption, color: colors.textSecondary, width: 45 }, dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.atlas, marginTop: 5 }, timelineCopy: { flex: 1, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, subject: { ...typography.bodyStrong, color: colors.textPrimary }, muted: { ...typography.caption, color: colors.textSecondary }, week: { height: 145, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginTop: spacing.lg }, day: { flex: 1, height: '100%', alignItems: 'center', gap: spacing.xxs }, dayBar: { flex: 1, width: 15, justifyContent: 'flex-end', borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, overflow: 'hidden' }, dayFill: { width: '100%', backgroundColor: colors.atlas, borderRadius: radius.pill }, dayLabel: { ...typography.caption, color: colors.textSecondary }, dayMinutes: { fontSize: 10, color: colors.textMuted }, subjects: { marginTop: spacing.md, gap: spacing.lg }, subjectRow: { gap: spacing.xs }, subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, editalMeta: { marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceElevated }, editalText: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 } });

const availabilityStyles = StyleSheet.create({
  list: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  item: { minWidth: 128, flexGrow: 1, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border },
  day: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dayText: { ...typography.bodyStrong, color: colors.textPrimary },
  time: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xxs },
});
