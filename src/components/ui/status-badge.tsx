import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface StatusBadgeProps {
  label: string;
  color: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

/** A soft-tinted status pill with a dot that gently pulses for "live" states. */
export function StatusBadge({ label, color, pulse = false, size = 'sm' }: StatusBadgeProps) {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 750 }),
          withTiming(1, { duration: 750 })
        ),
        -1,
        true
      );
    }
  }, [pulse, pulseAnim]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: pulse ? pulseAnim.value * 0.5 : 0,
    transform: [{ scale: pulse ? 1 + (1 - pulseAnim.value) * 0.9 : 1 }],
  }));

  const isMd = size === 'md';

  return (
    <View style={[styles.wrap, { backgroundColor: `${color}17` }, isMd && styles.wrapMd]}>
      <View style={styles.dotHolder}>
        <Animated.View style={[styles.halo, { backgroundColor: color }, haloStyle]} />
        <View style={[styles.dot, { backgroundColor: color }]} />
      </View>
      <Text style={[styles.text, { color }, isMd && styles.textMd]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  wrapMd: { paddingHorizontal: 13, paddingVertical: 8 },
  dotHolder: { width: 7, height: 7, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 14, height: 14, borderRadius: 7 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 10.5, fontFamily: 'Poppins_700Bold', letterSpacing: 0.2 },
  textMd: { fontSize: 11.5 },
});
