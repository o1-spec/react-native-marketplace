import { authAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Animated,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    account: true,
    notifications: false,
    privacy: false,
    support: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');

          try {
            await authAPI.logout();
          } catch (error) {
            console.log('Logout API failed (non-blocking):', error);
          }

          Toast.show({
            type: "success",
            text1: "Logged out successfully",
          });

          router.replace("/(auth)/login");
        } catch (error: any) {
          console.error('Logout error:', error);
          Toast.show({
            type: "error",
            text1: "Logout failed",
            text2: error.message || "Please try again",
          });
        }
      },
    },
  ]);
};

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "New passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.changePassword(currentPassword, newPassword);

      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Toast.show({
        type: "success",
        text1: "Password changed successfully",
      });
    } catch (error: any) {
      console.error("Change password error:", error);
      Toast.show({
        type: "error",
        text1: error.message || "Failed to change password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSectionHeader = (
    title: string,
    section: keyof typeof expandedSections,
    icon: string,
    color: string
  ) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(section)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeaderLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={20} color="#fff" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Animated.View
        style={{
          transform: [
            {
              rotate: expandedSections[section] ? "90deg" : "0deg",
            },
          ],
        }}
      >
        <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Account",
            "account",
            "person-outline",
            "#4ECDC4"
          )}

          {expandedSections.account && (
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/profile/edit")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#E5F9F8" },
                    ]}
                  >
                    <Ionicons name="person-outline" size={22} color="#4ECDC4" />
                  </View>
                  <Text style={styles.settingText}>Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => setPasswordModalVisible(true)}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#FFF4E6" },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={22}
                      color="#FFB84D"
                    />
                  </View>
                  <Text style={styles.settingText}>Change Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Notifications",
            "notifications",
            "notifications-outline",
            "#FF6B6B"
          )}

          {expandedSections.notifications && (
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#FFE5E5" },
                    ]}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={22}
                      color="#FF6B6B"
                    />
                  </View>
                  <Text style={styles.settingText}>Push Notifications</Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: "#E5E5EA", true: "#4ECDC4" }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#E5F9F8" },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={22} color="#4ECDC4" />
                  </View>
                  <Text style={styles.settingText}>Email Notifications</Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: "#E5E5EA", true: "#4ECDC4" }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#F3E5F5" },
                    ]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color="#A29BFE"
                    />
                  </View>
                  <Text style={styles.settingText}>Message Notifications</Text>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: "#E5E5EA", true: "#4ECDC4" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          )}
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Privacy",
            "privacy",
            "shield-checkmark-outline",
            "#A29BFE"
          )}

          {expandedSections.privacy && (
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/(legal)/privacy")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#F3E5F5" },
                    ]}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color="#A29BFE"
                    />
                  </View>
                  <Text style={styles.settingText}>Privacy Policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/(legal)/terms")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#E5F9F8" },
                    ]}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color="#4ECDC4"
                    />
                  </View>
                  <Text style={styles.settingText}>Terms of Service</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Support",
            "support",
            "help-circle-outline",
            "#4ECDC4"
          )}

          {expandedSections.support && (
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/help")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#E5F9F8" },
                    ]}
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={22}
                      color="#4ECDC4"
                    />
                  </View>
                  <Text style={styles.settingText}>Help Center</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push("/contact-us")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#F3E5F5" },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={22} color="#A29BFE" />
                  </View>
                  <Text style={styles.settingText}>Contact Us</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFF4E6" }]}
              >
                <Ionicons name="log-out-outline" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.settingText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setPasswordModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#2D3436" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#B2BEC3"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#B2BEC3"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#B2BEC3"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.changePasswordButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              <Text style={styles.changePasswordButtonText}>
                {isLoading ? "Changing..." : "Change Password"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  sectionContent: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3436",
  },
  settingSubtext: {
    fontSize: 13,
    color: "#B2BEC3",
    marginTop: 2,
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalBackButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
  },
  changePasswordButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: "#B2BEC3",
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
