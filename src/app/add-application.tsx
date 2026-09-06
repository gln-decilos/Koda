import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { DatePickerField } from '@/components/ui/date-picker-field';
import { FloatingField } from '@/components/ui/floating-field';
import { Tappable } from '@/components/ui/tappable';
import { Palette, Radius, Shadow, Type } from '@/constants/palette';
import { ApplicationStatus, useApplications } from '@/context/applications-context';

const statuses: ApplicationStatus[] = ['Applied', 'Screening', 'Interview', 'Follow-up', 'Offer', 'Rejected'];

export default function AddApplication() {
  const { addApplication } = useApplications();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [workSetup, setWorkSetup] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [appliedVia, setAppliedVia] = useState('');
  const [salary, setSalary] = useState('');
  const [contact, setContact] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [saved, setSaved] = useState(false);
  const checkScale = useSharedValue(0);

  // Reset the form every time this screen becomes active again.
  // This prevents the previous successful submission from remaining in the form.
  useFocusEffect(
    useCallback(() => {
      setCompany('');
      setRole('');
      setLocation('');
      setWorkSetup('');
      setDateApplied('');
      setJobLink('');
      setAppliedVia('');
      setSalary('');
      setContact('');
      setContactInfo('');
      setNotes('');
      setStatus('Applied');
      setSaved(false);
      checkScale.value = 0;
    }, [checkScale])
  );

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) {
      Alert.alert('Almost there', 'Company name and job title are required.');
      return;
    }

    setSaved(true);
    checkScale.value = withSequence(withTiming(1.2, { duration: 160 }), withTiming(1, { duration: 120 }));

    const item = await addApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      workSetup: workSetup.trim(),
      dateApplied: dateApplied.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      jobLink: jobLink.trim(),
      appliedVia: appliedVia.trim(),
      salary: salary.trim(),
      contact: contact.trim(),
      contactInfo: contactInfo.trim(),
      notes: notes.trim(),
      status,
    });

    setTimeout(() => router.replace(`/application/${item.id}`), 420);
  };

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(380)} style={styles.header}>
            <Tappable style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={20} color={Palette.navy} /></Tappable>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>KODA / NEW</Text>
              <Text style={styles.title}>Add application</Text>
            </View>
          </Animated.View>
          <Animated.Text entering={FadeInUp.delay(40).duration(380)} style={styles.subtitle}>Capture the essentials now. You can refine the record later.</Animated.Text>

          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.section}>COMPANY & POSITION</Text>
            <View style={styles.card}>
              <FloatingField label="Company name" required placeholder="e.g. Google" value={company} onChangeText={setCompany} />
              <FloatingField label="Job title" required placeholder="e.g. UX/UI Designer" value={role} onChangeText={setRole} />
              <View style={styles.twoCol}>
                <View style={{ flex: 1 }}><FloatingField label="Location" placeholder="e.g. Manila" value={location} onChangeText={setLocation} /></View>
                <View style={{ flex: 1 }}><FloatingField label="Work setup" placeholder="Remote / Hybrid" value={workSetup} onChangeText={setWorkSetup} /></View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(400)}>
            <Text style={styles.section}>STATUS</Text>
            <View style={styles.statusWrap}>
              {statuses.map((item) => (
                <Tappable key={item} onPress={() => setStatus(item)} style={[styles.statusChip, status === item && styles.statusChipActive]}>
                  <View style={[styles.statusDot, status === item && styles.statusDotActive]} />
                  <Text style={[styles.statusText, status === item && styles.statusTextActive]}>{item}</Text>
                </Tappable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).duration(400)}>
            <Text style={styles.section}>APPLICATION</Text>
            <View style={styles.card}>
              <DatePickerField label="Date applied" value={dateApplied} onChange={setDateApplied} />
              <FloatingField label="Where did you apply?" placeholder="e.g. LinkedIn, Indeed, Facebook" value={appliedVia} onChangeText={setAppliedVia} />
              <FloatingField label="Job posting link" placeholder="https://..." value={jobLink} onChangeText={setJobLink} keyboardType="url" />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.section}>DETAILS</Text>
            <View style={styles.card}>
              <FloatingField label="Salary expectation" placeholder="e.g. ₱45,000 – ₱55,000" value={salary} onChangeText={setSalary} />
              <FloatingField label="Contact person" placeholder="e.g. Maria Santos" value={contact} onChangeText={setContact} />
              <FloatingField label="Contact information" placeholder="Email or phone" value={contactInfo} onChangeText={setContactInfo} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(360).duration(400)}>
            <Text style={styles.section}>NOTES</Text>
            <View style={styles.card}><FloatingField label="Notes" placeholder="What do you want to remember?" value={notes} onChangeText={setNotes} multiline /></View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(420).duration(400)}>
            <Tappable style={[styles.save, saved && styles.saveDone]} onPress={handleSave} disabled={saved}>
              {saved ? <Animated.View style={checkStyle}><Ionicons name="checkmark" size={20} color={Palette.paper} /></Animated.View> : <Text style={styles.saveText}>Save application</Text>}
            </Tappable>
            <Tappable style={styles.cancel} onPress={() => router.back()}><Text style={styles.cancelText}>Cancel</Text></Tappable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.paper },
  content: { padding: 22, paddingTop: 24, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 15, backgroundColor: Palette.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.soft },
  eyebrow: { color: Palette.brass, fontSize: 9.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.6 },
  title: { color: Palette.navy, fontSize: Type.h1, fontFamily: 'Poppins_700Bold', marginTop: 2 },
  subtitle: { color: Palette.ash, fontSize: 11.5, fontFamily: 'Poppins_400Regular', marginTop: 8, lineHeight: 18 },
  section: { color: Palette.ash2, fontSize: 8.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.4, marginTop: 24, marginBottom: 10 },
  card: { backgroundColor: Palette.surface, borderRadius: Radius.md, padding: 16, ...Shadow.soft },
  twoCol: { flexDirection: 'row', gap: 10 },
  statusWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, backgroundColor: Palette.surface, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderColor: Palette.hairlineSoft },
  statusChipActive: { backgroundColor: Palette.ink, borderColor: Palette.ink },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.ash2 },
  statusDotActive: { backgroundColor: Palette.brass },
  statusText: { color: Palette.slate, fontSize: 9.5, fontFamily: 'Poppins_600SemiBold' },
  statusTextActive: { color: Palette.paper },
  save: { height: 52, backgroundColor: Palette.ink, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginTop: 22, ...Shadow.soft },
  saveDone: { backgroundColor: Palette.moss },
  saveText: { color: Palette.paper, fontSize: 13, fontFamily: 'Poppins_700Bold' },
  cancel: { height: 46, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: Palette.clay, fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
});
