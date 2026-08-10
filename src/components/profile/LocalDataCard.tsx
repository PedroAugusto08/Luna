import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, radius, spacing, typography } from '@/theme';
import type { LocalStorageStatus } from '@/types/persistence';

const statusLabels: Record<LocalStorageStatus, string> = {
  loading: 'Carregando dados locais…',
  ready: 'Dados salvos neste dispositivo',
  error: 'Não foi possível acessar o armazenamento',
};

export function LocalDataCard() {
  const { completedSessions, storageStatus, resetDemoData } = useStudyData();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    await resetDemoData();
    setResetting(false);
    setConfirmingReset(false);
  };

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="phone-portrait-outline" size={20} color={colors.lunaLight} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Dados locais</Text>
          <Text style={styles.status}>{statusLabels[storageStatus]}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{completedSessions.length}</Text>
        <Text style={styles.summaryLabel}>
          {completedSessions.length === 1 ? 'sessão concluída e salva' : 'sessões concluídas e salvas'}
        </Text>
      </View>

      {confirmingReset ? (
        <View style={styles.confirmation}>
          <Text style={styles.confirmationTitle}>Restaurar a demonstração?</Text>
          <Text style={styles.confirmationText}>
            O progresso, as sessões, o chat e as preferências salvas neste dispositivo serão
            substituídos pelos dados iniciais.
          </Text>
          <View style={styles.actions}>
            <AnimatedPressable
              onPress={() => setConfirmingReset(false)}
              disabled={resetting}
              accessibilityRole="button"
              accessibilityLabel="Cancelar restauração"
              style={styles.cancelButton}
            >
              <Text style={styles.cancelLabel}>Cancelar</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => void handleReset()}
              disabled={resetting}
              accessibilityRole="button"
              accessibilityLabel="Confirmar restauração dos dados demonstrativos"
              accessibilityState={{ disabled: resetting }}
              style={[styles.confirmButton, resetting && styles.disabled]}
            >
              <Text style={styles.confirmLabel}>{resetting ? 'Restaurando…' : 'Confirmar'}</Text>
            </AnimatedPressable>
          </View>
        </View>
      ) : (
        <AnimatedPressable
          onPress={() => setConfirmingReset(true)}
          accessibilityRole="button"
          accessibilityLabel="Restaurar dados da demonstração"
          style={styles.resetButton}
        >
          <Ionicons name="refresh-outline" size={19} color={colors.warning} />
          <Text style={styles.resetLabel}>Restaurar dados da demonstração</Text>
        </AnimatedPressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lunaTint,
  },
  headerCopy: { flex: 1 },
  title: { ...typography.bodyStrong, color: colors.textPrimary },
  status: { ...typography.caption, color: colors.textSecondary },
  summary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  summaryValue: { ...typography.value, color: colors.textPrimary },
  summaryLabel: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  resetButton: {
    minHeight: 48,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  resetLabel: { ...typography.bodyStrong, color: colors.warning },
  confirmation: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.urgentTint,
    borderWidth: 1,
    borderColor: colors.urgent,
  },
  confirmationTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  confirmationText: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  cancelButton: {
    flex: 1,
    minWidth: 110,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelLabel: { ...typography.bodyStrong, color: colors.textPrimary },
  confirmButton: {
    flex: 1,
    minWidth: 110,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.urgent,
  },
  confirmLabel: { ...typography.bodyStrong, color: colors.background },
  disabled: { opacity: 0.6 },
});
