import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { colors, radius, spacing, typography } from '@/theme';
import { FloatingNavigation } from './FloatingNavigation';

export function LunaAskBar() {
  return <View><View style={styles.barWrap}><AnimatedPressable onPress={() => router.push('/luna')} accessibilityRole="button" accessibilityLabel="Pergunte à Luna" style={styles.bar}><View style={styles.icon}><Ionicons name="moon" size={18} color={colors.lunaLight} /></View><Text style={styles.text}>Pergunte à Luna</Text><Ionicons name="arrow-forward" size={18} color={colors.textSecondary} /></AnimatedPressable></View><FloatingNavigation /></View>;
}
const styles = StyleSheet.create({ barWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, backgroundColor: colors.overlay }, bar: { maxWidth: 470, width: '100%', alignSelf: 'center', minHeight: 50, borderRadius: radius.pill, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, icon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.lunaTint, alignItems: 'center', justifyContent: 'center' }, text: { ...typography.body, color: colors.textSecondary, flex: 1 } });
