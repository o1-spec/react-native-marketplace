import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';

export default function ProductLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
          ...ScreenTransitions.zoomIn,
        }} 
      />
      <Stack.Screen 
        name="edit/[id]" 
        options={{ 
          title: 'Edit Listing',
          headerBackTitle: 'Back',
          ...ScreenTransitions.slideFromRight,
        }} 
      />
    </Stack>
  );
}