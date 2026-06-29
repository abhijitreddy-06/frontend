import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  withSpring, Easing, useAnimatedProps,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { SpendingChart } from '../components/SpendingChart';
import {
  BellIcon, PlusCircleIcon, MinusCircleIcon, ArrowRightLeftIcon, ScanIcon,
  TrendingUpIcon, TrendingDownIcon, HomeIcon, ListIcon, BarChart2Icon,
  UserCircleIcon, PlusIcon, LightbulbIcon, ShoppingBagIcon, CoffeeIcon,
  ZapIcon, CarIcon, ChevronRightIcon, ArrowDownLeftIcon, ArrowUpRightIcon,
} from '../components/Icons';
import { Colors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Animated counter ──────────────────────────────────────────────────────────
const AnimatedText = Animated.createAnimatedComponent(Text);

function useCounter(target: number, delay = 0, duration = 1000) {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = withDelay(delay, withTiming(target, { duration, easing: Easing.out(Easing.cubic) }));
  }, [target]);
  return value;
}

function CounterText({
  value: sv, prefix = '', suffix = '', style,
  decimals = 0,
}: {
  value: Animated.SharedValue<number>;
  prefix?: string; suffix?: string;
  style?: any; decimals?: number;
}) {
  const [display, setDisplay] = useState('0');
  sv.addListener(0, v => {
    setDisplay(v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  });
  useEffect(() => () => { sv.removeListener(0); }, []);
  return <Text style={style}>{prefix}{display}{suffix}</Text>;
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function ProgressBar({ percent, color, delay = 0, c }: { percent: number; color: string; delay?: number; c: Colors }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withDelay(delay, withTiming(percent, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [percent]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as any }));
  return (
    <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
      <Animated.View style={[styles.progressFill, { backgroundColor: color }, barStyle]} />
    </View>
  );
}

// ── Fade-up card ──────────────────────────────────────────────────────────────
function FadeCard({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);
  useEffect(() => {
    const ease = Easing.bezier(0.4, 0, 0.2, 1);
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: ease }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400, easing: ease }));
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const CHART_DATA = {
  week:  [420, 380, 510, 460, 390, 530, 480],
  month: [3200, 2900, 3400, 3100, 2800, 3600, 3200, 3500, 3300, 3800, 3600, 3900],
  year:  [28000, 31000, 29500, 33000, 30500, 34000, 32000, 35500, 33000, 36000, 34500, 38000],
};

const TRANSACTIONS = [
  { id: 1, name: 'Amazon Shopping', category: 'Shopping', amount: -84.99,  date: 'Today, 2:30 PM',   icon: ShoppingBagIcon, color: '#8B5CF6' },
  { id: 2, name: 'Salary Deposit',  category: 'Income',   amount: 4200.00, date: 'Today, 9:00 AM',   icon: ArrowDownLeftIcon, color: '#10B981' },
  { id: 3, name: 'Starbucks Coffee',category: 'Food',     amount: -6.50,   date: 'Yesterday, 8:14 AM', icon: CoffeeIcon,  color: '#F59E0B' },
  { id: 4, name: 'Electricity Bill', category: 'Utilities',amount: -112.00,date: 'Jun 27',           icon: ZapIcon,     color: '#EF4444' },
  { id: 5, name: 'Uber Ride',        category: 'Transport',amount: -18.40, date: 'Jun 26',           icon: CarIcon,     color: '#3B82F6' },
];

const BUDGETS = [
  { name: 'Shopping',  spent: 340, total: 500,  color: '#8B5CF6' },
  { name: 'Food & Dining', spent: 280, total: 350, color: '#F59E0B' },
  { name: 'Transport', spent: 95, total: 200,  color: '#3B82F6' },
];

const NAV_ITEMS = [
  { key: 'home',   label: 'Home',         Icon: HomeIcon },
  { key: 'txns',   label: 'Transactions', Icon: ListIcon },
  { key: 'add',    label: '',             Icon: PlusIcon },
  { key: 'analytics', label: 'Analytics', Icon: BarChart2Icon },
  { key: 'profile',  label: 'Profile',   Icon: UserCircleIcon },
] as const;

type NavKey = typeof NAV_ITEMS[number]['key'];
type ChartRange = 'week' | 'month' | 'year';

// ── Main HomeScreen ───────────────────────────────────────────────────────────
export function HomeScreen() {
  const { isDark, c } = useTheme();
  const [activeNav, setActiveNav] = useState<NavKey>('home');
  const [chartRange, setChartRange] = useState<ChartRange>('month');

  const balanceCount  = useCounter(12480.50, 200, 1100);
  const incomeCount   = useCounter(4200, 300, 900);
  const expenseCount  = useCounter(1840, 300, 900);

  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const pressFab = () => {
    fabScale.value = withSpring(0.88, { damping: 8 });
    setTimeout(() => { fabScale.value = withSpring(1, { damping: 10 }); }, 120);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      {/* Scrollable body */}
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header ── */}
          <FadeCard delay={0}>
            <View style={styles.header}>
              <View>
                <Text style={[styles.greeting, { color: c.textSub }]}>Good Morning 👋</Text>
                <Text style={[styles.userName, { color: c.text }]}>Alex Johnson</Text>
              </View>
              <View style={styles.headerRight}>
                <Pressable style={[styles.iconBtn, { backgroundColor: c.card, borderColor: c.border }]}>
                  <BellIcon color={c.textSub} size={20} />
                  {/* Notification dot */}
                  <View style={[styles.notifDot, { backgroundColor: c.expense }]} />
                </Pressable>
                <Pressable style={[styles.avatar, { backgroundColor: c.primaryLight, borderColor: c.primary }]}>
                  <Text style={[styles.avatarText, { color: c.primary }]}>AJ</Text>
                </Pressable>
              </View>
            </View>
          </FadeCard>

          {/* ── Balance Card ── */}
          <FadeCard delay={80}>
            <LinearGradient
              colors={isDark ? ['#1E3A8A', '#1D4ED8'] : ['#2563EB', '#1D4ED8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.balanceCard, styles.card]}
            >
              {/* Subtle grid overlay */}
              <View style={styles.cardGridOverlay} pointerEvents="none" />

              <Text style={styles.balanceLabel}>Total Balance</Text>
              <CounterText
                value={balanceCount}
                prefix="$"
                decimals={2}
                style={styles.balanceAmount}
              />

              <View style={styles.balanceChangeRow}>
                <TrendingUpIcon color="rgba(255,255,255,0.8)" size={14} />
                <Text style={styles.balanceChange}>+2.4% this month</Text>
              </View>

              <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />

              <View style={styles.balanceStats}>
                <View style={styles.statBlock}>
                  <View style={styles.statLabelRow}>
                    <ArrowDownLeftIcon color="rgba(255,255,255,0.7)" size={13} />
                    <Text style={styles.statLabel}>Income</Text>
                  </View>
                  <CounterText
                    value={incomeCount}
                    prefix="$"
                    decimals={2}
                    style={styles.statAmount}
                  />
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
                <View style={styles.statBlock}>
                  <View style={styles.statLabelRow}>
                    <ArrowUpRightIcon color="rgba(255,255,255,0.7)" size={13} />
                    <Text style={styles.statLabel}>Expenses</Text>
                  </View>
                  <CounterText
                    value={expenseCount}
                    prefix="$"
                    decimals={2}
                    style={styles.statAmount}
                  />
                </View>
              </View>
            </LinearGradient>
          </FadeCard>

          {/* ── Quick Actions ── */}
          <FadeCard delay={160}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Quick Actions</Text>
            </View>
            <View style={styles.quickActions}>
              {[
                { label: 'Add\nExpense', Icon: MinusCircleIcon, color: c.expense, bg: isDark ? 'rgba(239,68,68,0.12)' : '#FEF2F2' },
                { label: 'Add\nIncome',  Icon: PlusCircleIcon,  color: c.success, bg: isDark ? 'rgba(16,185,129,0.12)' : '#ECFDF5' },
                { label: 'Transfer',     Icon: ArrowRightLeftIcon, color: c.primary, bg: isDark ? 'rgba(59,130,246,0.12)' : '#EFF6FF' },
                { label: 'Scan\nReceipt',Icon: ScanIcon,        color: c.warning, bg: isDark ? 'rgba(245,158,11,0.12)' : '#FFFBEB' },
              ].map(({ label, Icon, color, bg }) => (
                <Pressable
                  key={label}
                  style={({ pressed }) => [
                    styles.quickAction,
                    { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }] },
                  ]}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: bg }]}>
                    <Icon color={color} size={22} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: c.textSub }]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </FadeCard>

          {/* ── Spending Overview ── */}
          <FadeCard delay={240} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardTitle, { color: c.text }]}>Spending Overview</Text>
                <Text style={[styles.cardSub, { color: c.textMuted }]}>
                  {chartRange === 'week' ? 'This week' : chartRange === 'month' ? 'This month' : 'This year'}
                </Text>
              </View>
              <View style={[styles.rangeToggle, { backgroundColor: c.bgSubtle }]}>
                {(['week', 'month', 'year'] as ChartRange[]).map(r => (
                  <Pressable
                    key={r}
                    onPress={() => setChartRange(r)}
                    style={[
                      styles.rangeBtn,
                      chartRange === r && { backgroundColor: c.card,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
                    ]}
                  >
                    <Text style={[styles.rangeBtnText, {
                      color: chartRange === r ? c.primary : c.textMuted,
                      fontFamily: chartRange === r ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_400Regular',
                    }]}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <SpendingChart data={CHART_DATA[chartRange]} c={c} />

            {/* X-axis labels */}
            <View style={styles.chartLabels}>
              {(chartRange === 'week'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : chartRange === 'month'
                ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                : ['Q1', '', 'Q2', '', 'Q3', '', 'Q4', '', '', '', '', '']
              ).map((l, i) => (
                <Text key={i} style={[styles.chartLabel, { color: c.textMuted }]}>{l}</Text>
              ))}
            </View>
          </FadeCard>

          {/* ── Recent Transactions ── */}
          <FadeCard delay={320}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Recent Transactions</Text>
              <Pressable style={styles.viewAllBtn}>
                <Text style={[styles.viewAllText, { color: c.primary }]}>View All</Text>
                <ChevronRightIcon color={c.primary} size={14} />
              </Pressable>
            </View>

            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, gap: 0 }]}>
              {TRANSACTIONS.map((tx, idx) => {
                const Icon = tx.icon;
                const isIncome = tx.amount > 0;
                return (
                  <View key={tx.id}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.txRow,
                        { opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <View style={[styles.txIcon, { backgroundColor: tx.color + '18' }]}>
                        <Icon color={tx.color} size={18} />
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={[styles.txName, { color: c.text }]}>{tx.name}</Text>
                        <Text style={[styles.txCat, { color: c.textMuted }]}>{tx.category} · {tx.date}</Text>
                      </View>
                      <Text style={[styles.txAmount, { color: isIncome ? c.success : c.expense }]}>
                        {isIncome ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </Text>
                    </Pressable>
                    {idx < TRANSACTIONS.length - 1 && (
                      <View style={[styles.txDivider, { backgroundColor: c.border }]} />
                    )}
                  </View>
                );
              })}
            </View>
          </FadeCard>

          {/* ── Budget Progress ── */}
          <FadeCard delay={400}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: c.text }]}>Budget Progress</Text>
              <Pressable style={styles.viewAllBtn}>
                <Text style={[styles.viewAllText, { color: c.primary }]}>Manage</Text>
                <ChevronRightIcon color={c.primary} size={14} />
              </Pressable>
            </View>

            <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
              {BUDGETS.map((b, i) => {
                const pct = Math.round((b.spent / b.total) * 100);
                const over = pct >= 80;
                return (
                  <View key={b.name} style={i > 0 ? { marginTop: 16 } : undefined}>
                    <View style={styles.budgetRow}>
                      <View style={[styles.budgetDot, { backgroundColor: b.color }]} />
                      <Text style={[styles.budgetName, { color: c.text }]}>{b.name}</Text>
                      <Text style={[styles.budgetPct, { color: over ? c.expense : c.textMuted }]}>
                        {pct}%
                      </Text>
                    </View>
                    <ProgressBar
                      percent={pct}
                      color={over ? c.expense : b.color}
                      delay={400 + i * 120}
                      c={c}
                    />
                    <View style={styles.budgetAmounts}>
                      <Text style={[styles.budgetSpent, { color: c.textSub }]}>${b.spent} spent</Text>
                      <Text style={[styles.budgetTotal, { color: c.textMuted }]}>of ${b.total}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </FadeCard>

          {/* ── Smart Insight ── */}
          <FadeCard delay={480}>
            <LinearGradient
              colors={isDark ? ['#0F1929', '#0B1220'] : ['#EFF6FF', '#F8FAFC']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.insightCard, { borderColor: isDark ? c.border : '#BFDBFE' }]}
            >
              <View style={[styles.insightIcon, { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE' }]}>
                <LightbulbIcon color={c.primary} size={20} />
              </View>
              <View style={styles.insightBody}>
                <Text style={[styles.insightTitle, { color: c.text }]}>Smart Insight</Text>
                <Text style={[styles.insightText, { color: c.textSub }]}>
                  You've spent 32% less on dining this month. Keep it up — you're on track to save an extra{' '}
                  <Text style={{ color: c.success, fontFamily: 'PlusJakartaSans_700Bold' }}>$120</Text> by month-end.
                </Text>
              </View>
            </LinearGradient>
          </FadeCard>

          {/* Bottom spacer so content clears FAB + nav */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── FAB ── */}
      <Animated.View style={[styles.fab, fabStyle]}>
        <Pressable onPress={pressFab} style={styles.fabInner}>
          <LinearGradient
            colors={[c.primary, c.primaryHover]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <PlusIcon color="#fff" size={26} strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* ── Bottom Navigation ── */}
      <View style={[styles.bottomNav, {
        backgroundColor: c.card,
        borderTopColor: c.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.4 : 0.06,
        shadowRadius: 16,
        elevation: 12,
      }]}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.navItems}>
            {NAV_ITEMS.map(({ key, label, Icon }) => {
              if (key === 'add') {
                return <View key="add" style={styles.navPlaceholder} />;
              }
              const active = activeNav === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveNav(key as NavKey)}
                  style={styles.navItem}
                >
                  <Icon
                    color={active ? c.primary : c.textMuted}
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <Text style={[
                    styles.navLabel,
                    { color: active ? c.primary : c.textMuted,
                      fontFamily: active ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_400Regular' },
                  ]}>
                    {label}
                  </Text>
                  {active && (
                    <View style={[styles.navDot, { backgroundColor: c.primary }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  safe:        { flex: 1 },
  scroll:      { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },

  // Header
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting:    { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium' },
  userName:    { fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn:     { width: 40, height: 40, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  notifDot:    { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' },
  avatar:      { width: 40, height: 40, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold' },

  // Card base
  card: { borderRadius: 20, borderWidth: 1, padding: 18 },

  // Balance card
  balanceCard:    { borderWidth: 0 },
  cardGridOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20 },
  balanceLabel:   { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.72)', marginBottom: 8 },
  balanceAmount:  { fontSize: 38, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -1 },
  balanceChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  balanceChange:  { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.72)' },
  dividerLine:    { height: 1, marginVertical: 16 },
  balanceStats:   { flexDirection: 'row', gap: 0 },
  statBlock:      { flex: 1 },
  statLabelRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  statLabel:      { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(255,255,255,0.65)' },
  statAmount:     { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  statDivider:    { width: 1, marginHorizontal: 20 },

  // Quick actions
  sectionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:   { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold' },
  quickActions:   { flexDirection: 'row', gap: 10 },
  quickAction:    { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12, alignItems: 'center', gap: 9,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  quickActionIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel:{ fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', textAlign: 'center', lineHeight: 15 },

  // Chart
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle:     { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' },
  cardSub:       { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  rangeToggle:   { flexDirection: 'row', borderRadius: 10, padding: 3 },
  rangeBtn:      { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7 },
  rangeBtnText:  { fontSize: 12 },
  chartLabels:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  chartLabel:    { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular' },

  // Transactions
  viewAllBtn:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewAllText:   { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold' },
  txRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 18, gap: 12 },
  txIcon:        { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  txInfo:        { flex: 1 },
  txName:        { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold' },
  txCat:         { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  txAmount:      { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold' },
  txDivider:     { height: 1, marginHorizontal: 18 },

  // Budget
  budgetRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  budgetDot:     { width: 8, height: 8, borderRadius: 4 },
  budgetName:    { flex: 1, fontSize: 13.5, fontFamily: 'PlusJakartaSans_600SemiBold' },
  budgetPct:     { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold' },
  progressTrack: { height: 6, borderRadius: 99, overflow: 'hidden' },
  progressFill:  { height: 6, borderRadius: 99 },
  budgetAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  budgetSpent:   { fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium' },
  budgetTotal:   { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular' },

  // Insight
  insightCard:   { flexDirection: 'row', borderRadius: 20, borderWidth: 1, padding: 18, gap: 14, alignItems: 'flex-start' },
  insightIcon:   { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightBody:   { flex: 1 },
  insightTitle:  { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', marginBottom: 5 },
  insightText:   { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 20 },

  // FAB
  fab:        { position: 'absolute', bottom: 80, alignSelf: 'center', zIndex: 50 },
  fabInner:   { borderRadius: 28, overflow: 'hidden',
                shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45, shadowRadius: 16, elevation: 12 },
  fabGradient:{ width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 28 },

  // Bottom nav
  bottomNav:  { position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItems:   { flexDirection: 'row', paddingTop: 10, paddingHorizontal: 8 },
  navItem:    { flex: 1, alignItems: 'center', gap: 4, paddingBottom: 4 },
  navPlaceholder: { flex: 1 },
  navLabel:   { fontSize: 10.5 },
  navDot:     { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 0 },
});
