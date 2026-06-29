import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../theme/colors';

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.3 30.2 0 24 0 14.7 0 6.8 5.4 3 13.3l7.8 6C12.6 13 17.9 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.5 37.7 46.5 31.5 46.5 24.5z" />
      <Path fill="#FBBC05" d="M10.8 28.7A14.3 14.3 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.1z" />
      <Path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8C29.6 38.6 27 39.5 24 39.5c-6.1 0-11.4-3.6-13.2-8.8l-8.3 6.1C6.8 44.7 14.7 48 24 48z" />
    </Svg>
  );
}

interface GoogleButtonProps {
  c: Colors;
  isDark: boolean;
}

export function GoogleButton({ c, isDark }: GoogleButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: pressed
            ? isDark ? '#1E2D40' : '#F8FAFC'
            : isDark ? c.card : '#FFFFFF',
          borderColor: pressed ? c.primary : c.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: pressed ? 4 : 1 },
          shadowOpacity: pressed ? (isDark ? 0.3 : 0.1) : 0,
          shadowRadius: pressed ? 8 : 2,
          elevation: pressed ? 4 : 0,
          transform: [{ translateY: pressed ? -1 : 0 }],
        },
      ]}
    >
      <GoogleIcon />
      <Text style={[styles.label, { color: c.text }]}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
