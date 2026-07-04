import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Calendar, Bell, Moon, LogOut, ChevronRight, Trash2, Info } from 'lucide-react-native';
import { useTheme, useAuth } from '../../context';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDark, colors, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const getThemeName = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  const MenuItem = ({ icon: Icon, label, value, onPress, destructive = false }: any) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
        <Icon size={20} color={destructive ? colors.error : colors.text} />
      </View>
      <Text style={[styles.menuLabel, { color: destructive ? colors.error : colors.text }]}>{label}</Text>
      <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>
      <ChevronRight size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={isDark ? ['#FF6B6B', '#FF8E53'] : ['#FF6B6B', '#FF8E53']}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
        </LinearGradient>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={User}
              label="Edit Profile"
              onPress={() => {}}
            />
            <MenuItem
              icon={Mail}
              label="Email"
              value={user?.email || 'Not set'}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={Bell}
              label="Notifications"
              value="On"
              onPress={() => {}}
            />
            <MenuItem
              icon={Moon}
              label="Theme"
              value={getThemeName()}
              onPress={() => {
                if (themeMode === 'light') setThemeMode('dark');
                else if (themeMode === 'dark') setThemeMode('system');
                else setThemeMode('light');
              }}
            />
            <MenuItem
              icon={Calendar}
              label="Default Reminder"
              value="1 day before"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={Info}
              label="About Birthday Tracker"
              value="v1.0.0"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.menuSection}>
            <MenuItem
              icon={LogOut}
              label="Log Out"
              onPress={handleLogout}
            />
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuSection: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  menuValue: {
    fontSize: FONT_SIZE.sm,
    marginRight: SPACING.xs,
  },
  spacer: {
    height: SPACING.xl,
  },
});
