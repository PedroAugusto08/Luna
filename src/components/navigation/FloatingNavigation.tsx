import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { AgentAvatar } from '@/components/common/AgentAvatar';
import { colors, radius, spacing, typography } from '@/theme';

const items = [
  { label: 'Início', path: '/', icon: 'home-outline' },
  { label: 'Agentes', path: '/agents', icon: 'paw-outline' },
  { label: 'Plano', path: '/plan', icon: 'calendar-outline' },
] as const;

export function FloatingNavigation() {
  const path = usePathname();
  const insets = useSafeAreaInsets();
  return <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}><View style={styles.capsule}>{items.map((item) => {
    const active = path === item.path;
    return <AnimatedPressable key={item.path} onPress={() => router.replace(item.path)} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: active }} style={styles.item}><Ionicons name={item.icon} size={21} color={active ? colors.lunaLight : colors.textMuted} /><Text style={[styles.label, active && styles.active]}>{item.label}</Text></AnimatedPressable>;
  })}</View><AnimatedPressable onPress={() => router.push('/luna')} accessibilityRole="button" accessibilityLabel="Abrir Luna" style={styles.luna}><AgentAvatar agent="luna" size={54} /></AnimatedPressable></View>;
}
const styles = StyleSheet.create({ wrap: { paddingHorizontal: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.overlay }, capsule: { flex: 1, maxWidth: 390, minHeight: 68, flexDirection: 'row', padding: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border }, item: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: radius.pill }, label: { ...typography.caption, fontSize: 11, color: colors.textMuted }, active: { color: colors.lunaLight, fontWeight: '700' }, luna: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center', borderRadius: 34, backgroundColor: colors.lunaTint, borderWidth: 1, borderColor: colors.luna } });
