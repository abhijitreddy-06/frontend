import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedProps,
  withTiming, withSequence, withDelay, Easing, runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { LogoMark } from './Logo';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: SCREEN_W } = Dimensions.get('window');

// Chart line path scaled to screen width
// viewBox is 500×80; we preserve this and let SVG scale
const CHART_LINE = 'M0,60 C30,58 60,65 90,55 S150,40 180,48 S230,62 260,50 S310,30 340,38 S390,52 420,40 S470,18 500,20';
const CHART_FILL = 'M0,60 C30,58 60,65 90,55 S150,40 180,48 S230,62 260,50 S310,30 340,38 S390,52 420,40 S470,18 500,20 L500,80 L0,80 Z';
const DASH_LENGTH = 620;

interface SplashScreenProps {
  isDark: boolean;
  onDone: () => void;
  c: Colors;
}

export function SplashScreen({ isDark, onDone, c }: SplashScreenProps) {
  // Chart line draw progress: 1 = fully drawn
  const dashOffset = useSharedValue(DASH_LENGTH);
  const chartOpacity = useSharedValue(0);
  const fillOpacity = useSharedValue(0);
  const dotOpacity = useSharedValue(0);

  // Logo animations
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);
  const logoY = useSharedValue(8);

  // Splash container fade-out
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.bezier(0.4, 0, 0.2, 1);

    // Chart draws in from t=0 over 1.6s
    chartOpacity.value = withDelay(80, withTiming(1, { duration: 200, easing: ease }));
    fillOpacity.value  = withDelay(80, withTiming(0.9, { duration: 300, easing: ease }));
    dashOffset.value   = withDelay(80, withTiming(0, { duration: 1500, easing: ease }));
    dotOpacity.value   = withDelay(80, withTiming(1, { duration: 300, easing: ease }));

    // Logo springs in at t=300ms
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 500, easing: ease }));
    logoScale.value   = withDelay(300, withSequence(
      withTiming(1.04, { duration: 360, easing: Easing.out(Easing.back(2)) }),
      withTiming(1.0,  { duration: 160, easing: ease }),
    ));
    logoY.value = withDelay(300, withTiming(0, { duration: 500, easing: ease }));

    // Fade out everything at 1.7s, call onDone at 2.1s
    const easeIn = Easing.bezier(0.4, 0, 1, 1);
    splashOpacity.value = withDelay(1700, withTiming(0, { duration: 420, easing: easeIn }));

    const timer = setTimeout(() => runOnJS(onDone)(), 2150);
    return () => clearTimeout(timer);
  }, []);

  const chartLineProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
    opacity: chartOpacity.value,
  }));
  const chartFillProps = useAnimatedProps(() => ({
    opacity: fillOpacity.value * 0.15,
  }));
  const dotProps = useAnimatedProps(() => ({
    opacity: dotOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: c.bg }, splashStyle]}>
      {/* Chart strip — bottom 20% */}
      <View style={styles.chartStrip} pointerEvents="none">
        <Svg
          width={SCREEN_W}
          height={80}
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={c.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={c.primary} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Gradient fill area */}
          <AnimatedPath
            animatedProps={chartFillProps}
            d={CHART_FILL}
            fill={`url(#chartFillGrad)`}
          />

          {/* Chart line */}
          <AnimatedPath
            animatedProps={chartLineProps}
            d={CHART_LINE}
            fill="none"
            stroke={c.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={DASH_LENGTH}
          />

          {/* Glowing dot at end */}
          <AnimatedCircle
            animatedProps={dotProps}
            cx={500}
            cy={20}
            r={4}
            fill={c.primary}
          />
        </Svg>
      </View>

      {/* Centered logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <LogoMark size={64} c={c} />
        <Text style={[styles.logoText, { color: c.text }]}>
          Aura<Text style={{ color: c.primary }}>Track</Text>
        </Text>
        <Text style={[styles.tagline, { color: c.textSub }]}>
          AI-Powered Personal Finance
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '20%',
    height: 80,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 30,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: -0.5,
    marginTop: 10,
  },
  tagline: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 4,
  },
});
