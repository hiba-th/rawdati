import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import '../i18n';
import { useIsRTL } from '../i18n';
import { fontAssets } from '../theme/fonts';
import { colors } from '../theme/tokens';
import { AppStoreProvider } from '../store/AppStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AppStoreProvider>
      <Shell />
    </AppStoreProvider>
  );
}

function Shell() {
  const rtl = useIsRTL();
  return (
    // On a desktop browser the app is shown phone-width in the middle of the page.
    <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#EFE6DC' : colors.ground, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden', direction: rtl ? 'rtl' : 'ltr', backgroundColor: colors.ground }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ground },
            animation: rtl ? 'slide_from_left' : 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="(parent)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(teacher)" options={{ animation: 'fade', contentStyle: { backgroundColor: colors.groundTeacher } }} />
          <Stack.Screen name="payment-done" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </View>
    </View>
  );
}
