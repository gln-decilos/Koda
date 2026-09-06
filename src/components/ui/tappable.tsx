import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface TappableProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function Tappable({ scaleTo = 0.985, style, children, onPressIn, onPressOut, ...rest }: TappableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressableBase
      onPressIn={(e) => { scale.value = withTiming(scaleTo, { duration: 90 }); onPressIn?.(e); }}
      onPressOut={(e) => { scale.value = withTiming(1, { duration: 120 }); onPressOut?.(e); }}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
