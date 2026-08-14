import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AgentAvatar } from '@/components/common/AgentAvatar';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { Card } from '@/components/common/Card';
import { Screen } from '@/components/common/Screen';
import {
  dailyTargetOptions,
  studyGoalOptions,
  weekdayOptions,
} from '@/data/onboardingOptions';
import { useStudyData } from '@/state/StudyDataProvider';
import { colors, radius, spacing, typography } from '@/theme';
import type { StudyGoalType, Weekday } from '@/types/user';
import { isValidStudyTimeRange } from '@/utils/studyTime';

type OnboardingStep = 'welcome' | 'profile' | 'availability';

const defaultWeekdays: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
];


export function OnboardingScreen() {
  const { studyProfile, saveStudyProfile } = useStudyData();
  const { initialStep, mode, returnTo } = useLocalSearchParams<{
    initialStep?: string;
    mode?: string;
    returnTo?: string;
  }>();
  const isEditing = mode === 'edit';
  const editingDestination = returnTo === 'plan' ? '/plan' : '/profile';
  const [step, setStep] = useState<OnboardingStep>(() => {
    if (!isEditing) return 'welcome';
    return initialStep === 'availability' ? 'availability' : 'profile';
  });
  const [fullName, setFullName] = useState(studyProfile?.fullName ?? '');
  const [goalType, setGoalType] = useState<StudyGoalType | null>(
    studyProfile?.goalType ?? null,
  );
  const [goalName, setGoalName] = useState(studyProfile?.goalName ?? '');
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState(
    studyProfile?.dailyTargetMinutes ?? 90,
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>(
    studyProfile?.availability.map((item) => item.weekday) ?? defaultWeekdays,
  );
  const [startTime, setStartTime] = useState(
    studyProfile?.availability[0]?.startTime ?? '19:00',
  );
  const [endTime, setEndTime] = useState(
    studyProfile?.availability[0]?.endTime ?? '21:00',
  );
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);

  const profileIsValid =
    fullName.trim().length >= 2 && goalType !== null && goalName.trim().length >= 2;
  const availabilityIsValid =
    selectedWeekdays.length > 0 && isValidStudyTimeRange(startTime, endTime);

  const handleBack = () => {
    if (step === 'availability') {
      setStep('profile');
      return;
    }

    if (step === 'profile') {
      if (isEditing) {
        router.back();
        return;
      }

      setStep('welcome');
      return;
    }

    if (isEditing) {
      router.back();
    }
  };

  const handleComplete = () => {
    if (!goalType || !availabilityIsValid) {
      setShowAvailabilityError(true);
      return;
    }

    saveStudyProfile({
      fullName: fullName.trim(),
      goalType,
      goalName: goalName.trim(),
      dailyTargetMinutes,
      availability: selectedWeekdays.map((weekday) => ({
        weekday,
        startTime,
        endTime,
      })),
      completedAt: studyProfile?.completedAt ?? new Date().toISOString(),
    });
    router.replace(isEditing ? editingDestination : '/');
  };

  const toggleWeekday = (weekday: Weekday) => {
    setSelectedWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday],
    );
    setShowAvailabilityError(false);
  };

  return (
    <Screen scrollProps={{ keyboardShouldPersistTaps: 'handled' }}>
      <OnboardingHeader step={step} canExit={isEditing} onBack={handleBack} />

      {step === 'welcome' ? (
        <WelcomeStep onContinue={() => setStep('profile')} />
      ) : null}

      {step === 'profile' ? (
        <ProfileStep
          fullName={fullName}
          goalType={goalType}
          goalName={goalName}
          dailyTargetMinutes={dailyTargetMinutes}
          isValid={profileIsValid}
          onFullNameChange={setFullName}
          onGoalTypeChange={setGoalType}
          onGoalNameChange={setGoalName}
          onDailyTargetChange={setDailyTargetMinutes}
          onContinue={() => setStep('availability')}
        />
      ) : null}

      {step === 'availability' ? (
        <AvailabilityStep
          selectedWeekdays={selectedWeekdays}
          startTime={startTime}
          endTime={endTime}
          showError={showAvailabilityError}
          onToggleWeekday={toggleWeekday}
          onStartTimeChange={(value) => {
            setStartTime(value);
            setShowAvailabilityError(false);
          }}
          onEndTimeChange={(value) => {
            setEndTime(value);
            setShowAvailabilityError(false);
          }}
          onComplete={handleComplete}
        />
      ) : null}
    </Screen>
  );
}

function OnboardingHeader({
  step,
  canExit,
  onBack,
}: {
  step: OnboardingStep;
  canExit: boolean;
  onBack: () => void;
}) {
  const activeIndex = step === 'welcome' ? 0 : step === 'profile' ? 1 : 2;
  const showBackButton = step !== 'welcome' || canExit;

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <AnimatedPressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <View
        style={styles.progress}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: 3, now: activeIndex + 1 }}
        accessibilityLabel={'Etapa ' + (activeIndex + 1) + ' de 3'}
      >
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[styles.progressSegment, index <= activeIndex && styles.progressSegmentActive]}
          />
        ))}
      </View>
    </View>
  );
}

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  const benefits = [
    ['flag-outline', 'Seu objetivo', 'A Luna parte da prova que você quer conquistar.'],
    ['time-outline', 'Sua rotina', 'O plano respeita os dias e horários que você possui.'],
    ['sparkles-outline', 'Plano adaptativo', 'As prioridades poderão mudar junto com seu progresso.'],
  ] as const;

  return (
    <View style={styles.step}>
      <View style={styles.hero}>
        <AgentAvatar agent="luna" size={96} />
        <Text style={styles.eyebrow}>BEM-VINDO À LUNA</Text>
        <Text style={styles.title}>Vamos montar um plano que cabe na sua rotina.</Text>
        <Text style={styles.subtitle}>
          Conte seu objetivo e sua disponibilidade. A Luna organizará essa base para os próximos
          passos.
        </Text>
      </View>

      <Card style={styles.benefitsCard}>
        {benefits.map(([icon, title, description]) => (
          <View key={title} style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Ionicons name={icon} size={21} color={colors.lunaLight} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>{title}</Text>
              <Text style={styles.benefitDescription}>{description}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Text style={styles.helper}>Leva cerca de dois minutos e poderá ser alterado depois.</Text>
      <ActionButton label="Começar configuração" onPress={onContinue} />
    </View>
  );
}

interface ProfileStepProps {
  fullName: string;
  goalType: StudyGoalType | null;
  goalName: string;
  dailyTargetMinutes: number;
  isValid: boolean;
  onFullNameChange: (value: string) => void;
  onGoalTypeChange: (value: StudyGoalType) => void;
  onGoalNameChange: (value: string) => void;
  onDailyTargetChange: (value: number) => void;
  onContinue: () => void;
}

function ProfileStep({
  fullName,
  goalType,
  goalName,
  dailyTargetMinutes,
  isValid,
  onFullNameChange,
  onGoalTypeChange,
  onGoalNameChange,
  onDailyTargetChange,
  onContinue,
}: ProfileStepProps) {
  return (
    <View style={styles.step}>
      <View>
        <Text style={styles.eyebrow}>SEU OBJETIVO</Text>
        <Text style={styles.title}>O que você está se preparando para conquistar?</Text>
        <Text style={styles.subtitle}>Essas informações personalizarão seu plano de estudos.</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Seu nome</Text>
        <TextInput
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Como você gostaria de ser chamado?"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          accessibilityLabel="Nome completo"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Tipo de objetivo</Text>
        <View style={styles.options}>
          {studyGoalOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={goalType === option.value}
              onPress={() => onGoalTypeChange(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Nome da prova ou objetivo</Text>
        <TextInput
          value={goalName}
          onChangeText={onGoalNameChange}
          placeholder="Ex.: OAB 1ª fase, ENEM ou AWS"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="sentences"
          returnKeyType="done"
          accessibilityLabel="Nome da prova ou objetivo"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Meta diária inicial</Text>
        <View style={styles.options}>
          {dailyTargetOptions.map((minutes) => (
            <ChoiceChip
              key={minutes}
              label={minutes < 60 ? String(minutes) + ' min' : String(minutes / 60) + 'h'}
              selected={dailyTargetMinutes === minutes}
              onPress={() => onDailyTargetChange(minutes)}
            />
          ))}
        </View>
      </View>

      <ActionButton label="Continuar" onPress={onContinue} disabled={!isValid} />
    </View>
  );
}

interface AvailabilityStepProps {
  selectedWeekdays: Weekday[];
  startTime: string;
  endTime: string;
  showError: boolean;
  onToggleWeekday: (weekday: Weekday) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onComplete: () => void;
}

function AvailabilityStep({
  selectedWeekdays,
  startTime,
  endTime,
  showError,
  onToggleWeekday,
  onStartTimeChange,
  onEndTimeChange,
  onComplete,
}: AvailabilityStepProps) {
  return (
    <View style={styles.step}>
      <View>
        <Text style={styles.eyebrow}>SUA ROTINA</Text>
        <Text style={styles.title}>Quando você costuma conseguir estudar?</Text>
        <Text style={styles.subtitle}>
          Para começar, usaremos o mesmo intervalo nos dias selecionados.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Dias disponíveis</Text>
        <View style={styles.options}>
          {weekdayOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={selectedWeekdays.includes(option.value)}
              onPress={() => onToggleWeekday(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>Início</Text>
          <TextInput
            value={startTime}
            onChangeText={onStartTimeChange}
            placeholder="19:00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            accessibilityLabel="Horário inicial"
            style={styles.input}
          />
        </View>
        <View style={styles.timeField}>
          <Text style={styles.fieldLabel}>Fim</Text>
          <TextInput
            value={endTime}
            onChangeText={onEndTimeChange}
            placeholder="21:00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            accessibilityLabel="Horário final"
            style={styles.input}
          />
        </View>
      </View>

      {showError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          Selecione ao menos um dia e informe um intervalo válido no formato 00:00.
        </Text>
      ) : null}

      <Card style={styles.localNote}>
        <Ionicons name="phone-portrait-outline" size={20} color={colors.lunaLight} />
        <Text style={styles.localNoteText}>
          Nesta versão, essas informações ficam salvas apenas neste dispositivo.
        </Text>
      </Card>

      <ActionButton label="Salvar perfil de estudos" onPress={onComplete} />
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </AnimatedPressable>
  );
}

function ActionButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.action, disabled && styles.actionDisabled]}
    >
      <Text style={styles.actionLabel}>{label}</Text>
      <Ionicons name="arrow-forward" size={19} color={colors.background} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  progress: { flex: 1, flexDirection: 'row', gap: spacing.xs },
  backPlaceholder: { width: 44, height: 44 },
  progressSegment: { flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: colors.border },
  progressSegmentActive: { backgroundColor: colors.luna },
  step: { gap: spacing.lg, paddingTop: spacing.md },
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  eyebrow: { ...typography.label, color: colors.lunaLight, letterSpacing: 1 },
  title: { ...typography.screenTitle, color: colors.textPrimary, textAlign: 'left' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  benefitsCard: { gap: spacing.lg },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lunaTint },
  benefitCopy: { flex: 1 },
  benefitTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  benefitDescription: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xxs },
  helper: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  field: { gap: spacing.sm },
  fieldLabel: { ...typography.bodyStrong, color: colors.textPrimary },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...typography.body, color: colors.textPrimary },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { minHeight: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipSelected: { borderColor: colors.luna, backgroundColor: colors.lunaTint },
  chipLabel: { ...typography.caption, color: colors.textSecondary },
  chipLabelSelected: { color: colors.lunaLight, fontWeight: '700' },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  timeField: { flex: 1, minWidth: 130, gap: spacing.sm },
  error: { ...typography.caption, color: colors.urgent },
  localNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.lunaTint },
  localNoteText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  action: { minHeight: 52, paddingHorizontal: spacing.lg, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.luna },
  actionDisabled: { opacity: 0.45 },
  actionLabel: { ...typography.bodyStrong, color: colors.background },
});
