import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { colors } from '@/theme';

export default function RootLayout() {
  return <SafeAreaProvider initialMetrics={initialWindowMetrics}><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade_from_bottom' }} /></SafeAreaProvider>;
}
