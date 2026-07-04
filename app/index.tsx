import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';
import { useAuth } from '../context';

export default function SplashScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  return (
    <LinearGradient
      colors={isDark ? ['#1A1A2E', '#0F0F1A'] : ['#FF6B6B', '#FF8E53']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎂</Text>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>Birthday</Text>
        <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>Tracker</Text>
        <View style={styles.loader}>
          <ActivityIndicator color="#FFFFFF" size="large" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 42,
    fontWeight: '300',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
