import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { agentColors } from '@/data/mockAgents';
import { colors, typography } from '@/theme';
import type { AgentId } from '@/types/agents';

const icons: Record<AgentId, ComponentProps<typeof Ionicons>['name']> = { luna: 'moon', atlas: 'map', peter: 'analytics', marley: 'library' };

export function AgentAvatar({ agent, size = 52, showName = false }: { agent: AgentId; size?: number; showName?: boolean }) {
  const color = agentColors[agent];
  return <View style={styles.row} accessibilityLabel={`Avatar de ${agent}`}><View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, borderColor: color, backgroundColor: `${color}22` }]}>{agent === 'luna' ? <LunaFace size={size} /> : <Ionicons name={icons[agent]} size={size * 0.45} color={color} />}</View>{showName ? <Text style={styles.name}>{agent[0].toUpperCase() + agent.slice(1)}</Text> : null}</View>;
}

function LunaFace({ size }: { size: number }) {
  return <View style={[styles.lunaFace, { width: size * 0.72, height: size * 0.64, borderRadius: size * 0.24 }]}><View style={[styles.ear, styles.leftEar]} /><View style={[styles.ear, styles.rightEar]} /><View style={styles.eyes}><View style={styles.eye} /><View style={styles.eye} /></View><View style={styles.muzzle}><View style={styles.nose} /></View><Ionicons name="moon" size={size * 0.2} color={colors.lunaLight} style={styles.moon} /></View>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, overflow: 'hidden' }, name: { ...typography.bodyStrong, color: colors.textPrimary, textTransform: 'capitalize' }, lunaFace: { backgroundColor: colors.dogGray, alignItems: 'center', justifyContent: 'center' }, ear: { position: 'absolute', top: -3, width: '30%', height: '58%', backgroundColor: colors.dogGrayDark, borderRadius: 12 }, leftEar: { left: -4, transform: [{ rotate: '12deg' }] }, rightEar: { right: -4, transform: [{ rotate: '-12deg' }] }, eyes: { width: '52%', flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 }, eye: { width: 4, height: 5, borderRadius: 3, backgroundColor: colors.background }, muzzle: { width: '46%', height: '30%', marginTop: 3, borderRadius: 10, backgroundColor: colors.dogWhite, alignItems: 'center' }, nose: { width: 5, height: 4, borderRadius: 3, marginTop: 2, backgroundColor: colors.dogGrayDark }, moon: { position: 'absolute', top: -8, right: -5 } });
