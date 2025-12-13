import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleResetPassword = () => {
    // TODO: Implement password reset logic
    console.log('Reset password for:', email);
    setSent(true);
  };

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
            <Ionicons 
              name={sent ? "checkmark-circle" : "key"} 
              size={50} 
              color={sent ? "#4ECDC4" : "#FFB84D"} 
            />
          </View>
        </View>

        {/* Content */}
        {!sent ? (
          <>
            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you instructions to reset your password
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#636E72" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#B2BEC3"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Send Reset Link</Text>
                <Ionicons name="paper-plane" size={20} color="#fff" />
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity 
                style={styles.loginContainer}
                onPress={() => router.push('/(auth)/login')}
              >
                <Ionicons name="arrow-back" size={16} color="#636E72" />
                <Text style={styles.loginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Success Message */}
            <View style={styles.successContainer}>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent password reset instructions to
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#4ECDC4" />
                <Text style={styles.infoText}>
                  Didn't receive the email? Check your spam folder or try again
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.form}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => router.push('/(auth)/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Back to Login</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendContainer}
                onPress={() => setSent(false)}
              >
                <Text style={styles.resendText}>Resend Email</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    backgroundColor: '#FFF4E5',
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
    backgroundColor: '#FFE5E5',
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
    marginBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E5F9F8',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
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
  resetButton: {
    backgroundColor: '#2D3436',
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
    gap: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loginText: {
    fontSize: 15,
    color: '#636E72',
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 15,
    color: '#2D3436',
    fontWeight: '600',
  },
});