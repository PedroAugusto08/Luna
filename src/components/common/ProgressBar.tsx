import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius } from '@/theme';

export function ProgressBar({ progress, color = colors.luna, height = 8 }: { progress: number; color?: string; height?: number }) {
  const value = useSharedValue(0);
  useEffect(() => { value.value = withTiming(Math.min(Math.max(progress, 0), 1), { duration: 650 }); }, [progress, value]);
  const style = useAnimatedStyle(() => ({ width: `${value.value * 100}%` }));
  return <View style={[styles.track, { height }]} accessibilityRole="progressbar"><Animated.View style={[styles.fill, { backgroundColor: color }, style]} /></View>;
}

const styles = StyleSheet.create({ track: { width: '100%', overflow: 'hidden', borderRadius: radius.pill, backgroundColor: colors.surfaceElevated }, fill: { height: '100%', borderRadius: radius.pill } });
