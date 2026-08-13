import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { DashboardScreen } from '@/screens/DashboardScreen';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, spacing, typography } from '@/theme';

export default function IndexRoute() {
  const { storageStatus, studyProfile } = useStudyData();

  if (storageStatus === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="small"
          color={colors.luna}
          accessibilityLabel="Carregando seus dados de estudos"
        />
        <Text style={styles.loadingText}>Preparando seu plano…</Text>
      </View>
    );
  }

  if (storageStatus === 'ready' && !studyProfile) {
    return <Redirect href="/onboarding" />;
  }

  return <DashboardScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  loadingText: { ...typography.caption, color: colors.textSecondary },
});
