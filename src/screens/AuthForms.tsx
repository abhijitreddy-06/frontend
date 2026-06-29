import React, { useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSequence, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { FloatInput } from '../components/FloatInput';
import { Divider } from '../components/Divider';
import { GoogleButton } from '../components/GoogleButton';

// SVG icon wrappers (lucide paths manually embedded to avoid native module issues)
import Svg, { Path, Circle } from 'react-native-svg';

function MailIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Path d="m22 6-10 7L2 6" />
    </Svg>
  );
}
function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}
function EyeIcon({ color, off }: { color: string; off?: boolean }) {
  return off ? (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <Path d="m1 1 22 22" />
    </Svg>
  ) : (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx={12} cy={12} r={3} fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

// Staggered fade-up helper
function useFadeUp(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);
  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 340, easing: Easing.bezier(0.4, 0, 0.2, 1) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 340, easing: Easing.bezier(0.4, 0, 0.2, 1) }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function useSlideIn(delay: number, direction: 'left' | 'right') {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'right' ? 28 : -28);
  React.useEffect(() => {
    const ease = Easing.bezier(0.4, 0, 0.2, 1);
    opacity.value    = withDelay(delay, withTiming(1, { duration: 380, easing: ease }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 380, easing: ease }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));
}

// Loading dots — each dot is its own component to keep hooks at top level
function LoadingDot({ index }: { index: number }) {
  const s = useSharedValue(1);
  React.useEffect(() => {
    const run = () => {
      s.value = withDelay(
        index * 180,
        withSequence(withTiming(1.6, { duration: 300 }), withTiming(1, { duration: 300 })),
      );
    };
    run();
    const id = setInterval(run, 900);
    return () => clearInterval(id);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={[{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.85)' }, style]} />
  );
}

function LoadingDots() {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {[0, 1, 2].map(i => <LoadingDot key={i} index={i} />)}
    </View>
  );
}

// ─── Sign In Form ─────────────────────────────────────────────────────────────
interface SignInFormProps { c: Colors; isDark: boolean; }

export function SignInForm({ c, isDark }: SignInFormProps) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const titleStyle    = useFadeUp(0);
  const input1Style   = useSlideIn(100, 'right');
  const input2Style   = useSlideIn(150, 'right');
  const forgotStyle   = useFadeUp(200);
  const btnStyle      = useFadeUp(250);
  const dividerStyle  = useFadeUp(300);
  const googleStyle   = useFadeUp(350);

  const submit = useCallback(() => {
    if (loading || done) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1400);
  }, [loading, done]);

  const iconColor = (focused: boolean) => focused ? c.primary : c.textMuted;

  return (
    <View style={styles.form}>
      <Animated.View style={titleStyle}>
        <Text style={[styles.heading, { color: c.text }]}>Welcome back</Text>
        <Text style={[styles.subheading, { color: c.textSub }]}>Sign in to continue to AuraTrack</Text>
      </Animated.View>

      <View style={styles.inputs}>
        <Animated.View style={input1Style}>
          <FloatInput
            label="Email address"
            value={email}
            onChange={setEmail}
            icon={<MailIcon color={c.textMuted} />}
            c={c}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
          />
        </Animated.View>
        <Animated.View style={input2Style}>
          <FloatInput
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<LockIcon color={c.textMuted} />}
            c={c}
            secureTextEntry={!showPw}
            autoComplete="password"
            suffix={
              <Pressable onPress={() => setShowPw(v => !v)} hitSlop={8}>
                <EyeIcon color={showPw ? c.primary : c.textMuted} off={!showPw} />
              </Pressable>
            }
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.forgotRow, forgotStyle]}>
        <Pressable>
          <Text style={[styles.forgotText, { color: c.primary }]}>Forgot password?</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={btnStyle}>
        <Pressable
          onPress={submit}
          disabled={loading || done}
          style={({ pressed }) => [styles.ctaWrap, { opacity: pressed ? 0.92 : 1 }]}
        >
          <LinearGradient
            colors={done ? [c.success, '#059669'] : [c.primary, c.primaryHover]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            {done ? (
              <View style={styles.ctaInner}>
                <CheckIcon color="#fff" />
                <Text style={styles.ctaText}>Signed in!</Text>
              </View>
            ) : loading ? (
              <LoadingDots />
            ) : (
              <Text style={styles.ctaText}>Sign In</Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View style={dividerStyle}>
        <Divider c={c} />
      </Animated.View>

      <Animated.View style={googleStyle}>
        <GoogleButton c={c} isDark={isDark} />
      </Animated.View>
    </View>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
interface SignUpFormProps { c: Colors; isDark: boolean; }

export function SignUpForm({ c, isDark }: SignUpFormProps) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPw]     = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const titleStyle   = useSlideIn(0, 'left');
  const input1Style  = useSlideIn(100, 'left');
  const input2Style  = useSlideIn(150, 'left');
  const input3Style  = useSlideIn(200, 'left');
  const strengthStyle = useFadeUp(240);
  const btnStyle     = useFadeUp(280);
  const dividerStyle = useFadeUp(320);
  const googleStyle  = useFadeUp(360);
  const termsStyle   = useFadeUp(410);

  const submit = useCallback(() => {
    if (loading || done) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1400);
  }, [loading, done]);

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthColors = ['', c.expense, c.warning, c.success, '#059669'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <View style={styles.form}>
      <Animated.View style={titleStyle}>
        <Text style={[styles.heading, { color: c.text }]}>Create account</Text>
        <Text style={[styles.subheading, { color: c.textSub }]}>Start your financial journey today</Text>
      </Animated.View>

      <View style={styles.inputs}>
        <Animated.View style={input1Style}>
          <FloatInput label="Full name" value={name} onChange={setName}
            icon={<UserIcon color={c.textMuted} />} c={c}
            autoComplete="name" autoCapitalize="words" />
        </Animated.View>
        <Animated.View style={input2Style}>
          <FloatInput label="Email address" value={email} onChange={setEmail}
            icon={<MailIcon color={c.textMuted} />} c={c}
            keyboardType="email-address" autoComplete="email" autoCapitalize="none" />
        </Animated.View>
        <Animated.View style={input3Style}>
          <FloatInput label="Password" value={password} onChange={setPw}
            icon={<LockIcon color={c.textMuted} />} c={c}
            secureTextEntry={!showPw} autoComplete="new-password"
            suffix={
              <Pressable onPress={() => setShowPw(v => !v)} hitSlop={8}>
                <EyeIcon color={showPw ? c.primary : c.textMuted} off={!showPw} />
              </Pressable>
            }
          />
        </Animated.View>
      </View>

      {password.length > 0 && (
        <Animated.View style={[styles.strengthWrap, strengthStyle]}>
          <View style={styles.strengthBars}>
            {[1,2,3,4].map(i => (
              <View key={i} style={[styles.strengthBar, {
                backgroundColor: i <= strength ? strengthColors[strength] : c.border,
              }]} />
            ))}
          </View>
          <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
            {strengthLabels[strength]}
          </Text>
        </Animated.View>
      )}

      <Animated.View style={btnStyle}>
        <Pressable
          onPress={submit}
          disabled={loading || done}
          style={({ pressed }) => [styles.ctaWrap, { opacity: pressed ? 0.92 : 1 }]}
        >
          <LinearGradient
            colors={done ? [c.success, '#059669'] : ['#2563EB', '#1D4ED8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            {done ? (
              <View style={styles.ctaInner}>
                <CheckIcon color="#fff" />
                <Text style={styles.ctaText}>Account created!</Text>
              </View>
            ) : loading ? (
              <LoadingDots />
            ) : (
              <Text style={styles.ctaText}>Create Account</Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View style={dividerStyle}>
        <Divider c={c} />
      </Animated.View>

      <Animated.View style={googleStyle}>
        <GoogleButton c={c} isDark={isDark} />
      </Animated.View>

      <Animated.View style={termsStyle}>
        <Text style={[styles.terms, { color: c.textMuted }]}>
          By creating an account you agree to our{' '}
          <Text style={{ color: c.primary, textDecorationLine: 'underline' }}>Terms</Text>
          {' & '}
          <Text style={{ color: c.primary, textDecorationLine: 'underline' }}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

function UserIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx={12} cy={7} r={4} fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  inputs: {
    gap: 10,
  },
  heading: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    lineHeight: 32,
  },
  subheading: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 4,
  },
  forgotRow: {
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  ctaWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cta: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  strengthWrap: {
    gap: 5,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 99,
  },
  strengthLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  terms: {
    fontSize: 11.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
