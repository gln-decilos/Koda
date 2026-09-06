import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { Palette } from '@/constants/palette';

interface FloatingFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
}

/**
 * A text field whose border warms from hairline to brass on focus, with a
 * gentle lift — small, but it makes filling out a long form feel guided
 * rather than like sixteen identical boxes.
 */
export function FloatingField({
  label,
  required,
  multiline,
  onFocus,
  onBlur,
  style,
  ...rest
}: FloatingFieldProps) {
  const focusAnim = useSharedValue(0);
  const [focused, setFocused] = useState(false);

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    focusAnim.value = withTiming(1, { duration: 200 });
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: TextInputProps['onBlur'] = (e) => {
    focusAnim.value = withTiming(0, { duration: 200 });
    setFocused(false);
    onBlur?.(e);
  };

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focusAnim.value, [0, 1], [Palette.hairline, Palette.brass]),
    backgroundColor: interpolateColor(focusAnim.value, [0, 1], ['#FCFAF6', Palette.surface]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(focusAnim.value, [0, 1], [Palette.ash, Palette.brassDeep]),
  }));

  return (
    <View style={styles.wrap}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Animated.Text>
      <Animated.View style={[styles.inputShell, multiline && styles.textareaShell, containerStyle]}>
        <TextInput
          placeholderTextColor="#ABA298"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, multiline && styles.textarea, style]}
          {...rest}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 17 },
  label: { fontSize: 10.5, fontFamily: 'Poppins_600SemiBold', marginBottom: 7, letterSpacing: 0.2 },
  required: { color: Palette.brass },
  inputShell: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.3,
    justifyContent: 'center',
  },
  textareaShell: { height: 112 },
  input: {
    paddingHorizontal: 14,
    color: Palette.navy,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    flex: 1,
  },
  textarea: { paddingTop: 13, paddingBottom: 13 },
});
