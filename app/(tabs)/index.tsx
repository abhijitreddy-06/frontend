import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Sparkles, CalendarDays } from 'lucide-react-native';
import { useTheme } from '../../context';
import { useBirthdays } from '../../hooks';
import { BirthdayCard, FloatingNav, HeaderRight, EmptyState } from '../../components/shared';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { Birthday } from '../../types';
import { sortBirthdaysByUpcoming } from '../../utils';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { birthdays, isLoading, refresh } = useBirthdays();
  const [refreshing, setRefreshing] = useState(false);

  const upcomingBirthdays = birthdays.slice(0, 3);
  const restBirthdays = birthdays.slice(3);
  const hasBirthdays = birthdays.length > 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerSpacer} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {upcomingBirthdays.length > 0 && upcomingBirthdays[0] && (
          <View style={styles.highlightSection}>
            <BirthdayCard birthday={upcomingBirthdays[0]} />
          </View>
        )}

        {upcomingBirthdays.length > 1 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Sparkles size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Coming Up</Text>
              </View>
            </View>
            {upcomingBirthdays.slice(1, 3).map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} compact />
            ))}
          </View>
        )}

        {restBirthdays.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CalendarDays size={18} color={colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>All Birthdays</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/birthdays')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {restBirthdays.slice(0, 5).map((birthday) => (
              <BirthdayCard key={birthday.id} birthday={birthday} compact />
            ))}
          </View>
        )}

        {!hasBirthdays && !isLoading && (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="cake"
              title="No Birthdays Yet"
              subtitle="Add your first birthday to never miss a special day!"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/(modals)/add-birthday')}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.addButtonGradient}
              >
                <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addButtonText}>Add Birthday</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {hasBirthdays && (
        <TouchableOpacity
          style={styles.floatingAdd}
          onPress={() => router.push('/(modals)/add-birthday')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.floatingAddGradient}
          >
            <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      )}

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  highlightSection: {
    marginTop: SPACING.sm,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl * 2,
  },
  addButton: {
    marginTop: SPACING.lg,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 120,
  },
  floatingAdd: {
    position: 'absolute',
    bottom: 110,
    right: SPACING.md,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAddGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
