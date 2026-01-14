import AnimatedButton from "@/components/AnimatedButton";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { reloadAuth } = useAuth();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const loadUserEmail = async () => {
      try {
        const pendingEmail = await AsyncStorage.getItem("pendingEmail");

        if (pendingEmail) {
          // console.log("✅ Found pending email:", pendingEmail);
          setUserEmail(pendingEmail);
          return;
        }

        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          // console.log("✅ Found user email:", user.email);
          setUserEmail(user.email);
        } else {
          console.warn("⚠️ No user data found");
        }
      } catch (error) {
        console.error("Error loading user email:", error);
      }
    };

    loadUserEmail();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (error) setError("");

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    if (!userEmail) {
      setError("User email not found. Please try logging in again.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const codeToVerify = verificationCode || code.join("");

      // console.log("📧 Verifying email with code:", codeToVerify);
      const data = await authAPI.verifyEmail({
        email: userEmail,
        code: codeToVerify,
      });

      if (data.user) {
        // console.log("👤 Storing verified user data...");
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }

      const tokenToStore = data.token || data.tempToken;
      if (tokenToStore) {
        // console.log("🔑 Storing temporary token from verification...");
        await AsyncStorage.setItem("token", tokenToStore);

        const storedToken = await AsyncStorage.getItem("token");
        // console.log("✅ Token stored successfully:", !!storedToken);
      }

      await AsyncStorage.removeItem("pendingEmail");
      // console.log("🔄 Reloading auth context...");
      await reloadAuth();
      // console.log("✅ Auth context reloaded");

      Toast.show({
        type: "success",
        text1: "Email Verified!",
        text2: "Your email has been successfully verified.",
      });

      router.replace("/(auth)/complete-profile");
    } catch (err) {
      console.error("❌ Verification error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          err instanceof Error
            ? err.message
            : "Verification failed. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      setError("User email not found. Please try logging in again.");
      return;
    }

    if (!canResend) return;

    setIsResending(true);
    setError("");

    try {
      await authAPI.resendVerification({ email: userEmail });
      setResendTimer(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      Toast.show({
        type: "success",
        text1: "Code Resent!",
        text2: "Please check your email for the new verification code.",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again."
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          err instanceof Error
            ? err.message
            : "Failed to resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

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
            <Ionicons name="mail" size={50} color="#4ECDC4" />
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>We've sent a 6-digit code to</Text>
          <Text style={styles.emailText}>
            {userEmail || "your email address"} {/* ✅ DISPLAY ACTUAL EMAIL */}
          </Text>
        </View>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.codeInput, digit && styles.codeInputFilled]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isVerifying}
            />
          ))}
        </View>

        {/* ✅ ADD ERROR DISPLAY */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <AnimatedButton
            title={canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
            icon="refresh"
            variant="outline"
            onPress={handleResend}
            loading={isResending}
            disabled={!canResend || isResending || isVerifying}
            fullWidth
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#636E72"
          />
          <Text style={styles.infoText}>
            Didn't receive the code? Check your spam folder
          </Text>
        </View>

        {/* Verify Button */}
        <AnimatedButton
          title="Verify Email"
          icon="checkmark-circle"
          iconPosition="right"
          onPress={() => handleVerify()}
          loading={isVerifying}
          disabled={code.every((d) => d === "") || isVerifying}
          fullWidth
          size="large"
        />
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
    backgroundColor: "#E5F9F8",
    top: -100,
    right: -100,
    opacity: 0.5,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: "#FFE5E5",
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
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
  },
  emailText: {
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "600",
    marginTop: 4,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInputFilled: {
    borderColor: "#4ECDC4",
    backgroundColor: "#E5F9F8",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEB2B2",
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#C53030",
    lineHeight: 20,
  },
  resendContainer: {
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
  },
});
