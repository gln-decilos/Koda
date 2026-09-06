import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Tappable } from '@/components/ui/tappable';
import { Palette, Shadow, Type } from '@/constants/palette';
import { ApplicationStatus, useApplications } from '@/context/applications-context';

const filters: Array<'All' | ApplicationStatus> = ['All', 'Applied', 'Screening', 'Interview', 'Follow-up', 'Offer', 'Rejected'];

const statusColor: Record<ApplicationStatus, string> = {
  Applied: Palette.harbor,
  Screening: Palette.slate,
  Interview: Palette.clay,
  'Follow-up': Palette.brassDeep,
  Offer: Palette.moss,
  Rejected: Palette.rust,
};

export default function Applications() {
  const { applications, loading } = useApplications();
  const [filter, setFilter] = useState<'All' | ApplicationStatus>('All');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => applications.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const haystack = `${item.company} ${item.role} ${item.location}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase().trim());
  }), [applications, filter, query]);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(420)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>KODA / WORKSPACE</Text>
            <Text style={styles.title}>Applications</Text>
            <Text style={styles.subtitle}>{applications.length} records · one place to keep the story straight.</Text>
          </View>
          <Tappable style={styles.addCircle} onPress={() => router.push('/add-application')}>
            <Ionicons name="add" size={22} color={Palette.paper} />
          </Tappable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(380)} style={styles.search}>
          <Ionicons name="search-outline" size={18} color={Palette.ash} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search company, role, location" placeholderTextColor="#A29B91" style={styles.searchInput} />
          {query ? <Tappable onPress={() => setQuery('')}><Ionicons name="close-circle" size={17} color={Palette.ash} /></Tappable> : null}
        </Animated.View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((item) => (
            <Tappable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Tappable>
          ))}
        </ScrollView>

        {loading ? <ActivityIndicator style={{ marginTop: 50 }} color={Palette.clay} /> : (
          <>
            <View style={styles.resultLine}>
              <Text style={styles.resultCount}>{visible.length} {visible.length === 1 ? 'APPLICATION' : 'APPLICATIONS'}</Text>
              {filter !== 'All' ? <Text style={styles.resultFilter}>FILTERED BY {filter.toUpperCase()}</Text> : null}
            </View>

            {visible.length ? visible.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(100 + index * 60).duration(260)}>
                <Tappable style={styles.item} onPress={() => router.push(`/application/${item.id}`)}>
                  <View style={styles.itemMain}>
                    <View style={styles.itemTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.company}>{item.company}</Text>
                        <Text style={styles.role}>{item.role}</Text>
                      </View>
                      <Text style={styles.date}>{item.dateApplied}</Text>
                    </View>
                    <View style={styles.itemBottom}>
                      <Text style={styles.meta}>{[item.location, item.workSetup].filter(Boolean).join(' · ') || 'Location not added'}</Text>
                      <View style={styles.status}><View style={[styles.statusDot, { backgroundColor: statusColor[item.status] }]} /><Text style={styles.statusText}>{item.status}</Text></View>
                    </View>
                  </View>
                </Tappable>
              </Animated.View>
            )) : (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.empty}>
                <Ionicons name="search-outline" size={26} color={Palette.clay} />
                <Text style={styles.emptyTitle}>Nothing here yet.</Text>
                <Text style={styles.emptyText}>{query ? 'Try another search.' : 'Add your first application to start your workspace.'}</Text>
                {!query ? <Tappable style={styles.emptyButton} onPress={() => router.push('/add-application')}><Text style={styles.emptyButtonText}>Add application</Text></Tappable> : null}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.paper },
  content: { padding: 22, paddingTop: 24, paddingBottom: 88 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  eyebrow: { color: Palette.brass, fontSize: 9.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.5 },
  title: { color: Palette.navy, fontSize: Type.display, fontFamily: 'Poppins_700Bold', marginTop: 2 },
  subtitle: { color: Palette.ash, fontSize: 11, lineHeight: 17, fontFamily: 'Poppins_400Regular', marginTop: 6, maxWidth: 310 },
  addCircle: { width: 46, height: 46, borderRadius: 17, backgroundColor: Palette.ink, alignItems: 'center', justifyContent: 'center', ...Shadow.soft },
  search: { height: 50, marginTop: 22, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.hairlineSoft, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10 },
  searchInput: { flex: 1, color: Palette.navy, fontSize: 11.5, fontFamily: 'Poppins_400Regular', outlineStyle: 'none' } as any,
  filters: { gap: 8, paddingVertical: 14 },
  filter: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18, backgroundColor: Palette.surface },
  filterActive: { backgroundColor: Palette.ink },
  filterText: { color: Palette.slate, fontSize: 9.5, fontFamily: 'Poppins_600SemiBold' },
  filterTextActive: { color: Palette.paper },
  resultLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, marginBottom: 10 },
  resultCount: { color: Palette.ash2, fontSize: 8.5, fontFamily: 'Poppins_700Bold', letterSpacing: 1.4 },
  resultFilter: { color: Palette.brassDeep, fontSize: 8, fontFamily: 'Poppins_700Bold', letterSpacing: 1 },
  item: { minHeight: 108 },
  itemMain: { flex: 1, backgroundColor: Palette.surface, borderRadius: 18, marginBottom: 10, padding: 14, ...Shadow.soft },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  company: { color: Palette.navy, fontSize: 13, fontFamily: 'Poppins_700Bold' },
  role: { color: Palette.slate, fontSize: 10.5, fontFamily: 'Poppins_400Regular', marginTop: 2 },
  date: { color: Palette.ash2, fontSize: 8.5, fontFamily: 'Poppins_500Medium', alignSelf: 'flex-start' },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 },
  meta: { color: Palette.ash, fontSize: 9.5, fontFamily: 'Poppins_400Regular', flex: 1 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: Palette.clay, fontSize: 9, fontFamily: 'Poppins_600SemiBold' },
  empty: { alignItems: 'center', paddingVertical: 65 },
  emptyTitle: { color: Palette.navy, fontSize: 16, fontFamily: 'Poppins_700Bold', marginTop: 12 },
  emptyText: { color: Palette.ash, fontSize: 10.5, fontFamily: 'Poppins_400Regular', textAlign: 'center', marginTop: 5, maxWidth: 240 },
  emptyButton: { backgroundColor: Palette.ink, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14, marginTop: 18 },
  emptyButtonText: { color: Palette.paper, fontSize: 10.5, fontFamily: 'Poppins_600SemiBold' },
});
