import AnimatedButton from "@/components/AnimatedButton";
import { Ionicons } from "@expo/vector-icons";
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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ ADD THIS

  const handleRegister = async () => {
    // ✅ Make async
    setIsSubmitting(true); // ✅ ADD
    await new Promise((resolve) => setTimeout(resolve, 1500)); // ✅ ADD - Simulate API
    console.log("Register:", { name, email, password });
    setIsSubmitting(false); // ✅ ADD
    router.push("/(auth)/verify-email");
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
                onChangeText={setName}
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
                onChangeText={setEmail}
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
                onChangeText={setPassword}
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
                onChangeText={setConfirmPassword}
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

          {/* Terms */}
          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text style={styles.link}>Terms</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
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
  registerButton: {
    backgroundColor: "#2D3436",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2D3436",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
    gap: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  loginContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 15,
    color: "#636E72",
  },
  loginLink: {
    color: "#2D3436",
    fontWeight: "600",
  },
  buttonSpacing: {
    marginBottom: 16,
  },
});
