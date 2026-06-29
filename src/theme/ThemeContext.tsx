import React, { createContext, useContext, useState } from 'react';
import { lightColors, darkColors, Colors } from './colors';

interface ThemeCtx {
  isDark: boolean;
  c: Colors;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  isDark: true,
  c: darkColors,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const c = isDark ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ isDark, c, toggle: () => setIsDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
