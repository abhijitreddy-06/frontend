import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof Colors.light;
  spacing: typeof SPACING;
  fontSize: typeof FONT_SIZE;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const colorScheme: ColorScheme = themeMode === 'system'
    ? ((systemColorScheme === 'dark' ? 'dark' : 'light'))
    : themeMode;

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeModeState(saved as ThemeMode);
      }
    } catch {
      // Use default
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
  };

  const value: ThemeContextType = {
    themeMode,
    colorScheme,
    isDark,
    setThemeMode,
    colors: Colors[colorScheme],
    spacing: SPACING,
    fontSize: FONT_SIZE,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
