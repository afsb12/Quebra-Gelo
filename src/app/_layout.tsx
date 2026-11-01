import '../../global.css';

import { Outfit_400Regular, Outfit_600SemiBold, Outfit_800ExtraBold, useFonts } from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useFavoritesHydrated } from '../store/favorites';
import { useOnboardingHydrated } from '../store/onboarding';
import { tokens } from '../theme';

// Keep the splash up until fonts are loaded and favorites + the tutorial flag are read from
// storage, so text never flashes in a fallback font (002 research R4) and the first-launch
// tutorial is either there from the first frame or not at all (005 research R2).
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Outfit_400Regular, Outfit_600SemiBold, Outfit_800ExtraBold });
  const favoritesHydrated = useFavoritesHydrated();
  const onboardingHydrated = useOnboardingHydrated();
  const ready = (fontsLoaded || fontError !== null) && favoritesHydrated && onboardingHydrated;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: tokens.colors.appBackground }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tokens.colors.appBackground },
            animation: 'fade',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
