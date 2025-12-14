import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          ...ScreenTransitions.slideAndFade,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="(auth)"
          options={{
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }}
        />
        <Stack.Screen 
          name="(onboarding)"
          options={{
            headerShown: false,
            ...ScreenTransitions.fade,
          }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.fade,
          }} 
        />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            title: 'Filter & Sort',
            headerShown: true,
            ...ScreenTransitions.bottomSheet,
          }} 
        />
      </Stack>
    </>
  );
}