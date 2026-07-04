import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Hop as Home, CalendarDays, ChartPie as PieChart, Settings, User } from 'lucide-react-native';
import { useTheme } from '../../context';
import { HeaderRight } from '../../components/shared';

export default function TabsLayout() {
  const { isDark, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: isDark ? '#FFFFFF' : '#1A1A2E',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#1A1A2E',
        tabBarStyle: { display: 'none' },
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="birthdays"
        options={{
          title: 'Birthdays',
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
