import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { CalendarDays, Cake, PartyPopper, Search, AlertCircle } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: 'cake' | 'calendar' | 'party' | 'search' | 'alert';
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'cake', title, subtitle }: EmptyStateProps) {
  const { isDark, colors } = useTheme();

  const IconComponent = {
    cake: Cake,
    calendar: CalendarDays,
    party: PartyPopper,
    search: Search,
    alert: AlertCircle,
  }[icon];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,107,107,0.15)' : 'rgba(255,107,107,0.1)' }]}>
        <IconComponent size={40} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
