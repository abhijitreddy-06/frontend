import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { SplashScreen } from '../src/components/SplashScreen';
import { AuthScreen } from '../src/screens/AuthScreen';
import { HomeScreen } from '../src/screens/HomeScreen';

type AppScreen = 'auth' | 'home';

export default function Index() {
  const { isDark, c } = useTheme();
  const [splashDone, setSplashDone] = useState(false);
  const [appScreen, setAppScreen] = useState<AppScreen>('auth');

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {!splashDone && (
        <SplashScreen isDark={isDark} onDone={() => setSplashDone(true)} c={c} />
      )}
      {splashDone && appScreen === 'auth' && (
        <AuthScreen onSignedIn={() => setAppScreen('home')} />
      )}
      {splashDone && appScreen === 'home' && (
        <HomeScreen />
      )}
    </View>
  );
}
