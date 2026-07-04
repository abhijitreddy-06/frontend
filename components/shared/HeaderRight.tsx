import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sun, Moon, User } from 'lucide-react-native';
import { useTheme, useAuth } from '../../context';
import { SPACING, FONT_SIZE } from '../../constants';

interface HeaderRightProps {
  showThemeToggle?: boolean;
  showProfile?: boolean;
}

export function HeaderRight({ showThemeToggle = true, showProfile = true }: HeaderRightProps) {
  const { isDark, setThemeMode, themeMode } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  return (
    <View style={styles.container}>
      {showThemeToggle && (
        <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
          {themeMode === 'system' ? (
            <View style={styles.systemIndicator}>
              <Sun size={14} color={isDark ? '#FFFFFF' : '#1A1A2E'} strokeWidth={2} />
              <Moon size={14} color={isDark ? '#FFFFFF' : '#1A1A2E'} strokeWidth={2} style={styles.moonIcon} />
            </View>
          ) : isDark ? (
            <Moon size={22} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Sun size={22} color="#1A1A2E" strokeWidth={2} />
          )}
        </TouchableOpacity>
      )}

      {showProfile && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <User size={22} color={isDark ? '#FFFFFF' : '#1A1A2E'} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonIcon: {
    marginLeft: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
