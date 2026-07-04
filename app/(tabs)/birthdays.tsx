import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search, ListSortAscending as SortAsc, CalendarDays, Cake, ListFilter as Filter } from 'lucide-react-native';
import { useTheme } from '../../context';
import { useBirthdays } from '../../hooks';
import { BirthdayCard, FloatingNav, EmptyState } from '../../components/shared';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { Birthday } from '../../types';
import { sortBirthdaysByUpcoming, formatDate, getBirthdayMessage, getInitials } from '../../utils';

export default function BirthdaysScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { birthdays, isLoading, refresh, deleteBirthday } = useBirthdays();
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'upcoming' | 'name' | 'date'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredBirthdays = birthdays.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBirthdays = [...filteredBirthdays].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return (a.month * 100 + a.day) - (b.month * 100 + b.day);
      default:
        return sortBirthdaysByUpcoming([a, b])[0] === a ? -1 : 1;
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = (birthday: Birthday) => {
    Alert.alert(
      'Delete Birthday',
      `Are you sure you want to delete ${birthday.name}'s birthday?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBirthday(birthday.id);
          },
        },
      ]
    );
  };

  const renderBirthday = ({ item, index }: { item: Birthday; index: number }) => {
    return (
      <View style={styles.birthdayItem}>
        <View style={styles.birthdayRow}>
          <View style={[styles.avatar, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.birthdayInfo}>
            <Text style={[styles.birthdayName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.birthdayDate, { color: colors.textSecondary }]}>{formatDate(item)}</Text>
            {item.notes && (
              <Text style={[styles.birthdayNotes, { color: colors.textMuted }]} numberOfLines={1}>{item.notes}</Text>
            )}
          </View>
          <View style={styles.birthdayCountdown}>
            <View style={[styles.countdownBadge, { backgroundColor: isDark ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)' }]}>
              <Text style={[styles.countdownDays, { color: colors.primary }]}>
                {getBirthdayMessage(item).split(' ')[0]}
              </Text>
              <Text style={[styles.countdownLabel, { color: colors.textSecondary }]}>days</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerSpacer} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? colors.surface : colors.background }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortBy(s => s === 'upcoming' ? 'name' : s === 'name' ? 'date' : 'upcoming')}
          >
            <View style={[styles.filterButtonInner, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              {sortBy === 'upcoming' ? (
                <SortAsc size={16} color={colors.text} />
              ) : sortBy === 'name' ? (
                <Filter size={16} color={colors.text} />
              ) : (
                <CalendarDays size={16} color={colors.text} />
              )}
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                {sortBy === 'upcoming' ? 'Upcoming' : sortBy === 'name' ? 'Name' : 'Date'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {filteredBirthdays.length} birthday{filteredBirthdays.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {sortedBirthdays.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="cake"
            title="No Birthdays"
            subtitle={searchQuery ? `No birthdays matching "${searchQuery}"` : "Add your first birthday to get started!"}
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
      ) : (
        <FlatList
          data={sortedBirthdays}
          keyExtractor={(item) => item.id}
          renderItem={renderBirthday}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {sortedBirthdays.length > 0 && (
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
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  filterButton: {},
  filterButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  filterLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: FONT_SIZE.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
  birthdayItem: {
    paddingVertical: SPACING.sm,
  },
  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  birthdayInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  birthdayName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  birthdayDate: {
    fontSize: FONT_SIZE.sm,
  },
  birthdayNotes: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  birthdayCountdown: {
    marginRight: SPACING.sm,
  },
  countdownBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  countdownDays: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  countdownLabel: {
    fontSize: FONT_SIZE.xs,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: FONT_SIZE.xl,
    color: '#EF4444',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
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
