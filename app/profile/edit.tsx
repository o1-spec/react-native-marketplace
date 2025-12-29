import AnimatedButton from "@/components/AnimatedButton";
import { userAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await userAPI.getProfile();
      const currentUser = userData.user;
      setUser(currentUser);
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setLocation(currentUser.location || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setAvatar(currentUser.avatar || "");
    } catch (error: any) {
      console.error("Fetch user data error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load profile data',
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const uploadAvatar = async (uri: string): Promise<string> => {
  const formData = new FormData();
  const fileExtension = uri.split(".").pop() || "jpg";
  const fileName = `profile_${Date.now()}.${fileExtension}`;

  formData.append("file", {
    uri,
    type: `image/${fileExtension}`,
    name: fileName,
  } as any);

  const token = await AsyncStorage.getItem('token');

  const response = await fetch(
    "https://marketplace-backend-blush.vercel.app/api/upload?folder=profiles",
    {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.url;
};
  const handleAvatarChange = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Permission to access media library is required!',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploadingAvatar(true);
        const imageUri = result.assets[0].uri;
        const avatarUrl = await uploadAvatar(imageUri);
        setAvatar(avatarUrl);
        setUploadingAvatar(false);
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: error.message || 'Failed to upload avatar',
      });
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Name',
        text2: 'Please enter your name',
      });
      return;
    }
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
        avatar,
      };

      await userAPI.updateProfile(updateData);

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Profile updated successfully',
      });
      Alert.alert("Success!", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Save profile error:", error);
      Toast.show({
        type: 'error',
        text1: 'Save Error',
        text2: error.message || 'Failed to save profile changes',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarChange}
            disabled={uploadingAvatar}
          >
            <Image
              source={{ uri: avatar || "" }}
              style={[styles.avatar, !avatar && styles.avatarPlaceholder]}
            />
            {!avatar && (
              <View style={styles.avatarPlaceholderContent}>
                <Ionicons name="person" size={40} color="#B2BEC3" />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
            {uploadingAvatar && (
              <View style={styles.avatarLoading}>
                <Ionicons name="refresh" size={24} color="#4ECDC4" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#B2BEC3"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor="#B2BEC3"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#B2BEC3"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={styles.characterCount}>{bio.length}/200</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City, Country"
            placeholderTextColor="#B2BEC3"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor="#B2BEC3"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <AnimatedButton
            title="Save Changes"
            icon="checkmark-circle"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            fullWidth
            size="large"
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    fontSize: 16,
    color: "#636E72",
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
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  required: {
    color: "#FF6B6B",
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
  },
  avatarPlaceholder: {
    backgroundColor: "#F5F5F5",
  },
  avatarPlaceholderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#2D3436",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#B2BEC3",
    textAlign: "right",
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  avatarLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
});
