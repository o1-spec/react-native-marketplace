import { ScreenTransitions } from '@/constants/transitions';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            ...ScreenTransitions.fade,
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
        
        {/* Add missing screens with transitions */}
        <Stack.Screen 
          name="chat/[id]" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }} 
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.zoomIn,
          }} 
        />
        <Stack.Screen 
          name="user/[id]" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideAndFade,
          }} 
        />
        <Stack.Screen 
          name="search" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideAndFade,
          }} 
        />
        <Stack.Screen 
          name="favorites" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }} 
        />
        <Stack.Screen 
          name="help" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }} 
        />
        <Stack.Screen
          name="contact-us"
          options={{
            headerShown: false,
            ...ScreenTransitions.slideFromRight,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}