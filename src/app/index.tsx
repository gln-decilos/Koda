import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Easing as ReEasing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Tappable } from '@/components/ui/tappable';
import { Palette, Radius, Shadow, Type } from '@/constants/palette';
import { useApplications } from '@/context/applications-context';

function Count({ value }: { value: number }) {
  const displayed = useRef(0);
  const [, force] = React.useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / 650, 1);
      displayed.current = Math.round(value * (1 - Math.pow(1 - p, 3)));
      force((x) => x + 1);
      if (p >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <Text style={styles.statValue}>{displayed.current}</Text>;
}

function HeroGlow() {
  const drift = useSharedValue(0);
  useEffect(() => {
    drift.value = withRepeat(withSequence(withTiming(1, { duration: 3200, easing: ReEasing.inOut(ReEasing.sin) }), withTiming(0, { duration: 3200, easing: ReEasing.inOut(ReEasing.sin) })), -1, true);
  }, [drift]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: drift.value * 14 }, { translateY: drift.value * -10 }, { scale: 1 + drift.value * 0.08 }] }));
  return <Animated.View style={[styles.heroGlow, style]} />;
}

export default function Dashboard() {
  const { applications, loading } = useApplications();
  const [helpVisible, setHelpVisible] = React.useState(false);
  const active = applications.filter((a) => a.status !== 'Rejected').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const dueTasks = applications.reduce((sum, a) => sum + a.tasks.filter((t) => !t.completed).length, 0);
  const tasks = applications.flatMap((a) => a.tasks.filter((t) => !t.completed).map((task) => ({ ...task, company: a.company, role: a.role, appId: a.id }))).slice(0, 3);
  const recent = applications.slice(0, 4);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setHelpVisible(false)}>
          <Pressable style={styles.helpModal} onPress={() => {}}>
            <View style={styles.helpModalTop}>
              <View style={styles.helpIcon}><Ionicons name="help-outline" size={20} color={Palette.brassDeep} /></View>
              <Tappable onPress={() => setHelpVisible(false)} style={styles.closeButton}><Ionicons name="close" size={20} color={Palette.ash} /></Tappable>
            </View>
            <Text style={styles.helpTitle}>About Koda</Text>
            <Text style={styles.helpText}>Koda is a private workspace for remembering your applications, their progress, and the next action that matters.</Text>
            <Text style={styles.helpText}>Your records stay on this device. No account or sign-in is required.</Text>
            <Text style={styles.helpVersion}>KODA · VERSION 1.0.0</Text>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(420)} style={styles.topRow}>
          <Image source={require('../../assets/koda-logo.png')} style={styles.logo} />
          <Tappable onPress={() => setHelpVisible(true)} style={styles.helpButton}><Ionicons name="help-outline" size={21} color={Palette.clay} /></Tappable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(60).duration(320)}>
          <View style={styles.heroCard}>
            <HeroGlow />
            <View style={styles.heroText}>
              <Text style={styles.heroEyebrow}>KEEP MOVING FORWARD</Text>
              <Text style={styles.heroTitle}>Your applications,{'\n'}with context.</Text>
              <Text style={styles.heroBody}>Koda keeps the details, next steps, and momentum in one calm workspace.</Text>
            </View>
            <Tappable style={styles.heroMark} onPress={() => router.push('/add-application')}><Ionicons name="add" size={21} color={Palette.ink} /></Tappable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(420)} style={styles.overviewHead}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {loading ? <Text style={styles.live}>LOADING</Text> : <Text style={styles.live}>LIVE</Text>}
        </Animated.View>
        <View style={styles.statsRow}>
          {[['Active', active, 'briefcase-outline'], ['Interviews', interviews, 'people-outline'], ['Open tasks', dueTasks, 'checkmark-circle-outline']].map(([label, value, icon], i) => (
            <Animated.View key={String(label)} entering={FadeInDown.delay(180 + i * 80).duration(260)} style={styles.statCard}>
              <View style={styles.statIcon}><Ionicons name={icon as any} size={16} color={i === 1 ? Palette.clay : Palette.brassDeep} /></View>
              <Count value={Number(value)} />
              <Text style={styles.statLabel}>{label}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Next moves</Text><Text style={styles.micro}>WHAT NEEDS YOU</Text></View>
        {tasks.length ? tasks.map((task, i) => (
          <Animated.View key={task.id} entering={FadeInDown.delay(280 + i * 70).duration(380)}>
            <Tappable style={styles.taskCard} onPress={() => router.push(`/application/${task.appId}`)}>
              <View style={styles.taskNumber}><Text style={styles.taskNumberText}>{String(i + 1).padStart(2, '0')}</Text></View>
              <View style={styles.taskContent}><Text style={styles.taskTitle}>{task.title}</Text><Text style={styles.taskMeta}>{task.company} · {task.role}{task.due ? ` · Due ${task.due}` : ''}</Text></View>
              <Ionicons name="chevron-forward" size={17} color={Palette.clay} />
            </Tappable>
          </Animated.View>
        )) : (
          <Animated.View entering={FadeInDown.delay(280).duration(380)} style={styles.clearState}>
            <Ionicons name="leaf-outline" size={20} color={Palette.brassDeep} />
            <Text style={styles.clearTitle}>Nothing asking for your attention.</Text>
            <Text style={styles.clearText}>A clear queue is a good queue.</Text>
          </Animated.View>
        )}

        <View style={[styles.sectionHeader, { marginTop: 20 }]}><Text style={styles.sectionTitle}>Recently added</Text><Tappable onPress={() => router.push('/applications')}><Text style={styles.sectionAction}>See all</Text></Tappable></View>
        <Animated.View entering={FadeInDown.delay(420).duration(450)} style={styles.recent}>
          {recent.length ? recent.map((item, i) => (
            <Tappable key={item.id} onPress={() => router.push(`/application/${item.id}`)} style={[styles.recentRow, i < recent.length - 1 && styles.rowBorder]}>
              <View style={styles.companyLogo}><Text style={styles.companyInitial}>{item.company[0]?.toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.companyName}>{item.company}</Text><Text style={styles.role}>{item.role}</Text></View>
              <View style={styles.recentRight}><View style={[styles.statusDot, { backgroundColor: item.status === 'Rejected' ? Palette.rust : Palette.brassDeep }]} /><Text style={styles.status}>{item.status}</Text></View>
            </Tappable>
          )) : <Text style={styles.emptyRecent}>Your application history will appear here.</Text>}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(450)}>
          <Tappable style={styles.addButton} onPress={() => router.push('/add-application')}><Ionicons name="add" size={18} color={Palette.paper} /><Text style={styles.addButtonText}>Add application</Text></Tappable>
        </Animated.View>
        <Text style={styles.footerText}>TRACK. ORGANIZE. MOVE FORWARD.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.paper },
  content: { padding: 22, paddingTop: 22, paddingBottom: 30 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 96, height: 42, resizeMode: 'contain' },
  helpButton: { padding: 6, alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(20,33,45,0.34)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  helpModal: { width: '100%', maxWidth: 390, backgroundColor: Palette.paper, borderRadius: 22, padding: 22, ...Shadow.lifted },
  helpModalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  helpIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: Palette.sandLight, alignItems: 'center', justifyContent: 'center' },
  closeButton: { padding: 4 },
  helpTitle: { color: Palette.navy, fontSize: 21, fontFamily: 'Poppins_700Bold', marginTop: 18 },
  helpText: { color: Palette.slate, fontSize: 11, lineHeight: 18, fontFamily: 'Poppins_400Regular', marginTop: 10 },
  helpVersion: { color: Palette.ash2, fontSize: 8.5, letterSpacing: 1.2, fontFamily: 'Poppins_700Bold', marginTop: 20 },
  heroCard: { borderRadius: Radius.lg, padding: 22, minHeight: 182, flexDirection: 'row', overflow: 'hidden', marginTop: 18, marginBottom: 28, backgroundColor: Palette.ink, ...Shadow.lifted },
  heroGlow: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: Palette.brass, opacity: 0.28, top: -50, right: -40 },
  heroText: { flex: 1, paddingRight: 14 },
  heroEyebrow: { color: Palette.brassSoft, fontSize: 9.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.6 },
  heroTitle: { color: Palette.paper, fontSize: 22, lineHeight: 28, fontFamily: 'Poppins_800ExtraBold', marginTop: 10 },
  heroBody: { color: '#C9D3DA', fontSize: 11.5, lineHeight: 18, fontFamily: 'Poppins_400Regular', marginTop: 10, maxWidth: 270 },
  heroMark: { width: 44, height: 44, borderRadius: 16, backgroundColor: Palette.brass, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', ...Shadow.glow },
  overviewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: Palette.navy, fontSize: Type.h2, fontFamily: 'Poppins_700Bold' },
  live: { color: Palette.moss, fontSize: 8.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.2 },
  micro: { color: Palette.ash2, fontSize: 8, fontFamily: 'Poppins_700Bold', letterSpacing: 1.2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 26 },
  statCard: { flex: 1, backgroundColor: Palette.surface, borderRadius: Radius.md, padding: 14, minHeight: 116, ...Shadow.soft },
  statIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: Palette.sandLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { color: Palette.navy, fontSize: 23, fontFamily: 'Poppins_700Bold' },
  statLabel: { color: Palette.ash, fontSize: 9.5, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  taskCard: { backgroundColor: Palette.surface, borderRadius: 17, padding: 14, marginBottom: 9, flexDirection: 'row', alignItems: 'center', ...Shadow.soft },
  taskNumber: { width: 35, height: 35, borderRadius: 12, backgroundColor: Palette.sandLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taskNumberText: { color: Palette.clay, fontSize: 9, fontFamily: 'Poppins_700Bold' },
  taskContent: { flex: 1 },
  taskTitle: { color: Palette.navy, fontSize: 12, fontFamily: 'Poppins_600SemiBold' },
  taskMeta: { color: Palette.ash, fontSize: 9.5, fontFamily: 'Poppins_400Regular', marginTop: 3 },
  clearState: { backgroundColor: Palette.surface, padding: 20, borderRadius: 17, alignItems: 'center', ...Shadow.soft },
  clearTitle: { color: Palette.navy, fontSize: 12, fontFamily: 'Poppins_600SemiBold', marginTop: 8 },
  clearText: { color: Palette.ash, fontSize: 9.5, fontFamily: 'Poppins_400Regular', marginTop: 3 },
  recent: { backgroundColor: Palette.surface, borderRadius: 18, overflow: 'hidden', ...Shadow.soft },
  recentRow: { minHeight: 75, padding: 13, flexDirection: 'row', alignItems: 'center' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Palette.hairlineSoft },
  companyLogo: { width: 42, height: 42, borderRadius: 14, backgroundColor: Palette.sand, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  companyInitial: { color: Palette.clay, fontSize: 15, fontFamily: 'Poppins_700Bold' },
  companyName: { color: Palette.navy, fontSize: 12.5, fontFamily: 'Poppins_700Bold' },
  role: { color: Palette.slate, fontSize: 10, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  recentRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  status: { color: Palette.clay, fontSize: 8.5, fontFamily: 'Poppins_600SemiBold' },
  emptyRecent: { padding: 22, color: Palette.ash, fontSize: 10, fontFamily: 'Poppins_400Regular' },
  sectionAction: { color: Palette.clay, fontSize: 10.5, fontFamily: 'Poppins_600SemiBold' },
  addButton: { height: 52, borderRadius: Radius.sm, backgroundColor: Palette.ink, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadow.soft },
  addButtonText: { color: Palette.paper, fontSize: 12.5, fontFamily: 'Poppins_600SemiBold' },
  footerText: { color: '#B6ADA0', fontSize: 9, fontFamily: 'Poppins_600SemiBold', letterSpacing: 1.6, textAlign: 'center', marginTop: 26 },
});
