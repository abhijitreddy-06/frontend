import { Stack } from 'expo-router';
import { useTheme } from '../../context';

export default function ModalsLayout() {
  const { isDark, colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'modal',
        contentStyle: {
          backgroundColor: isDark ? colors.surface : colors.background,
        },
      }}
    >
      <Stack.Screen
        name="add-birthday"
        options={{
          title: 'Add Birthday',
          headerStyle: {
            backgroundColor: isDark ? colors.surface : colors.background,
          },
          headerTintColor: isDark ? '#FFFFFF' : '#1A1A2E',
        }}
      />
    </Stack>
  );
}
