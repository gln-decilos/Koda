import { Tappable } from '@/components/ui/tappable';
import { Palette, Shadow, Type } from '@/constants/palette';
import { useApplications } from '@/context/applications-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

function Row({ icon, title, subtitle, last, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; last?: boolean; onPress?: () => void }) {
  return <Tappable style={[styles.row, !last && styles.border]} onPress={onPress}>
    <View style={styles.rowIcon}><Ionicons name={icon} size={17} color={Palette.clay} /></View>
    <View style={styles.rowText}><Text style={styles.rowTitle}>{title}</Text>{subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}</View>
    {onPress ? <Ionicons name="chevron-forward" size={16} color={Palette.ash2} /> : null}
  </Tappable>;
}

export default function Settings() {
  const { applications } = useApplications();
  const openTasks = applications.reduce((n, a) => n + a.tasks.filter((t) => !t.completed).length, 0);
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  return <View style={styles.screen}>
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(360)}>
        <Text style={styles.eyebrow}>KODA</Text><Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Your workspace, preferences, and app information.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(360)} style={styles.brandArea}>
        <Image source={require('../../assets/koda-logo.png')} style={styles.brandLogo} />
        <View style={styles.brandCard}>
          <View style={styles.brandCopy}><Text style={styles.brandTitle}>Koda workspace</Text><Text style={styles.brandSub}>A focused place for applications and next actions.</Text></View>
          <View style={styles.brandAccent}><Ionicons name="leaf-outline" size={16} color={Palette.brass} /></View>
        </View>
      </Animated.View>

      <Text style={styles.section}>WORKSPACE</Text>
      <Animated.View entering={FadeInDown.delay(100).duration(360)} style={styles.group}>
        <Row icon="briefcase-outline" title="Applications" subtitle={`${applications.length} saved records`} onPress={() => router.push('/applications')} />
        <Row icon="people-outline" title="Interviews" subtitle={`${interviews} applications at interview stage`} />
        <Row icon="checkmark-circle-outline" title="Open tasks" subtitle={`${openTasks} unfinished next moves`} />
        <Row icon="trophy-outline" title="Offers" subtitle={`${offers} offer-stage applications`} last />
      </Animated.View>

      <Text style={styles.section}>STORAGE & PRIVACY</Text>
      <Animated.View entering={FadeInDown.delay(160).duration(360)} style={styles.group}>
        <Row icon="phone-portrait-outline" title="Local storage" subtitle="Records are saved automatically on this device." />
        <Row icon="cloud-offline-outline" title="Offline first" subtitle="No account is required for your local records." last />
      </Animated.View>

      <Text style={styles.section}>ABOUT KODA</Text>
      <Animated.View entering={FadeInDown.delay(220).duration(360)} style={styles.group}>
        <Row icon="information-circle-outline" title="About this app" subtitle="Track applications, status, details, and next actions." />
        <Row icon="code-slash-outline" title="Version" subtitle="Koda 1.0.0" last />
      </Animated.View>
      <Text style={styles.brand}>KODA · TRACK. ORGANIZE. MOVE FORWARD.</Text>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:Palette.paper},content:{padding:22,paddingTop:25,paddingBottom:30},eyebrow:{color:Palette.brass,fontSize:10,fontFamily:'Poppins_700Bold',letterSpacing:1.6},title:{color:Palette.navy,fontSize:Type.display,fontFamily:'Poppins_700Bold'},subtitle:{color:Palette.ash,fontSize:11,lineHeight:18,fontFamily:'Poppins_400Regular',marginTop:7},brandArea:{marginTop:22},brandLogo:{width:154,height:60,resizeMode:'contain',alignSelf:'center',marginBottom:10},brandCard:{padding:18,borderRadius:19,backgroundColor:Palette.ink,flexDirection:'row',alignItems:'center',...Shadow.lifted},brandCopy:{flex:1},brandAccent:{width:34,height:34,borderRadius:12,backgroundColor:'rgba(200,155,94,0.16)',alignItems:'center',justifyContent:'center'},brandTitle:{color:Palette.paper,fontSize:12.5,fontFamily:'Poppins_700Bold'},brandSub:{color:'#B8C2C9',fontSize:9.2,lineHeight:14,fontFamily:'Poppins_400Regular',marginTop:3},section:{color:Palette.ash2,fontSize:8.5,fontFamily:'Poppins_700Bold',letterSpacing:1.4,marginTop:25,marginBottom:10},group:{backgroundColor:Palette.surface,borderRadius:17,overflow:'hidden',...Shadow.soft},row:{minHeight:67,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:12},border:{borderBottomWidth:1,borderBottomColor:Palette.hairlineSoft},rowIcon:{width:36,height:36,borderRadius:12,backgroundColor:Palette.sandLight,alignItems:'center',justifyContent:'center'},rowText:{flex:1},rowTitle:{color:Palette.navy,fontSize:11.5,fontFamily:'Poppins_600SemiBold'},rowSub:{color:Palette.ash,fontSize:9.2,lineHeight:14,fontFamily:'Poppins_400Regular',marginTop:3},brand:{color:'#B6ADA0',fontSize:8.5,fontFamily:'Poppins_600SemiBold',letterSpacing:1.3,textAlign:'center',marginTop:25}
});
