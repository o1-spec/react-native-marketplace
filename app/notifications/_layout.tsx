import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';

export default function NotificationsLayout() {
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