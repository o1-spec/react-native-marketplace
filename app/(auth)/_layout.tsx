import { useAuth } from '@/contexts/AuthContext';
import { router, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated, isVerified, isLoading } = useAuth();
  const pathname = usePathname(); 

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && !isVerified) {
      if (pathname !== '/(auth)/verify-email') { 
        router.replace('/(auth)/verify-email');
      }
    } else if (isAuthenticated && isVerified) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isVerified, isLoading, pathname]);  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="complete-profile" />
    </Stack>
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