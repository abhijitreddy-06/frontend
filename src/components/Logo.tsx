import React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface LogoMarkProps {
  size?: number;
  c: Colors;
}

export function LogoMark({ size = 48, c }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={c.primary} />
          <Stop offset="100%" stopColor="#60A5FA" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoGrad)" />
      <Rect x="11" y="28" width="5" height="10" rx="2" fill="white" fillOpacity={0.6} />
      <Rect x="19" y="21" width="5" height="17" rx="2" fill="white" fillOpacity={0.8} />
      <Rect x="27" y="15" width="5" height="23" rx="2" fill="white" />
      <Path d="M34 13 L38 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M34 9 L38 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M38 9 L38 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

interface LogoProps {
  c: Colors;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export function Logo({ c, size = 'md', centered = false }: LogoProps) {
  const iconSize = size === 'lg' ? 56 : size === 'sm' ? 36 : 44;
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 18 : 22;
  return (
    <View style={[styles.logoContainer, centered && styles.centered]}>
      <LogoMark size={iconSize} c={c} />
      <Text style={[styles.logoText, { fontSize, color: c.text }]}>
        Aura<Text style={{ color: c.primary }}>Track</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  centered: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
});
