import AnimatedButton from "@/components/AnimatedButton";
import { authAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationButtons, setShowVerificationButtons] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    setError("");
    setShowVerificationButtons(false);

    try {
      if (name.length < 2) {
        throw new Error("Name must be at least 2 characters");
      }
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const data = await authAPI.register({
        name,
        email,
        password,
      });

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("pendingEmail", email);

      Toast.show({
        type: "success",
        text1: "Registration Successful!",
        text2: "Please check your email for verification code.",
      });

      router.push("/(auth)/verify-email");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";

      const isNetworkError =
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("fetch");

      if (isNetworkError) {
        await AsyncStorage.setItem("pendingEmail", email);
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ name, email, emailVerified: false })
        );

        setError(
          "Request timed out, but registration may have succeeded. Please check your email for verification or resend the code."
        );
        Toast.show({
          type: "error",
          text1: "Request Timeout",
          text2: "Check your email or resend verification code.",
        });

        setShowVerificationButtons(true);
      } else {
        setError(errorMessage);
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setError("");

    try {
      await authAPI.resendVerification({ email });

      Toast.show({
        type: "success",
        text1: "Email Sent!",
        text2: "Please check your inbox for the verification code.",
      });

      router.push("/(auth)/verify-email");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to resend email. Please try again.";

      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  };

  const isFormValid =
    name.length >= 2 &&
    email.includes("@") &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
            <Ionicons name="person-add" size={50} color="#FF6B6B" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Join MarketPlace</Text>
          <Text style={styles.subtitle}>
            Sign up to start buying and selling
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#B2BEC3"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) setError("");
                }}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#B2BEC3"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B2BEC3"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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
                placeholder="Confirm Password"
                placeholderTextColor="#B2BEC3"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError("");
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
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

          {/* ✅ Error with Both Action Buttons */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <View style={styles.errorContent}>
                <Text style={styles.errorText}>{error}</Text>
                {showVerificationButtons && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResendVerification}
                      disabled={isResending}
                    >
                      <Ionicons name="mail" size={16} color="#fff" />
                      <Text style={styles.resendButtonText}>
                        {isResending ? "Sending..." : "Resend Email"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.verificationButton}
                      onPress={() => router.push("/(auth)/verify-email")}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.verificationButtonText}>
                        Verify Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Terms */}
          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/(legal)/terms")}
            >
              Terms
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/(legal)/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>

          {/* Register Button */}
          <View style={styles.buttonSpacing}>
            <AnimatedButton
              title="Create Account"
              icon="arrow-forward"
              iconPosition="right"
              onPress={handleRegister}
              loading={isSubmitting}
              disabled={!isFormValid}
              fullWidth
              size="large"
            />
          </View>

          <AnimatedButton
            title="Already have an account? Log In"
            variant="ghost"
            onPress={() => router.push("/(auth)/login")}
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
    backgroundColor: "#FAFAFA",
  },
  decorContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: "#FFE5E5",
    top: -100,
    right: -100,
    opacity: 0.5,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: "#E5F9F8",
    bottom: -50,
    left: -80,
    opacity: 0.5,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: "#FFF4E5",
    top: "40%",
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
  },
  terms: {
    fontSize: 13,
    color: "#636E72",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  link: {
    color: "#2D3436",
    fontWeight: "600",
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEB2B2",
    gap: 12,
  },
  errorContent: {
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    color: "#C53030",
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  resendButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4ECDC4",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  verificationButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  verificationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});