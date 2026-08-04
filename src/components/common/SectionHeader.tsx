import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export function SectionHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return <View style={styles.row}><View style={styles.copy}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.title}>{title}</Text></View>{action}</View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, copy: { flex: 1 }, eyebrow: { ...typography.label, color: colors.luna, textTransform: 'uppercase', marginBottom: spacing.xxs }, title: { ...typography.cardTitle, color: colors.textPrimary } });
