import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';

interface GradientSurfaceProps {
  colors: [string, string];
  angle?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Renders a linear gradient without pulling in a native module — uses the
 * CSS-style `experimental_backgroundImage` on native (New Architecture) and
 * `backgroundImage` on web, falling back to a flat brand color everywhere else.
 */
export function GradientSurface({ colors, angle = 135, style, children }: GradientSurfaceProps) {
  const gradient = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  const platformStyle =
    Platform.OS === 'web' ? ({ backgroundImage: gradient } as any) : ({ experimental_backgroundImage: gradient } as any);

  return <View style={[{ backgroundColor: colors[0] }, platformStyle, style]}>{children}</View>;
}
