export interface Birthday {
  id: string;
  name: string;
  date: string;
  month: number;
  day: number;
  year?: number;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  notifications: boolean;
  reminderDays: number;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isTomorrow: boolean;
  age?: number;
}
