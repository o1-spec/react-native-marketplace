import AnimatedButton from '@/components/AnimatedButton';
import { authAPI } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!token) {
        throw new Error('Invalid reset link. Please request a new one.');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await authAPI.resetPassword({
        token: token as string,
        newPassword,
      });

      setSuccess(true);
      console.log('Password reset successfully');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  if (success) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#E5F9F8' }]}>
              <Ionicons name="checkmark-circle" size={60} color="#4ECDC4" />
            </View>
          </View>

          <Text style={styles.title}>Password Reset!</Text>
          <Text style={styles.subtitle}>
            Your password has been successfully reset. You can now log in with your new password.
          </Text>

          <View style={styles.buttonSpacing}>
            <AnimatedButton
              title="Go to Login"
              icon="arrow-forward"
              iconPosition="right"
              onPress={() => router.push('/(auth)/login')}
              fullWidth
              size="large"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background Decorative Elements */}
      <View style={styles.decorContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="key" size={50} color="#FFB84D" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#B2BEC3"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#636E72"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#B2BEC3"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError('');
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#636E72"
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Reset Password Button */}
          <View style={styles.buttonSpacing}>
            <AnimatedButton
              title="Reset Password"
              icon="key"
              iconPosition="right"
              onPress={handleResetPassword}
              loading={isSubmitting}
              disabled={!isFormValid}
              fullWidth
              size="large"
            />
          </View>

          <AnimatedButton
            title="Back to Login"
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  decorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#FFE5E5',
    top: -100,
    right: -100,
    opacity: 0.5,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: '#E5F9F8',
    bottom: -50,
    left: -80,
    opacity: 0.5,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: '#FFF4E5',
    top: '40%',
    right: -60,
    opacity: 0.4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEB2B2',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#C53030',
    lineHeight: 20,
  },
});