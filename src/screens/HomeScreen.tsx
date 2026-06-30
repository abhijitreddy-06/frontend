import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSpring, Easing, interpolate, interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import {
  MinusCircleIcon, PlusCircleIcon, CalendarCheckIcon, ListIcon,
  BarChart2Icon, CreditCardIcon, PiggyBankIcon, ArrowRightLeftIcon,
  HandshakeIcon, CheckSquareIcon, ActivityIcon, LockIcon,
  NoteIcon, AlarmClockIcon, RepeatIcon, FolderIcon,
  HomeIcon, SearchIcon, SettingsIcon, SunIcon, MoonIcon,
} from '../components/Icons';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - 40 - CARD_GAP) / 2; // 20px padding each side

// ── Animated theme toggle ─────────────────────────────────────────────────────
function ThemeTogglePill() {
  const { isDark, toggle, c } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: 300, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  }, [isDark]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#E2E8F0', '#1E2D40'],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [3, 27]) }],
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#FFFFFF', '#3B82F6']),
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], 'clamp'),
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1], 'clamp'),
  }));

  return (
    <Pressable onPress={toggle} hitSlop={8}>
      <Animated.View style={[styles.toggleTrack, trackStyle]}>
        {/* Sun icon — left side */}
        <Animated.View style={[styles.toggleIconLeft, sunStyle]}>
          <SunIcon color="#F59E0B" size={12} strokeWidth={2.5} />
        </Animated.View>
        {/* Moon icon — right side */}
        <Animated.View style={[styles.toggleIconRight, moonStyle]}>
          <MoonIcon color="#93C5FD" size={12} strokeWidth={2.5} />
        </Animated.View>
        {/* Thumb */}
        <Animated.View style={[styles.toggleThumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

// ── Fade-up wrapper ───────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  useEffect(() => {
    const ease = Easing.bezier(0.4, 0, 0.2, 1);
    opacity.value    = withDelay(delay, withTiming(1, { duration: 380, easing: ease }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 380, easing: ease }));
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}

// ── Service card ──────────────────────────────────────────────────────────────
interface Service {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ color: string; size?: number; strokeWidth?: number }>;
  accent: string;        // icon tint
  accentBg: string;      // light icon bg (always defined; overridden for dark in render)
  accentBgDark: string;
}

const SERVICES: Service[] = [
  {
    key: 'add_expense',
    title: 'Add Expense',
    description: 'Record a spending',
    icon: MinusCircleIcon,
    accent: '#EF4444',
    accentBg: '#FEF2F2',
    accentBgDark: 'rgba(239,68,68,0.12)',
  },
  {
    key: 'add_income',
    title: 'Add Income',
    description: 'Log earnings',
    icon: PlusCircleIcon,
    accent: '#10B981',
    accentBg: '#ECFDF5',
    accentBgDark: 'rgba(16,185,129,0.12)',
  },
  {
    key: 'planned',
    title: 'Planned Expenses',
    description: 'Future spending',
    icon: CalendarCheckIcon,
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
    accentBgDark: 'rgba(139,92,246,0.12)',
  },
  {
    key: 'transactions',
    title: 'Transactions',
    description: 'Full history',
    icon: ListIcon,
    accent: '#3B82F6',
    accentBg: '#EFF6FF',
    accentBgDark: 'rgba(59,130,246,0.12)',
  },
  {
    key: 'reports',
    title: 'Reports',
    description: 'Charts & insights',
    icon: BarChart2Icon,
    accent: '#0EA5E9',
    accentBg: '#F0F9FF',
    accentBgDark: 'rgba(14,165,233,0.12)',
  },
  {
    key: 'budget',
    title: 'Budget',
    description: 'Spending limits',
    icon: CreditCardIcon,
    accent: '#F59E0B',
    accentBg: '#FFFBEB',
    accentBgDark: 'rgba(245,158,11,0.12)',
  },
  {
    key: 'savings',
    title: 'Savings Goals',
    description: 'Save smarter',
    icon: PiggyBankIcon,
    accent: '#10B981',
    accentBg: '#ECFDF5',
    accentBgDark: 'rgba(16,185,129,0.12)',
  },
  {
    key: 'debt',
    title: 'Debt Tracker',
    description: 'Track what you owe',
    icon: ArrowRightLeftIcon,
    accent: '#EF4444',
    accentBg: '#FEF2F2',
    accentBgDark: 'rgba(239,68,68,0.12)',
  },
  {
    key: 'lending',
    title: 'Lending Tracker',
    description: 'Track who owes you',
    icon: HandshakeIcon,
    accent: '#F97316',
    accentBg: '#FFF7ED',
    accentBgDark: 'rgba(249,115,22,0.12)',
  },
  {
    key: 'todo',
    title: 'Todo',
    description: 'Daily tasks',
    icon: CheckSquareIcon,
    accent: '#6366F1',
    accentBg: '#EEF2FF',
    accentBgDark: 'rgba(99,102,241,0.12)',
  },
  {
    key: 'habits',
    title: 'Habits',
    description: 'Build routines',
    icon: ActivityIcon,
    accent: '#EC4899',
    accentBg: '#FDF2F8',
    accentBgDark: 'rgba(236,72,153,0.12)',
  },
  {
    key: 'passwords',
    title: 'Password Vault',
    description: 'Secure storage',
    icon: LockIcon,
    accent: '#64748B',
    accentBg: '#F8FAFC',
    accentBgDark: 'rgba(100,116,139,0.14)',
  },
  {
    key: 'notes',
    title: 'Notes',
    description: 'Quick notes',
    icon: NoteIcon,
    accent: '#F59E0B',
    accentBg: '#FFFBEB',
    accentBgDark: 'rgba(245,158,11,0.12)',
  },
  {
    key: 'reminders',
    title: 'Reminders',
    description: 'Never forget',
    icon: AlarmClockIcon,
    accent: '#14B8A6',
    accentBg: '#F0FDFA',
    accentBgDark: 'rgba(20,184,166,0.12)',
  },
  {
    key: 'subscriptions',
    title: 'Subscriptions',
    description: 'Recurring costs',
    icon: RepeatIcon,
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
    accentBgDark: 'rgba(139,92,246,0.12)',
  },
  {
    key: 'documents',
    title: 'Documents',
    description: 'Store files',
    icon: FolderIcon,
    accent: '#F97316',
    accentBg: '#FFF7ED',
    accentBgDark: 'rgba(249,115,22,0.12)',
  },
];

function ServiceCard({
  service, index, isDark, c, onPress,
}: {
  service: Service;
  index: number;
  isDark: boolean;
  c: ReturnType<typeof useTheme>['c'];
  onPress: () => void;
}) {
  const Icon = service.icon;
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.88]),
  }));

  const handlePressIn = () => {
    scale.value  = withSpring(0.96, { damping: 15, stiffness: 400 });
    pressed.value = withTiming(1, { duration: 100 });
  };
  const handlePressOut = () => {
    scale.value  = withSpring(1, { damping: 12, stiffness: 300 });
    pressed.value = withTiming(0, { duration: 150 });
  };

  const iconBg = isDark ? service.accentBgDark : service.accentBg;

  return (
    <FadeUp delay={index * 35} style={{ width: CARD_W }}>
      <Animated.View style={cardAnim}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.serviceCard,
            {
              backgroundColor: c.card,
              borderColor: c.border,
              shadowColor: isDark ? '#000' : '#64748B',
              shadowOpacity: isDark ? 0.25 : 0.06,
            },
          ]}
        >
          <View style={[styles.serviceIconWrap, { backgroundColor: iconBg }]}>
            <Icon color={service.accent} size={24} strokeWidth={1.8} />
          </View>
          <Text style={[styles.serviceTitle, { color: c.text }]} numberOfLines={1}>
            {service.title}
          </Text>
          <Text style={[styles.serviceDesc, { color: c.textMuted }]} numberOfLines={2}>
            {service.description}
          </Text>
        </Pressable>
      </Animated.View>
    </FadeUp>
  );
}

// ── Bottom nav ────────────────────────────────────────────────────────────────
type NavKey = 'home' | 'analytics' | 'search' | 'settings';

const NAV_ITEMS: { key: NavKey; label: string; Icon: React.ComponentType<any> }[] = [
  { key: 'home',      label: 'Home',      Icon: HomeIcon },
  { key: 'analytics', label: 'Analytics', Icon: BarChart2Icon },
  { key: 'search',    label: 'Search',    Icon: SearchIcon },
  { key: 'settings',  label: 'Settings',  Icon: SettingsIcon },
];

function NavItem({
  item, active, c, isDark, onPress,
}: {
  item: typeof NAV_ITEMS[0];
  active: boolean;
  c: ReturnType<typeof useTheme>['c'];
  isDark: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 220, easing: Easing.bezier(0.4, 0, 0.2, 1) });
  }, [active]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.5, 1]) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -2]) }],
  }));

  const { Icon } = item;

  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      {/* Active indicator pill */}
      <Animated.View style={[styles.navPill, { backgroundColor: c.primaryLight }, pillStyle]} />
      <Animated.View style={iconStyle}>
        <Icon
          color={active ? c.primary : c.textMuted}
          size={22}
          strokeWidth={active ? 2.4 : 1.8}
        />
      </Animated.View>
      <Text style={[
        styles.navLabel,
        {
          color: active ? c.primary : c.textMuted,
          fontFamily: active ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_400Regular',
        },
      ]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

// ── Main HomeScreen ───────────────────────────────────────────────────────────
export function HomeScreen() {
  const { isDark, c } = useTheme();
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <FadeUp delay={0}>
            <View style={styles.header}>
              {/* Left: greeting */}
              <View style={styles.headerLeft}>
                <Text style={[styles.greeting, { color: c.textSub }]}>Good Morning 👋</Text>
                <Text style={[styles.userName, { color: c.text }]}>Alex Johnson</Text>
                <Text style={[styles.dateText, { color: c.textMuted }]}>{today}</Text>
              </View>

              {/* Right: theme toggle + avatar */}
              <View style={styles.headerRight}>
                <ThemeTogglePill />
                <Pressable style={[styles.avatar, {
                  backgroundColor: c.primaryLight,
                  borderColor: c.primary,
                }]}>
                  <Text style={[styles.avatarText, { color: c.primary }]}>AJ</Text>
                </Pressable>
              </View>
            </View>
          </FadeUp>

          {/* ── Section label ── */}
          <FadeUp delay={80}>
            <Text style={[styles.sectionLabel, { color: c.textSub }]}>Services</Text>
          </FadeUp>

          {/* ── 2-column grid ── */}
          <View style={styles.grid}>
            {SERVICES.map((svc, i) => (
              <ServiceCard
                key={svc.key}
                service={svc}
                index={i}
                isDark={isDark}
                c={c}
                onPress={() => {}}
              />
            ))}
          </View>

          {/* Bottom spacer */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Floating Bottom Navigation ── */}
      <View
        style={[styles.navWrapper, {
          shadowColor: isDark ? '#000' : '#64748B',
          shadowOpacity: isDark ? 0.5 : 0.1,
        }]}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={['bottom']} style={styles.navSafe}>
          <View style={[styles.navBar, {
            backgroundColor: c.card,
            borderColor: c.border,
          }]}>
            {NAV_ITEMS.map(item => (
              <NavItem
                key={item.key}
                item={item}
                active={activeNav === item.key}
                c={c}
                isDark={isDark}
                onPress={() => setActiveNav(item.key)}
              />
            ))}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeTop: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 2 },
  greeting: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', marginBottom: 3 },
  userName: { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: -0.3, lineHeight: 28 },
  dateText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 3 },

  // Avatar
  avatar: {
    width: 42, height: 42, borderRadius: 13, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold' },

  // Animated theme toggle
  toggleTrack: {
    width: 54, height: 30, borderRadius: 15,
    justifyContent: 'center',
    // icons sit on either side
  },
  toggleThumb: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleIconLeft: {
    position: 'absolute',
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconRight: {
    position: 'absolute',
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section label
  sectionLabel: {
    fontSize: 11.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // Service grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  serviceCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  serviceIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 18,
  },
  serviceDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 17,
  },

  // Bottom nav
  navWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
    borderRadius: 24,
  },
  navSafe: { borderRadius: 24 },
  navBar: {
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  navItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 4, position: 'relative', paddingVertical: 2,
  },
  navPill: {
    position: 'absolute',
    top: -6,
    height: 3,
    width: 24,
    borderRadius: 99,
  },
  navLabel: { fontSize: 10.5 },
});
