import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { AgentAvatar } from '@/components/common/AgentAvatar';
import { Screen } from '@/components/common/Screen';
import { DailyProgressCard, FocusCard, MarleyCard, PeterCard, UpcomingCard, WeeklySummaryCard } from '@/components/dashboard/DashboardCards';
import { LunaAskBar } from '@/components/navigation/LunaAskBar';
import { mockDashboard } from '@/data/mockDashboard';
import { colors, radius, spacing, typography } from '@/theme';
import { getGreeting } from '@/utils/greeting';

export function DashboardScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 700;
  const { user } = mockDashboard;
  return <Screen floating={<LunaAskBar />}><View style={styles.header}><AnimatedPressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel="Abrir perfil e configurações" style={styles.userAvatar}><Text style={styles.initials}>PA</Text></AnimatedPressable><View style={styles.greeting}><Text style={styles.title}>{getGreeting()}, {user.firstName}</Text><Text style={styles.subtitle}>Seu plano de hoje está pronto.</Text></View><AgentAvatar agent="luna" size={46} /></View><View style={styles.streak}><Ionicons name="flame" size={18} color={colors.warning} /><Text style={styles.streakText}>{user.currentStreak} dias de sequência</Text><Text style={styles.plan}>{user.plan.toUpperCase()}</Text></View><FocusCard focus={mockDashboard.currentFocus} /><DailyProgressCard goal={mockDashboard.dailyGoal} /><View style={[styles.grid, wide && styles.gridWide]}><View style={styles.column}><UpcomingCard activities={mockDashboard.upcomingActivities} /><PeterCard insight={mockDashboard.performanceInsight} /></View><View style={styles.column}><MarleyCard reviews={mockDashboard.pendingReviews} /><WeeklySummaryCard summary={mockDashboard.weeklySummary} /></View></View></Screen>;
}

const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, userAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lunaTint, borderWidth: 1, borderColor: colors.luna }, initials: { ...typography.bodyStrong, color: colors.lunaLight }, greeting: { flex: 1 }, title: { ...typography.cardTitle, color: colors.textPrimary }, subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 }, streak: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm }, streakText: { ...typography.caption, color: colors.textSecondary }, plan: { ...typography.label, color: colors.lunaLight, backgroundColor: colors.lunaTint, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, marginLeft: 'auto' }, grid: { gap: spacing.md }, gridWide: { flexDirection: 'row', alignItems: 'flex-start' }, column: { flex: 1, gap: spacing.md } });
