import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface ScreenToggleProps {
  screen: 'signin' | 'signup';
  onToggle: () => void;
  c: Colors;
  isDark: boolean;
}

export function ScreenToggle({ screen, onToggle, c, isDark }: ScreenToggleProps) {
  return (
    <View style={[styles.wrapper, { backgroundColor: c.bgSubtle, borderColor: c.border }]}>
      {(['signin', 'signup'] as const).map(s => {
        const active = screen === s;
        return (
          <Pressable
            key={s}
            onPress={() => !active && onToggle()}
            style={[
              styles.tab,
              active && {
                backgroundColor: c.card,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 4,
                elevation: active ? 2 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: active ? c.primary : c.textSub },
              ]}
            >
              {s === 'signin' ? 'Sign In' : 'Sign Up'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
