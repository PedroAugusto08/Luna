import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AgentAvatar } from '@/components/common/AgentAvatar';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { agentColors, mockAgents } from '@/data/mockAgents';
import { mockDashboard } from '@/data/mockDashboard';
import { planHistory, planSubjects } from '@/data/mockPlan';
import { getMostUrgentReviews } from '@/services/reviewPriorityService';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, radius, spacing, typography } from '@/theme';
import type { AgentId } from '@/types/agents';
import {
  formatAvailabilityMinutes,
  getWeeklyAvailabilityLoad,
} from '@/utils/availability';
import { getProgress } from '@/utils/progress';

type SpecialistId = Exclude<AgentId, 'luna'>;

const agentConversationDrafts: Record<Exclude<SpecialistId, 'marley'>, string> = {
  atlas: 'Quero revisar meu planejamento com o Atlas.',
  peter: 'Quero entender minha análise de desempenho com o Peter.',
};

export function AgentDetailScreen({ agentId }: { agentId: SpecialistId }) {
  const profile = mockAgents.find((item) => item.id === agentId);
  if (!profile) return null;
  const color = agentColors[agentId];
  return <Screen><View style={styles.top}><AnimatedPressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.back}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></AnimatedPressable><Text style={styles.topLabel}>Agente especialista</Text></View><View style={[styles.hero, { borderColor: color }]}><AgentAvatar agent={agentId} size={72} /><View style={styles.heroCopy}><Text style={styles.title}>{profile.name}</Text><Text style={[styles.role, { color }]}>{profile.role}</Text><Text style={styles.description}>{profile.description}</Text></View></View>{agentId === 'atlas' ? <AtlasContent /> : agentId === 'peter' ? <PeterContent /> : <MarleyContent />}<PrimaryButton label={agentId === 'marley' ? 'Iniciar revisão' : `Conversar com ${profile.name}`} icon={agentId === 'marley' ? 'play' : 'chatbubble-outline'} tone={color} onPress={() => {
    if (agentId === 'marley') {
      router.push({ pathname: '/study-session', params: { mode: 'review' } });
      return;
    }

    router.push({
      pathname: '/luna',
      params: { draft: agentConversationDrafts[agentId] },
    });
  }} /></Screen>;
}

function AtlasContent() {
  const { dashboard, studyProfile } = useStudyData();
  const weeklyLoad = getWeeklyAvailabilityLoad(studyProfile?.availability ?? []);
  const weeklyMinutes = weeklyLoad.reduce((total, day) => total + day.minutes, 0);
  const busiestDayMinutes = Math.max(...weeklyLoad.map((day) => day.minutes), 1);
  const dailyProgress = getProgress(
    dashboard.dailyGoal.completedMinutes,
    dashboard.dailyGoal.targetMinutes,
  );

  return (
    <>
      <Card>
        <SectionHeader
          eyebrow="Planejamento atual"
          title={dashboard.user.primaryGoal}
        />
        <Text style={styles.description}>
          Hoje: {dashboard.dailyGoal.completedMinutes} de{' '}
          {dashboard.dailyGoal.targetMinutes} min estudados ·{' '}
          {studyProfile?.availability.length ?? 0} dias disponíveis na semana.
        </Text>
        <ProgressBar progress={dailyProgress.ratio} color={colors.atlas} />
      </Card>
      <Card>
        <SectionHeader
          eyebrow="Disponibilidade semanal"
          title={`${formatAvailabilityMinutes(weeklyMinutes)} disponíveis`}
        />
        <View style={styles.weekRows}>
          {weeklyLoad.map((day) => (
            <View key={day.weekday} style={styles.weekRow}>
              <Text numberOfLines={1} style={styles.weekDay}>{day.day}</Text>
              <View style={styles.weekProgress}>
                <ProgressBar
                  progress={day.minutes / busiestDayMinutes}
                  color={colors.atlas}
                />
              </View>
              <Text numberOfLines={1} style={styles.weekValue}>
                {formatAvailabilityMinutes(day.minutes)}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      <Card><SectionHeader title="Matérias prioritárias" /><Rows items={planSubjects.slice().sort((a, b) => a.progress - b.progress).slice(0, 3).map((item) => `${item.name} · ${item.progress}% do ciclo`)} /></Card>
      <Card style={styles.warningCard}><SectionHeader eyebrow="Atenção" title="2 conteúdos atrasados" /><Rows items={['Direito Administrativo · Atos administrativos', 'Matemática · Análise combinatória']} /></Card>
      <Card><SectionHeader title="Próximos ajustes" /><Rows items={['Redistribuir 30 min na quinta-feira', 'Reavaliar peso de Português após o simulado']} /></Card>
      <Card><SectionHeader title="Histórico de mudanças" /><Rows items={planHistory} /></Card>
    </>
  );
}

function PeterContent() {
  return <><View style={styles.metricsGrid}><MetricCard label="Taxa geral" value="72%" detail="+4 pontos no mês" /><MetricCard label="Último simulado" value="78/100" detail="12º percentil superior" /></View><Card><SectionHeader eyebrow="Evolução semanal" title="Consistência em alta" /><View style={styles.spark}>{[54, 61, 58, 68, 72, 70, 76].map((value, index) => <View key={index} style={[styles.sparkBar, { height: `${value}%` }]} />)}</View></Card><Card><SectionHeader title="Desempenho por matéria" /><View style={styles.progressList}>{planSubjects.map((subject) => <View key={subject.name} style={styles.progressItem}><View style={styles.rowBetween}><Text style={styles.itemTitle}>{subject.name}</Text><Text style={styles.muted}>{subject.accuracy}%</Text></View><ProgressBar progress={(subject.accuracy ?? 0) / 100} color={colors.peter} /></View>)}</View></Card><Card style={styles.warningCard}><SectionHeader eyebrow="Tópico mais fraco" title="Atos administrativos" /><Text style={styles.description}>52% de acertos em 27 questões recentes. Peter recomenda um bloco dirigido de 20 questões.</Text></Card><Card><SectionHeader eyebrow="Recomendação principal" title="Priorize erros recorrentes" /><Text style={styles.description}>Revise seus 8 erros de Constitucional antes do próximo simulado.</Text></Card></>;
}

function MarleyContent() {
  const reviews = getMostUrgentReviews(mockDashboard.pendingReviews, 3);
  return <><View style={styles.metricsGrid}><MetricCard label="Revisões hoje" value={`${reviews.length}`} detail="55 min estimados" /><MetricCard label="Retenção estimada" value="61%" detail="Indicador orientativo" /></View><Card style={styles.warningCard}><SectionHeader eyebrow="Conteúdos em risco" title="Revisões prioritárias" /><View style={styles.progressList}>{reviews.map((review) => <View key={review.id} style={styles.progressItem}><View style={styles.rowBetween}><View style={styles.flex}><Text style={styles.itemTitle}>{review.subject}</Text><Text style={styles.muted}>{review.topic}{review.daysOverdue ? ` · ${review.daysOverdue}d atrasada` : ''}</Text></View><Text style={styles.retention}>{review.retentionScore}%</Text></View><ProgressBar progress={review.retentionScore / 100} color={review.urgency === 'high' ? colors.urgent : colors.marley} /></View>)}</View></Card><Card><SectionHeader title="Próximas revisões" /><Rows items={['Amanhã · Ética profissional', 'Qui, 06 ago · Interpretação de texto', 'Sáb, 08 ago · Funções e gráficos']} /></Card><Card><SectionHeader title="Como Marley priorizou" /><Text style={styles.description}>Urgência, menor retenção estimada e dias de atraso definem a ordem. Os percentuais são indicadores orientativos, não medições científicas.</Text></Card></>;
}

function Rows({ items }: { items: string[] }) { return <View style={styles.rows}>{items.map((item) => <View key={item} style={styles.listRow}><View style={styles.bullet} /><Text style={styles.itemTitle}>{item}</Text></View>)}</View>; }
function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) { return <Card style={styles.metricCard}><Text style={styles.muted}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{detail}</Text></Card>; }

const styles = StyleSheet.create({ top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, topLabel: { ...typography.caption, color: colors.textSecondary }, hero: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.surfaceElevated, borderWidth: 1 }, heroCopy: { flex: 1 }, title: { ...typography.screenTitle, color: colors.textPrimary }, role: { ...typography.label }, description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs }, weekRows: { gap: spacing.sm, marginTop: spacing.md }, weekRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, weekDay: { ...typography.caption, color: colors.textSecondary, width: 40, flexShrink: 0 }, weekProgress: { flex: 1, minWidth: 0 }, weekValue: { ...typography.caption, color: colors.textSecondary, width: 44, flexShrink: 0, textAlign: 'right' }, warningCard: { borderColor: colors.urgent }, rows: { marginTop: spacing.sm }, listRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, bullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.luna }, itemTitle: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 }, metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, metricCard: { flex: 1, minWidth: 150 }, metricValue: { ...typography.value, color: colors.textPrimary, marginVertical: spacing.xs }, muted: { ...typography.caption, color: colors.textSecondary }, spark: { height: 100, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.lg }, sparkBar: { flex: 1, backgroundColor: colors.peter, borderRadius: radius.pill }, progressList: { gap: spacing.lg, marginTop: spacing.md }, progressItem: { gap: spacing.xs }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, flex: { flex: 1 }, retention: { ...typography.bodyStrong, color: colors.marley } });
