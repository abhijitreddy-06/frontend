import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { SplashScreen } from '../src/components/SplashScreen';
import { AuthScreen } from '../src/screens/AuthScreen';

export default function Index() {
  const { isDark, c } = useTheme();
  const [splashDone, setSplashDone] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {!splashDone && (
        <SplashScreen isDark={isDark} onDone={() => setSplashDone(true)} c={c} />
      )}
      {splashDone && <AuthScreen />}
    </View>
  );
}
