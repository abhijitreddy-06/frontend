import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  c: Colors;
}

export function ThemeToggle({ isDark, onToggle, c }: ThemeToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.btn, { backgroundColor: c.card, borderColor: c.border }]}
    >
      {/* Moon / Sun text icon fallback (lucide not imported here to keep it light) */}
      <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1E2D40' : '#F1F5F9' }]}>
        <Text style={{ fontSize: 10 }}>{isDark ? '🌙' : '☀️'}</Text>
      </View>
      <Text style={[styles.label, { color: c.textSub }]}>{isDark ? 'Dark' : 'Light'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
