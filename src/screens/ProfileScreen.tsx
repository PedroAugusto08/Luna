import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Screen } from '@/components/common/Screen';
import { LocalDataCard } from '@/components/profile/LocalDataCard';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, radius, spacing, typography } from '@/theme';

const sections = [
  { title: 'Estudos', items: [['Perfil de estudos', 'school-outline'], ['Objetivos e provas', 'flag-outline'], ['Disponibilidade', 'time-outline'], ['Matérias', 'library-outline'], ['Notificações', 'notifications-outline'], ['Preferências da Luna', 'moon-outline']] },
  { title: 'Conta', items: [['Perfil', 'person-outline'], ['Assinatura', 'card-outline'], ['Privacidade', 'shield-outline'], ['Dados e sincronização', 'cloud-outline'], ['Exportar dados', 'download-outline']] },
  { title: 'Segurança', items: [['Alterar senha', 'key-outline'], ['Biometria', 'finger-print-outline'], ['Dispositivos conectados', 'phone-portrait-outline']] },
  { title: 'Suporte', items: [['Reportar problema', 'bug-outline'], ['Falar com suporte', 'chatbubble-outline'], ['Avaliar a Luna', 'star-outline']] },
] as const;

export function ProfileScreen() {
  const { dashboard } = useStudyData();
  const { user } = dashboard;

  return (
    <Screen>
      <View style={styles.top}>
        <AnimatedPressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
        <Text style={styles.topTitle}>Perfil e configurações</Text>
      </View>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>PA</Text>
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.goal}>{user.primaryGoal}</Text>
        <View style={styles.pro}>
          <Text style={styles.proText}>PLANO {user.plan.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Plano atual</Text>
          <Text style={styles.summaryValue}>Semana 4</Text>
          <ProgressBar progress={0.34} />
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Objetivos ativos</Text>
          <Text style={styles.summaryValue}>1 prova</Text>
          <Text style={styles.summaryNote}>OAB · 1ª fase</Text>
        </Card>
      </View>

      <LocalDataCard />

      {sections.map((section) => (
        <Card key={section.title}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.items}>
            {section.items.map(([label, icon]) => (
              <AnimatedPressable
                key={label}
                onPress={() => undefined}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={styles.item}
              >
                <View style={styles.icon}>
                  <Ionicons name={icon} size={20} color={colors.lunaLight} />
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </AnimatedPressable>
            ))}
          </View>
        </Card>
      ))}

      <AnimatedPressable
        onPress={() => undefined}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta, indisponível no protótipo"
        style={styles.logout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.urgent} />
        <Text style={styles.logoutText}>Sair</Text>
      </AnimatedPressable>
      <Text style={styles.version}>Luna 1.0 · dados locais</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, topTitle: { ...typography.bodyStrong, color: colors.textPrimary }, profile: { alignItems: 'center', paddingVertical: spacing.lg }, avatar: { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lunaTint, borderWidth: 2, borderColor: colors.luna }, initials: { ...typography.value, color: colors.lunaLight }, name: { ...typography.screenTitle, color: colors.textPrimary, marginTop: spacing.md, textAlign: 'center' }, goal: { ...typography.body, color: colors.textSecondary, textAlign: 'center' }, pro: { marginTop: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.pill, backgroundColor: colors.lunaTint }, proText: { ...typography.label, color: colors.lunaLight }, summary: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, summaryCard: { flex: 1, minWidth: 150 }, summaryLabel: { ...typography.caption, color: colors.textSecondary }, summaryValue: { ...typography.cardTitle, color: colors.textPrimary, marginVertical: spacing.xs }, summaryNote: { ...typography.caption, color: colors.textSecondary }, sectionTitle: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase' }, items: { marginTop: spacing.sm }, item: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lunaTint }, itemLabel: { ...typography.body, color: colors.textPrimary, flex: 1 }, logout: { minHeight: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.urgent }, logoutText: { ...typography.bodyStrong, color: colors.urgent }, version: { ...typography.caption, color: colors.textMuted, textAlign: 'center' } });
