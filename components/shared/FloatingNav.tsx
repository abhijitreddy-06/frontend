import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, CalendarDays, PieChart, Settings, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context';
import { SPACING } from '../../constants';

const tabs = [
  { name: '/(tabs)', icon: Home, label: 'Home' },
  { name: '/(tabs)/birthdays', icon: CalendarDays, label: 'Birthdays' },
  { name: '/(tabs)/analytics', icon: PieChart, label: 'Analytics' },
  { name: '/(tabs)/settings', icon: Settings, label: 'Settings' },
];

export function FloatingNav() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (tabPath: string) => {
    if (tabPath === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/index';
    }
    return pathname?.includes(tabPath.replace('/(tabs)/', ''));
  };

  return (
    <View style={[styles.floatingBar, { backgroundColor: isDark ? 'rgba(26,26,46,0.95)' : 'rgba(255,255,255,0.95)' }]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const active = isActive(tab.name);
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => router.push(tab.name as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                {active ? (
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    style={styles.gradientIcon}
                  >
                    <Icon size={22} color="#FFFFFF" strokeWidth={2.5} />
                  </LinearGradient>
                ) : (
                  <Icon size={22} color={isDark ? '#9CA3AF' : '#6B7280'} strokeWidth={2} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push('/(tabs)/profile')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.profileGradient}
        >
          <User size={20} color="#FFFFFF" strokeWidth={2.5} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    marginLeft: SPACING.sm,
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});
