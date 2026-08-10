import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgentAvatar } from '@/components/common/AgentAvatar';
import { AnimatedPressable } from '@/components/common/AnimatedPressable';
import { createLocalUserMessage, getMockLunaResponse } from '@/services/mockLunaService';
import { colors, radius, spacing, typography } from '@/theme';
import { useStudyData } from '@/state/StudyDataProvider';

const suggestions = ['Ajustar meu plano de hoje', 'Como está meu desempenho?', 'O que preciso revisar?'];

export function LunaChatScreen() {
  const { chatMessages: messages, appendChatMessage } = useStudyData();
  const [text, setText] = useState('');
  const [responding, setResponding] = useState(false);
  const send = async (content = text) => {
    const trimmed = content.trim(); if (!trimmed || responding) return;
    const userMessage = createLocalUserMessage(trimmed);
    appendChatMessage(userMessage); setText(''); setResponding(true);
    const answer = await getMockLunaResponse(trimmed); appendChatMessage(answer); setResponding(false);
  };
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.header}><AnimatedPressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.back}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></AnimatedPressable><AgentAvatar agent="luna" size={48} /><View style={styles.headerCopy}><Text style={styles.name}>Luna</Text><Text style={styles.status}>Copiloto de estudos · mock local</Text></View></View><ScrollView style={styles.flex} contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>{messages.map((message) => <View key={message.id} style={[styles.bubble, message.author === 'user' ? styles.userBubble : styles.lunaBubble]}><Text style={styles.messageText}>{message.text}</Text></View>)}{responding ? <View style={[styles.bubble, styles.lunaBubble]}><Text style={styles.typing}>Luna está organizando uma resposta…</Text></View> : null}</ScrollView><View style={styles.composerArea}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions}>{suggestions.map((suggestion) => <AnimatedPressable key={suggestion} onPress={() => void send(suggestion)} accessibilityRole="button" accessibilityLabel={suggestion} style={styles.suggestion}><Text style={styles.suggestionText}>{suggestion}</Text></AnimatedPressable>)}</ScrollView><View style={styles.composer}><TextInput value={text} onChangeText={setText} onSubmitEditing={() => void send()} placeholder="Converse com a Luna" placeholderTextColor={colors.textMuted} multiline style={styles.input} accessibilityLabel="Mensagem para Luna" /><AnimatedPressable onPress={() => void send()} accessibilityRole="button" accessibilityLabel="Enviar mensagem" style={styles.send}><Ionicons name="arrow-up" size={21} color={colors.background} /></AnimatedPressable></View></View></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border }, back: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, headerCopy: { flex: 1 }, name: { ...typography.cardTitle, color: colors.textPrimary }, status: { ...typography.caption, color: colors.textSecondary }, messages: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl }, bubble: { maxWidth: '84%', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, lunaBubble: { alignSelf: 'flex-start', backgroundColor: colors.surfaceElevated, borderTopLeftRadius: spacing.xxs }, userBubble: { alignSelf: 'flex-end', backgroundColor: colors.lunaDark, borderTopRightRadius: spacing.xxs }, messageText: { ...typography.body, color: colors.textPrimary }, typing: { ...typography.caption, color: colors.textSecondary }, composerArea: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, paddingTop: spacing.sm }, suggestions: { gap: spacing.xs, paddingHorizontal: spacing.lg }, suggestion: { minHeight: 38, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.lunaTint, borderWidth: 1, borderColor: colors.lunaDark }, suggestionText: { ...typography.caption, color: colors.lunaLight }, composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.lg, paddingTop: spacing.sm }, input: { flex: 1, minHeight: 48, maxHeight: 112, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surfaceElevated, color: colors.textPrimary, ...typography.body }, send: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.luna } });
