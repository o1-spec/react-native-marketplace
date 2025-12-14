import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        ...ScreenTransitions.slideFromRight,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  );
}