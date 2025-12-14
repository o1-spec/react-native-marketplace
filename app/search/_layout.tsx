import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        ...ScreenTransitions.slideAndFade,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  );
}