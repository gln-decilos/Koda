import { useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface SegmentedFilterProps {
  options: string[]; selected: number; onSelect: (index: number) => void;
  activeColor: string; activeTextColor: string; inactiveTextColor: string; chipBackground: string; chipBorder: string;
}

export function SegmentedFilter({ options, selected, onSelect, activeColor, activeTextColor, inactiveTextColor, chipBackground, chipBorder }: SegmentedFilterProps) {
  const layouts = useRef<{ x: number; width: number }[]>([]);
  const [ready, setReady] = useState(false);
  const x = useSharedValue(0); const w = useSharedValue(0);
  const measure = (index: number) => (e: LayoutChangeEvent) => {
    const { x: lx, width } = e.nativeEvent.layout;
    layouts.current[index] = { x: lx, width };
    if (index === selected && !ready) { x.value = lx; w.value = width; setReady(true); }
  };
  const handleSelect = (index: number) => {
    onSelect(index);
    const target = layouts.current[index];
    if (target) { x.value = withTiming(target.x, { duration: 180 }); w.value = withTiming(target.width, { duration: 180 }); }
  };
  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value, opacity: ready ? 1 : 0 }));
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Animated.View style={[styles.indicator, { backgroundColor: activeColor }, indicatorStyle]} />
      {options.map((opt, index) => (
        <Pressable key={opt} onLayout={measure(index)} onPress={() => handleSelect(index)} style={[styles.chip, { backgroundColor: chipBackground, borderColor: chipBorder }]}>
          <Text style={[styles.text, { color: index === selected ? activeTextColor : inactiveTextColor }]}>{opt}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({ row: { gap: 8, paddingVertical: 14, position: 'relative' }, indicator: { position: 'absolute', top: 14, bottom: 14, borderRadius: 20 }, chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 }, text: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' } });
