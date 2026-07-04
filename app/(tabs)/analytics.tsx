import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Users, Gift, TrendingUp, Cake, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context';
import { useBirthdays } from '../../hooks';
import { FloatingNav } from '../../components/shared';
import { SPACING, FONT_SIZE, BORDER_RADIUS, MONTHS_SHORT } from '../../constants';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { isDark, colors } = useTheme();
  const { birthdays } = useBirthdays();

  const totalBirthdays = birthdays.length;
  const thisMonth = new Date().getMonth() + 1;
  const birthdaysThisMonth = birthdays.filter(b => b.month === thisMonth).length;
  const birthdaysWithAge = birthdays.filter(b => b.year).length;

  const monthCount = new Array(12).fill(0);
  birthdays.forEach(b => {
    monthCount[b.month - 1]++;
  });

  const maxCount = Math.max(...monthCount, 1);

  const StatCard = ({ icon: Icon, value, label, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerSpacer} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Header */}
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Analytics</Text>
          <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
            Overview of your birthday reminders
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={Users}
            value={totalBirthdays}
            label="Total People"
            color="#FF6B6B"
          />
          <StatCard
            icon={Calendar}
            value={birthdaysThisMonth}
            label="This Month"
            color="#4ECDC4"
          />
          <StatCard
            icon={Gift}
            value={birthdaysWithAge}
            label="With Age"
            color="#FFE66D"
          />
          <StatCard
            icon={TrendingUp}
            value={birthdaysThisMonth > 0 ? '!' : '~'}
            label="Active"
            color="#10B981"
          />
        </View>

        {/* Monthly Distribution */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <View style={styles.chartHeader}>
            <Sparkles size={20} color={colors.primary} />
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Monthly Distribution
            </Text>
          </View>
          <View style={styles.chart}>
            {MONTHS_SHORT.map((month, index) => {
              const count = monthCount[index];
              const height = count > 0 ? Math.max((count / maxCount) * 120, 20) : 20;
              const isCurrentMonth = index + 1 === thisMonth;

              return (
                <View key={month} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor: isCurrentMonth
                            ? colors.primary
                            : isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.05)',
                        },
                      ]}
                    >
                      {count > 0 && (
                        <Text style={[styles.barValue, { color: isCurrentMonth ? '#FFFFFF' : colors.text }]}>
                          {count}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      { color: isCurrentMonth ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {month}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Upcoming Highlight */}
        {birthdays.slice(0, 3).length > 0 && (
          <View style={styles.highlightSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Coming Up
            </Text>
            {birthdays.slice(0, 3).map((birthday, index) => (
              <View
                key={birthday.id}
                style={[styles.highlightCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.highlightRank}>
                  <Text style={[styles.highlightRankText, { color: colors.primary }]}>
                    #{index + 1}
                  </Text>
                </View>
                <View style={styles.highlightInfo}>
                  <Text style={[styles.highlightName, { color: colors.text }]}>
                    {birthday.name}
                  </Text>
                  <Text style={[styles.highlightDate, { color: colors.textSecondary }]}>
                    {MONTHS_SHORT[birthday.month - 1]} {birthday.day}
                  </Text>
                </View>
                <View style={styles.highlightBadge}>
                  <Cake size={16} color={colors.primary} />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <FloatingNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSpacer: {
    height: 100,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  summaryHeader: {
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  summarySubtitle: {
    fontSize: FONT_SIZE.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: (width - SPACING.md * 2 - SPACING.md) / 2,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  chartCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: SPACING.xs,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  barLabel: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  highlightSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  highlightRank: {
    width: 40,
    alignItems: 'center',
  },
  highlightRankText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  highlightInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  highlightName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  highlightDate: {
    fontSize: FONT_SIZE.sm,
  },
  highlightBadge: {
    padding: SPACING.sm,
  },
  bottomSpacer: {
    height: 120,
  },
});
