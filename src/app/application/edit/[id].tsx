import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { DatePickerField } from '@/components/ui/date-picker-field';
import { FloatingField } from '@/components/ui/floating-field';
import { Tappable } from '@/components/ui/tappable';
import { Palette, Radius, Shadow, Type } from '@/constants/palette';
import { ApplicationStatus, useApplications } from '@/context/applications-context';

const statuses: ApplicationStatus[] = ['Applied','Screening','Interview','Follow-up','Offer','Rejected'];

export default function EditApplication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getApplication, updateApplication } = useApplications();
  const item = getApplication(id ?? '');

  const [company,setCompany]=useState(''); const [role,setRole]=useState(''); const [location,setLocation]=useState('');
  const [workSetup,setWorkSetup]=useState(''); const [dateApplied,setDateApplied]=useState(''); const [jobLink,setJobLink]=useState('');
  const [salary,setSalary]=useState('');
  const [appliedVia,setAppliedVia]=useState(''); const [contact,setContact]=useState(''); const [contactInfo,setContactInfo]=useState('');
  const [notes,setNotes]=useState(''); const [status,setStatus]=useState<ApplicationStatus>('Applied');

  useEffect(() => {
    if (!item) return;
    setCompany(item.company); setRole(item.role); setLocation(item.location); setWorkSetup(item.workSetup);
    setDateApplied(item.dateApplied); setJobLink(item.jobLink); setAppliedVia(item.appliedVia || ''); setSalary(item.salary); setContact(item.contact);
    setContactInfo(item.contactInfo); setNotes(item.notes); setStatus(item.status);
  }, [item]);

  if (!item) return <View style={styles.empty}><Text style={styles.emptyTitle}>Application not found.</Text></View>;

  const save = async () => {
    if (!company.trim() || !role.trim()) {
      Alert.alert('Missing details','Company name and job title are required.'); return;
    }
    await updateApplication(item.id,{company:company.trim(),role:role.trim(),location:location.trim(),workSetup:workSetup.trim(),dateApplied:dateApplied.trim(),jobLink:jobLink.trim(),appliedVia:appliedVia.trim(),salary:salary.trim(),contact:contact.trim(),contactInfo:contactInfo.trim(),notes:notes.trim(),status});
    router.replace(`/application/${item.id}`);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark"/>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(380)} style={styles.header}>
            <Tappable style={styles.back} onPress={()=>router.back()}><Ionicons name="arrow-back" size={20} color={Palette.navy}/></Tappable>
            <View style={{flex:1}}><Text style={styles.eyebrow}>KODA / EDIT</Text><Text style={styles.title}>Refine application</Text></View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(380)}>
            <Text style={styles.section}>COMPANY & POSITION</Text>
            <View style={styles.card}>
              <FloatingField label="Company name" required value={company} onChangeText={setCompany}/>
              <FloatingField label="Job title" required value={role} onChangeText={setRole}/>
              <View style={styles.twoCol}><View style={{flex:1}}><FloatingField label="Location" value={location} onChangeText={setLocation}/></View><View style={{flex:1}}><FloatingField label="Work setup" value={workSetup} onChangeText={setWorkSetup}/></View></View>
            </View>
          </Animated.View>

          <Text style={styles.section}>STATUS</Text>
          <View style={styles.statusWrap}>{statuses.map(s=><Tappable key={s} onPress={()=>setStatus(s)} style={[styles.statusChip,status===s&&styles.active]}><Text style={[styles.statusText,status===s&&styles.activeText]}>{s}</Text></Tappable>)}</View>

          <Text style={styles.section}>APPLICATION</Text>
          <View style={styles.card}><DatePickerField label="Date applied" value={dateApplied} onChange={setDateApplied} /><FloatingField label="Where did you apply?" placeholder="e.g. LinkedIn, Indeed, Facebook" value={appliedVia} onChangeText={setAppliedVia} /><FloatingField label="Job posting link" value={jobLink} onChangeText={setJobLink} keyboardType="url"/></View>

          <Text style={styles.section}>DETAILS</Text>
          <View style={styles.card}><FloatingField label="Salary expectation" value={salary} onChangeText={setSalary}/><FloatingField label="Contact person" value={contact} onChangeText={setContact}/><FloatingField label="Contact information" value={contactInfo} onChangeText={setContactInfo}/></View>

          <Text style={styles.section}>NOTES</Text>
          <View style={styles.card}><FloatingField label="Notes" value={notes} onChangeText={setNotes} multiline/></View>

          <Tappable style={styles.save} onPress={save}><Ionicons name="checkmark" size={17} color={Palette.paper}/><Text style={styles.saveText}>Save changes</Text></Tappable>
          <Tappable style={styles.cancel} onPress={()=>router.back()}><Text style={styles.cancelText}>Cancel</Text></Tappable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:Palette.paper},content:{padding:22,paddingTop:24,paddingBottom:28},header:{flexDirection:'row',alignItems:'center',gap:12},back:{width:42,height:42,borderRadius:15,backgroundColor:Palette.surface,alignItems:'center',justifyContent:'center',...Shadow.soft},eyebrow:{color:Palette.brass,fontSize:9.5,fontFamily:'Poppins_700Bold',letterSpacing:1.6},title:{color:Palette.navy,fontSize:Type.h1,fontFamily:'Poppins_700Bold',marginTop:2},section:{color:Palette.ash2,fontSize:8.5,fontFamily:'Poppins_700Bold',letterSpacing:1.4,marginTop:24,marginBottom:10},card:{backgroundColor:Palette.surface,borderRadius:Radius.md,padding:16,...Shadow.soft},twoCol:{flexDirection:'row',gap:10},statusWrap:{flexDirection:'row',flexWrap:'wrap',gap:8},statusChip:{paddingHorizontal:12,paddingVertical:9,borderRadius:18,backgroundColor:Palette.surface,borderWidth:1,borderColor:Palette.hairlineSoft},active:{backgroundColor:Palette.ink,borderColor:Palette.ink},statusText:{color:Palette.slate,fontSize:9.5,fontFamily:'Poppins_600SemiBold'},activeText:{color:Palette.paper},save:{height:52,borderRadius:15,backgroundColor:Palette.ink,marginTop:24,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,...Shadow.soft},saveText:{color:Palette.paper,fontSize:12,fontFamily:'Poppins_700Bold'},cancel:{height:45,alignItems:'center',justifyContent:'center'},cancelText:{color:Palette.clay,fontSize:10.5,fontFamily:'Poppins_600SemiBold'},empty:{flex:1,alignItems:'center',justifyContent:'center'},emptyTitle:{fontFamily:'Poppins_700Bold',color:Palette.navy,fontSize:16}
});
