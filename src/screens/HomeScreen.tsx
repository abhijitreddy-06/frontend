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
  HomeIcon, SearchIcon, SettingsIcon, ChevronRightIcon,
} from '../components/Icons';
import { Colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Emoji theme toggle ────────────────────────────────────────────────────────
function ThemeToggle() {
  const { isDark, toggle, c } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, {
      duration: 280,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isDark]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#FEF3C7', '#172554'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#FDE68A', '#1E3A8A'],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [2, 30]) }],
  }));

  return (
    <Pressable onPress={toggle} hitSlop={10}>
      <Animated.View style={[styles.toggleTrack, trackStyle]}>
        {/* static emojis on each side */}
        <Text style={styles.toggleEmojiLeft}>☀️</Text>
        <Text style={styles.toggleEmojiRight}>🌙</Text>
        {/* sliding thumb */}
        <Animated.View style={[styles.toggleThumb, thumbStyle, {
          backgroundColor: isDark ? '#1D4ED8' : '#FFFFFF',
          shadowColor: isDark ? '#3B82F6' : '#000',
        }]}>
          <Text style={styles.toggleThumbEmoji}>{isDark ? '🌙' : '☀️'}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ── Fade-up wrapper ───────────────────────────────────────────────────────────
function FadeUp({
  children, delay = 0, style,
}: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(14);
  useEffect(() => {
    const ease = Easing.bezier(0.4, 0, 0.2, 1);
    opacity.value = withDelay(delay, withTiming(1, { duration: 350, easing: ease }));
    ty.value      = withDelay(delay, withTiming(0, { duration: 350, easing: ease }));
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
interface Service {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ color: string; size?: number; strokeWidth?: number }>;
  accent: string;
  accentBg: string;
  accentBgDark: string;
}

interface Group {
  label: string;
  emoji: string;
  items: Service[];
}

const GROUPS: Group[] = [
  {
    label: 'Financial',
    emoji: '💰',
    items: [
      { key: 'add_expense',    title: 'Add Expense',      description: 'Record a new spending entry',     icon: MinusCircleIcon,    accent: '#EF4444', accentBg: '#FEF2F2', accentBgDark: 'rgba(239,68,68,0.13)' },
      { key: 'add_income',     title: 'Add Income',       description: 'Log salary, freelance & earnings', icon: PlusCircleIcon,     accent: '#10B981', accentBg: '#ECFDF5', accentBgDark: 'rgba(16,185,129,0.13)' },
      { key: 'planned',        title: 'Planned Expenses', description: 'Schedule future spending',         icon: CalendarCheckIcon,  accent: '#8B5CF6', accentBg: '#F5F3FF', accentBgDark: 'rgba(139,92,246,0.13)' },
      { key: 'transactions',   title: 'Transactions',     description: 'Browse your full history',         icon: ListIcon,           accent: '#3B82F6', accentBg: '#EFF6FF', accentBgDark: 'rgba(59,130,246,0.13)' },
      { key: 'reports',        title: 'Reports',          description: 'Charts, trends & insights',        icon: BarChart2Icon,      accent: '#0EA5E9', accentBg: '#F0F9FF', accentBgDark: 'rgba(14,165,233,0.13)' },
      { key: 'budget',         title: 'Budget',           description: 'Set and track spending limits',    icon: CreditCardIcon,     accent: '#F59E0B', accentBg: '#FFFBEB', accentBgDark: 'rgba(245,158,11,0.13)' },
      { key: 'savings',        title: 'Savings Goals',    description: 'Save smarter, reach goals faster', icon: PiggyBankIcon,      accent: '#10B981', accentBg: '#ECFDF5', accentBgDark: 'rgba(16,185,129,0.13)' },
      { key: 'debt',           title: 'Debt Tracker',     description: 'Track everything you owe',         icon: ArrowRightLeftIcon, accent: '#EF4444', accentBg: '#FEF2F2', accentBgDark: 'rgba(239,68,68,0.13)' },
      { key: 'lending',        title: 'Lending Tracker',  description: 'Know who owes you money',          icon: HandshakeIcon,      accent: '#F97316', accentBg: '#FFF7ED', accentBgDark: 'rgba(249,115,22,0.13)' },
      { key: 'subscriptions',  title: 'Subscriptions',    description: 'Monitor recurring payments',       icon: RepeatIcon,         accent: '#8B5CF6', accentBg: '#F5F3FF', accentBgDark: 'rgba(139,92,246,0.13)' },
    ],
  },
  {
    label: 'Productivity',
    emoji: '⚡',
    items: [
      { key: 'todo',       title: 'Todo',           description: 'Manage daily tasks & priorities',  icon: CheckSquareIcon, accent: '#6366F1', accentBg: '#EEF2FF', accentBgDark: 'rgba(99,102,241,0.13)' },
      { key: 'habits',     title: 'Habits',         description: 'Build and track daily routines',   icon: ActivityIcon,    accent: '#EC4899', accentBg: '#FDF2F8', accentBgDark: 'rgba(236,72,153,0.13)' },
      { key: 'passwords',  title: 'Password Vault', description: 'Secure credential storage',        icon: LockIcon,        accent: '#64748B', accentBg: '#F8FAFC', accentBgDark: 'rgba(100,116,139,0.15)' },
      { key: 'notes',      title: 'Notes',          description: 'Capture ideas and quick notes',    icon: NoteIcon,        accent: '#F59E0B', accentBg: '#FFFBEB', accentBgDark: 'rgba(245,158,11,0.13)' },
      { key: 'reminders',  title: 'Reminders',      description: 'Never miss important moments',     icon: AlarmClockIcon,  accent: '#14B8A6', accentBg: '#F0FDFA', accentBgDark: 'rgba(20,184,166,0.13)' },
      { key: 'documents',  title: 'Documents',      description: 'Store and organise your files',    icon: FolderIcon,      accent: '#F97316', accentBg: '#FFF7ED', accentBgDark: 'rgba(249,115,22,0.13)' },
    ],
  },
];

// ── Service row card ──────────────────────────────────────────────────────────
function ServiceRow({
  service,
  delay,
  isDark,
  c,
}: {
  service: Service;
  delay: number;
  isDark: boolean;
  c: Colors;
}) {
  const Icon = service.icon;
  const scale   = useSharedValue(1);
  const arrowX  = useSharedValue(0);
  const bgAlpha = useSharedValue(0);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }],
    opacity: interpolate(arrowX.value, [0, 6], [0.5, 1]),
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgAlpha.value,
  }));

  const onPressIn = () => {
    scale.value   = withSpring(0.975, { damping: 18, stiffness: 420 });
    arrowX.value  = withSpring(6,     { damping: 14, stiffness: 380 });
    bgAlpha.value = withTiming(1, { duration: 120 });
  };
  const onPressOut = () => {
    scale.value   = withSpring(1,  { damping: 14, stiffness: 300 });
    arrowX.value  = withSpring(0,  { damping: 14, stiffness: 340 });
    bgAlpha.value = withTiming(0, { duration: 180 });
  };

  const iconBg = isDark ? service.accentBgDark : service.accentBg;

  return (
    <FadeUp delay={delay}>
      <Animated.View style={cardAnim}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[
            styles.serviceRow,
            {
              backgroundColor: c.card,
              borderColor: c.border,
              shadowColor: isDark ? '#000' : '#94A3B8',
              shadowOpacity: isDark ? 0.22 : 0.07,
            },
          ]}
        >
          {/* press highlight overlay */}
          <Animated.View
            style={[
              styles.pressOverlay,
              { backgroundColor: service.accent },
              bgStyle,
            ]}
            pointerEvents="none"
          />

          {/* icon */}
          <View style={[styles.rowIconWrap, { backgroundColor: iconBg }]}>
            <Icon color={service.accent} size={22} strokeWidth={1.8} />
          </View>

          {/* text */}
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: c.text }]} numberOfLines={1}>
              {service.title}
            </Text>
            <Text style={[styles.rowDesc, { color: c.textMuted }]} numberOfLines={1}>
              {service.description}
            </Text>
          </View>

          {/* animated arrow */}
          <Animated.View style={arrowStyle}>
            <ChevronRightIcon color={c.textMuted} size={18} strokeWidth={2} />
          </Animated.View>
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
  item, active, c, onPress,
}: {
  item: typeof NAV_ITEMS[0];
  active: boolean;
  c: Colors;
  onPress: () => void;
}) {
  const prog = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    prog.value = withTiming(active ? 1 : 0, {
      duration: 220, easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [active]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: prog.value,
    transform: [{ scaleX: interpolate(prog.value, [0, 1], [0.4, 1]) }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(prog.value, [0, 1], [0, -2]) }],
  }));

  const { Icon } = item;
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      <Animated.View style={[styles.navPill, { backgroundColor: c.primaryLight }, pillStyle]} />
      <Animated.View style={iconStyle}>
        <Icon color={active ? c.primary : c.textMuted} size={22} strokeWidth={active ? 2.4 : 1.8} />
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

// ── HomeScreen ────────────────────────────────────────────────────────────────
export function HomeScreen() {
  const { isDark, c } = useTheme();
  const [activeNav, setActiveNav] = useState<NavKey>('home');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // flat delay counter across all groups
  let delayCounter = 0;

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <FadeUp delay={0}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={[styles.greeting, { color: c.textSub }]}>Good Morning 👋</Text>
                <Text style={[styles.userName, { color: c.text }]}>Alex Johnson</Text>
                <Text style={[styles.dateText, { color: c.textMuted }]}>{today}</Text>
              </View>
              <View style={styles.headerRight}>
                <ThemeToggle />
                <Pressable style={[styles.avatar, {
                  backgroundColor: c.primaryLight,
                  borderColor: c.primary,
                }]}>
                  <Text style={[styles.avatarText, { color: c.primary }]}>AJ</Text>
                </Pressable>
              </View>
            </View>
          </FadeUp>

          {/* ── Groups ── */}
          {GROUPS.map(group => (
            <View key={group.label} style={styles.group}>
              {/* group header */}
              <FadeUp delay={delayCounter * 30}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupEmoji}>{group.emoji}</Text>
                  <Text style={[styles.groupLabel, { color: c.text }]}>{group.label}</Text>
                  <View style={[styles.groupLine, { backgroundColor: c.border }]} />
                </View>
              </FadeUp>

              {/* service rows */}
              {group.items.map(svc => {
                delayCounter++;
                const d = delayCounter * 30;
                return (
                  <ServiceRow
                    key={svc.key}
                    service={svc}
                    delay={d}
                    isDark={isDark}
                    c={c}
                  />
                );
              })}
            </View>
          ))}

          <View style={{ height: 28 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Floating Bottom Nav ── */}
      <View
        style={[styles.navWrapper, {
          shadowColor: isDark ? '#000' : '#64748B',
          shadowOpacity: isDark ? 0.45 : 0.1,
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
                onPress={() => setActiveNav(item.key)}
              />
            ))}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:          { flex: 1 },
  safe:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 110 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 28, gap: 12,
  },
  headerLeft:  { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 2 },
  greeting:    { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', marginBottom: 3 },
  userName:    { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: -0.3, lineHeight: 28 },
  dateText:    { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 3 },

  // Avatar
  avatar: {
    width: 42, height: 42, borderRadius: 13, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold' },

  // Theme toggle
  toggleTrack: {
    width: 58, height: 30, borderRadius: 15, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 4, justifyContent: 'space-between',
    overflow: 'hidden',
  },
  toggleEmojiLeft:  { fontSize: 13, lineHeight: 18, zIndex: 0 },
  toggleEmojiRight: { fontSize: 13, lineHeight: 18, zIndex: 0 },
  toggleThumb: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 2,
  },
  toggleThumbEmoji: { fontSize: 13, lineHeight: 18 },

  // Group
  group:       { marginBottom: 8 },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 12, marginTop: 4,
  },
  groupEmoji: { fontSize: 16 },
  groupLabel: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.3, textTransform: 'uppercase',
  },
  groupLine:  { flex: 1, height: 1 },

  // Service row
  serviceRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    paddingVertical: 14, paddingHorizontal: 16,
    marginBottom: 10, gap: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  rowIconWrap: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 14.5, fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 20, marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 17,
  },

  // Bottom nav
  navWrapper: {
    position: 'absolute', bottom: 0, left: 16, right: 16,
    shadowOffset: { width: 0, height: -4 }, shadowRadius: 20, borderRadius: 24,
  },
  navSafe: { borderRadius: 24 },
  navBar: {
    flexDirection: 'row', borderRadius: 24, borderWidth: 1,
    paddingTop: 12, paddingBottom: 12, paddingHorizontal: 4,
    alignItems: 'center', marginBottom: 8,
  },
  navItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 4, position: 'relative', paddingVertical: 2,
  },
  navPill: {
    position: 'absolute', top: -6,
    height: 3, width: 24, borderRadius: 99,
  },
  navLabel: { fontSize: 10.5 },
});
