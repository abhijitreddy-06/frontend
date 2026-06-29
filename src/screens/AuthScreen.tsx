import React, { useState, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Logo } from '../components/Logo';
import { ScreenToggle } from '../components/ScreenToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { SignInForm, SignUpForm } from './AuthForms';
import Svg, { Path } from 'react-native-svg';

function ArrowLeftIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5" />
      <Path d="m12 19-7-7 7-7" />
    </Svg>
  );
}

export function AuthScreen() {
  const { isDark, c, toggle } = useTheme();
  const [screen, setScreen]   = useState<'signin' | 'signup'>('signin');
  const [formKey, setFormKey] = useState(0);

  const toggleScreen = useCallback(() => {
    setScreen(s => s === 'signin' ? 'signup' : 'signin');
    setFormKey(k => k + 1);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.topLeft}>
              {screen === 'signup' ? (
                <Pressable
                  onPress={toggleScreen}
                  style={[styles.backBtn, { borderColor: c.border, backgroundColor: c.card }]}
                >
                  <ArrowLeftIcon color={c.textSub} />
                </Pressable>
              ) : (
                <Logo c={c} size="sm" />
              )}
            </View>
            <ThemeToggle isDark={isDark} onToggle={toggle} c={c} />
          </View>

          {screen === 'signup' && (
            <View style={styles.signupLogoRow}>
              <Logo c={c} size="sm" />
            </View>
          )}

          {/* Card */}
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isDark ? 24 : 12 },
            shadowOpacity: isDark ? 0.5 : 0.08,
            shadowRadius: isDark ? 60 : 32,
            elevation: isDark ? 16 : 6,
          }]}>
            <ScreenToggle screen={screen} onToggle={toggleScreen} c={c} isDark={isDark} />

            <View key={formKey} style={styles.formWrap}>
              {screen === 'signin'
                ? <SignInForm c={c} isDark={isDark} />
                : <SignUpForm c={c} isDark={isDark} />}
            </View>

            {/* Bottom switch link */}
            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: c.textSub }]}>
                {screen === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Pressable onPress={toggleScreen}>
                <Text style={[styles.switchLink, { color: c.primary }]}>
                  {screen === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)' }]}>
            AuraTrack — AI-Powered Personal Finance
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  topLeft: {
    flex: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupLogoRow: {
    marginBottom: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 18,
  },
  formWrap: {
    gap: 0,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  switchText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  switchLink: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    letterSpacing: 0.2,
    marginTop: 8,
    marginBottom: 8,
  },
});
