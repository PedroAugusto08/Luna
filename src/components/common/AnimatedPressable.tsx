import type { PropsWithChildren } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const MotionPressable = Animated.createAnimatedComponent(Pressable);
interface AnimatedPressableProps extends Omit<PressableProps, 'style'> { style?: StyleProp<ViewStyle>; pressedScale?: number; }

export function AnimatedPressable({ children, style, pressedScale = 0.97, onPressIn, onPressOut, ...props }: PropsWithChildren<AnimatedPressableProps>) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <MotionPressable {...props} onPressIn={(event) => { scale.set(withSpring(pressedScale, { damping: 18, stiffness: 280 })); onPressIn?.(event); }} onPressOut={(event) => { scale.set(withSpring(1, { damping: 16, stiffness: 250 })); onPressOut?.(event); }} style={[style, animatedStyle]}>{children}</MotionPressable>;
}
