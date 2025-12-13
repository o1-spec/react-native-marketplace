import AnimatedButton from '@/components/AnimatedButton';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
} from 'react-native';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Complete profile:', {
      profileImage,
      phoneNumber,
      location,
      bio,
    });
    
    setIsSubmitting(false);
    router.replace('/(onboarding)');
  };

  const handleSkip = () => {
    router.replace('/(onboarding)');
  };

  // Check if form is valid
  const isFormValid = phoneNumber.length >= 10 && location.length >= 3;

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
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Complete Profile</Text>
          </View>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>Almost there!</Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImageOptions}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color="#B2BEC3" />
              </View>
            )}
            <View style={styles.imageEditBadge}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageLabel}>Add Profile Picture</Text>
          <Text style={styles.imageSubLabel}>Help others recognize you</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#B2BEC3"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#636E72" />
              <TextInput
                style={styles.input}
                placeholder="City, State"
                placeholderTextColor="#B2BEC3"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity>
                <Ionicons name="navigate" size={20} color="#4ECDC4" />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              This helps buyers know where items are located
            </Text>
          </View>

          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio (Optional)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#B2BEC3"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={150}
              />
            </View>
            <Text style={styles.characterCount}>{bio.length}/150</Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
              </View>
              <Text style={styles.benefitText}>Build trust with buyers</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="people" size={20} color="#FFB84D" />
              </View>
              <Text style={styles.benefitText}>Connect with sellers</Text>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="star" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.benefitText}>Get better responses</Text>
            </View>
          </View>

          {/* Animated Buttons */}
          <View style={styles.buttonContainer}>
            {/* Complete Button - Primary with Icon */}
            <AnimatedButton
              title="Complete Setup"
              icon="checkmark-circle"
              iconPosition="right"
              onPress={handleComplete}
              loading={isSubmitting}
              disabled={!isFormValid}
              fullWidth
              size="large"
            />

            {/* Skip Button - Ghost variant */}
            <AnimatedButton
              title="Skip for Now"
              variant="ghost"
              onPress={handleSkip}
              fullWidth
              size="medium"
              disabled={isSubmitting}
            />
          </View>
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
    top: '30%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  skipText: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  imageEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D3436',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FAFAFA',
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  imageSubLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
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
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 6,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 13,
    color: '#B2BEC3',
    textAlign: 'right',
    marginTop: 4,
  },
  benefitsContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 15,
    color: '#2D3436',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
  },
});