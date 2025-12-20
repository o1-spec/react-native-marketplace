import { ScreenTransitions } from '@/constants/transitions';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { toastConfig } from '@/lib/toastConfig';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

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
        
        {/* <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            title: 'Filter & Sort',
            headerShown: true,
            ...ScreenTransitions.bottomSheet,
          }} 
        /> */}
        
        {/* Add missing screens with transitions */}
        {/* <Stack.Screen 
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
        /> */}
        {/* <Stack.Screen 
          name="user/[id]" 
          options={{ 
            headerShown: false,
            ...ScreenTransitions.slideAndFade,
          }} 
        /> */}
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

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
      <Toast config={toastConfig} /> 
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});