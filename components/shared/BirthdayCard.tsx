import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Birthday } from '../../types';
import { useTheme } from '../../context';
import { useCountdown } from '../../hooks';
import { formatDate, getInitials, getBirthdayMessage } from '../../utils';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { Gift, Cake } from 'lucide-react-native';

interface BirthdayCardProps {
  birthday: Birthday;
  onPress?: () => void;
  compact?: boolean;
}

export function BirthdayCard({ birthday, onPress, compact = false }: BirthdayCardProps) {
  const { isDark, colors } = useTheme();
  const countdown = useCountdown(birthday, 60000); // Update every minute
  const initials = getInitials(birthday.name);
  const message = getBirthdayMessage(birthday);
  const formattedDate = formatDate(birthday);
  const isToday = countdown.isToday;

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.compactAvatar, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
          <Text style={[styles.compactInitials, { color: colors.primary }]}>{initials}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>{birthday.name}</Text>
          <Text style={[styles.compactDate, { color: colors.textSecondary }]}>{formattedDate}</Text>
        </View>
        <View style={[styles.compactCountdown, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
          <Text style={[styles.compactDays, { color: colors.primary }]}>{countdown.days}</Text>
          <Text style={[styles.compactDaysLabel, { color: colors.textSecondary }]}>days</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (isToday) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.birthdayBadge}>
            <Cake size={16} color="#FFFFFF" />
            <Text style={styles.birthdayBadgeText}>TODAY!</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.celebrationIcon}>
              <Gift size={20} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.cardName}>{birthday.name}</Text>
          <Text style={styles.cardMessage}>{message}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardDate}>{formattedDate}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardRow}>
        <View style={[styles.avatarSmall, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
          <Text style={[styles.avatarInitialsSmall, { color: colors.primary }]}>{initials}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardNameSmall, { color: colors.text }]} numberOfLines={1}>{birthday.name}</Text>
          <Text style={[styles.cardDateSmall, { color: colors.textSecondary }]}>{formattedDate}</Text>
        </View>
        <View style={styles.countdownContainer}>
          <View style={[styles.countdownCircle, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
            <Text style={[styles.countdownDays, { color: colors.primary }]}>{countdown.days}</Text>
            <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>days</Text>
          </View>
        </View>
      </View>
      {birthday.notes ? (
        <Text style={[styles.cardNotes, { color: colors.textSecondary }]} numberOfLines={2}>{birthday.notes}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsSmall: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  cardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardNameSmall: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDateSmall: {
    fontSize: FONT_SIZE.sm,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownDays: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  countdownLabel: {
    fontSize: FONT_SIZE.xs,
    marginTop: -2,
  },
  cardNotes: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    marginLeft: 52 + SPACING.md,
    lineHeight: 18,
  },
  // Card for today's birthday
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarInitials: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  celebrationIcon: {
    position: 'absolute',
    bottom: -4,
    right: widthPercent(-25),
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  birthdayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  birthdayBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  cardMessage: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    paddingTop: SPACING.sm,
  },
  cardDate: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  // Compact card styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  compactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactInitials: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  compactInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  compactName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactDate: {
    fontSize: FONT_SIZE.xs,
  },
  compactCountdown: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  compactDays: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  compactDaysLabel: {
    fontSize: FONT_SIZE.xs,
  },
});

function widthPercent(percent: number) {
  // Helper for positioning
  return percent - percent;
}
