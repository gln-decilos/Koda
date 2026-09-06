import { Tappable } from '@/components/ui/tappable';
import { Palette } from '@/constants/palette';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

function parseDate(value?: string) {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type Props = { label: string; value: string; onChange: (value: string) => void; placeholder?: string; minimumDate?: Date };

export function DatePickerField({ label, value, onChange, placeholder = 'Select date', minimumDate }: Props) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  const handleValueChange = (_event: unknown, date?: Date) => {
    if (date) onChange(formatDate(date));
    if (Platform.OS !== 'ios') setOpen(false);
  };
  const handleDismiss = () => setOpen(false);
  if (Platform.OS === 'web') {
    return <View style={styles.wrap}><Text style={styles.label}>{label}</Text><TextInput value={value} placeholder={placeholder} placeholderTextColor="#A29B91" onChangeText={onChange} style={styles.webInput} /></View>;
  }
  return <View style={styles.wrap}>
    <Text style={styles.label}>{label}</Text>
    <Tappable style={styles.trigger} onPress={() => setOpen(true)}>
      <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
      <View style={styles.icon}><Text style={styles.iconText}>▣</Text></View>
    </Tappable>
    {open ? <DateTimePicker value={selected} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onValueChange={handleValueChange} onDismiss={handleDismiss} minimumDate={minimumDate} /> : null}
  </View>;
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: Palette.ash2, fontSize: 8.5, fontFamily: 'Poppins_600SemiBold', marginBottom: 6 },
  trigger: { minHeight: 46, borderRadius: 13, borderWidth: 1, borderColor: Palette.hairlineSoft, backgroundColor: Palette.surface, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  value: { flex: 1, color: Palette.navy, fontSize: 11, fontFamily: 'Poppins_400Regular' },
  placeholder: { color: '#A29B91' },
  icon: { width: 28, height: 28, borderRadius: 9, backgroundColor: Palette.sandLight, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: Palette.clay, fontSize: 13 },
  webInput: { minHeight: 46, borderRadius: 13, borderWidth: 1, borderColor: Palette.hairlineSoft, backgroundColor: Palette.surface, paddingHorizontal: 13, color: Palette.navy, fontSize: 11, fontFamily: 'Poppins_400Regular', outlineStyle: 'none' } as any,
});
