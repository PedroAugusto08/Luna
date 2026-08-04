import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AgentAvatar } from '@/components/common/AgentAvatar';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Screen } from '@/components/common/Screen';
import { LunaAskBar } from '@/components/navigation/LunaAskBar';
import { agentColors, mockAgents } from '@/data/mockAgents';
import { colors, radius, spacing, typography } from '@/theme';
import type { AgentProfile } from '@/types/agents';

export function AgentsScreen() {
  const { width } = useWindowDimensions();
  const twoColumns = width >= 520;
  return <Screen floating={<LunaAskBar />}><Text style={styles.eyebrow}>SUA EQUIPE</Text><Text style={styles.title}>Agentes especialistas</Text><Text style={styles.intro}>Cada agente cuida de uma parte da sua rotina. A Luna conecta tudo em uma experiência simples.</Text><View style={styles.lunaCard}><AgentAvatar agent="luna" size={62} /><View style={styles.agentCopy}><Text style={styles.agentName}>Luna</Text><Text style={styles.role}>Copiloto de estudos</Text><Text style={styles.description}>Conversa com você, entende o contexto e coordena seu plano, desempenho e revisões.</Text></View></View><View style={styles.grid}>{mockAgents.map((agent) => <AgentCard key={agent.id} agent={agent} half={twoColumns} />)}<View style={[styles.comingSoon, twoColumns && styles.half]}><View style={styles.soonIcon}><Ionicons name="add" size={26} color={colors.textMuted} /></View><Text style={styles.agentName}>Em breve</Text><Text style={styles.description}>Novos especialistas para complementar sua preparação.</Text></View></View></Screen>;
}

function AgentCard({ agent, half }: { agent: AgentProfile; half: boolean }) {
  const color = agentColors[agent.id];
  return <AnimatedPressable onPress={() => router.push(`/agents/${agent.id}`)} accessibilityRole="button" accessibilityLabel={`Abrir ${agent.name}, agente de ${agent.role}`} style={[styles.agentCard, half && styles.half, { borderColor: color }]}><AgentAvatar agent={agent.id} size={58} /><Text style={styles.agentName}>{agent.name}</Text><Text style={[styles.role, { color }]}>{agent.role}</Text><Text style={styles.description}>{agent.description}</Text><View style={styles.open}><Text style={[styles.openText, { color }]}>Abrir agente</Text><Ionicons name="arrow-forward" size={17} color={color} /></View></AnimatedPressable>;
}

const styles = StyleSheet.create({ eyebrow: { ...typography.label, color: colors.luna }, title: { ...typography.screenTitle, color: colors.textPrimary }, intro: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm }, lunaCard: { padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.lunaTint, borderWidth: 1, borderColor: colors.luna, flexDirection: 'row', gap: spacing.md, alignItems: 'center' }, agentCopy: { flex: 1 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, agentCard: { width: '100%', minHeight: 250, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1 }, half: { width: '48%', flexGrow: 1 }, comingSoon: { width: '100%', minHeight: 220, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' }, soonIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceElevated, marginBottom: spacing.md }, agentName: { ...typography.cardTitle, color: colors.textPrimary, marginTop: spacing.sm }, role: { ...typography.label, color: colors.lunaLight, marginTop: spacing.xxs }, description: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm }, open: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 'auto', paddingTop: spacing.lg }, openText: { ...typography.bodyStrong } });
