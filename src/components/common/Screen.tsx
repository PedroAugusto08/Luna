import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export function Screen({ children, floating, scrollProps }: PropsWithChildren<{ floating?: ReactNode; scrollProps?: ScrollViewProps }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView {...scrollProps} style={styles.scroll} contentContainerStyle={[styles.content, floating ? styles.withFloating : undefined, scrollProps?.contentContainerStyle]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {floating ? <View style={styles.floating}>{floating}</View> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, scroll: { flex: 1 }, content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md }, withFloating: { paddingBottom: 156 }, floating: { position: 'absolute', left: 0, right: 0, bottom: 0 } });
