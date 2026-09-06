import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApplicationsProvider } from '@/context/applications-context';

SplashScreen.preventAutoHideAsync();

const COLORS = {
  gold: '#C89B5E',
  white: '#FFFFFF',
};

function AppTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        navigationBarHidden: true,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: '#8A9298',
        tabBarStyle: {
          height: 60 + bottomInset,
          paddingTop: 6,
          paddingBottom: Math.max(bottomInset, 8),
          borderTopWidth: 1,
          borderTopColor: '#E7E1D8',
          backgroundColor: COLORS.white,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="applications" options={{ title: 'Applications', tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="add-application" options={{ href: null }} />
      <Tabs.Screen name="application/[id]" options={{ href: null }} />
      <Tabs.Screen name="application/edit/[id]" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ApplicationsProvider>
        <AppTabs />
      </ApplicationsProvider>
    </SafeAreaProvider>
  );
}
