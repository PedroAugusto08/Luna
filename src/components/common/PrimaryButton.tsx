import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { colors, radius, spacing, typography } from '@/theme';

export function PrimaryButton({ label, onPress, icon = 'arrow-forward', tone = colors.luna }: { label: string; onPress: () => void; icon?: React.ComponentProps<typeof Ionicons>['name']; tone?: string }) {
  return <AnimatedPressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.button, { backgroundColor: tone }]}><Text style={styles.label}>{label}</Text><Ionicons name={icon} size={19} color={colors.background} /></AnimatedPressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 50, paddingHorizontal: spacing.lg, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, label: { ...typography.bodyStrong, color: colors.background } });
