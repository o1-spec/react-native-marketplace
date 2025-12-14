import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';

export default function ChatLayout() {
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