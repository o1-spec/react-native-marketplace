import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [offerNotifications, setOfferNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear auth state
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted');
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(auth)/complete-profile')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="person-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Change Password', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="lock-closed-outline" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Payment Methods', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="card-outline" size={22} color="#A29BFE" />
              </View>
              <Text style={styles.settingText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Shipping Addresses', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="location-outline" size={22} color="#55EFC4" />
              </View>
              <Text style={styles.settingText}>Shipping Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="notifications-outline" size={22} color="#FF6B6B" />
              </View>
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="mail-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="chatbubble-outline" size={22} color="#A29BFE" />
              </View>
              <Text style={styles.settingText}>Message Notifications</Text>
            </View>
            <Switch
              value={messageNotifications}
              onValueChange={setMessageNotifications}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="pricetag-outline" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.settingText}>Offer Notifications</Text>
            </View>
            <Switch
              value={offerNotifications}
              onValueChange={setOfferNotifications}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#2D3436' }]}>
                <Ionicons name="moon-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="navigate-outline" size={22} color="#55EFC4" />
              </View>
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: '#E5E5EA', true: '#4ECDC4' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Language', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="language-outline" size={22} color="#4ECDC4" />
              </View>
              <View>
                <Text style={styles.settingText}>Language</Text>
                <Text style={styles.settingSubtext}>English (US)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Currency', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="cash-outline" size={22} color="#FFB84D" />
              </View>
              <View>
                <Text style={styles.settingText}>Currency</Text>
                <Text style={styles.settingSubtext}>USD ($)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Privacy Policy', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#A29BFE" />
              </View>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Terms of Service', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="document-text-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Blocked Users', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="ban-outline" size={22} color="#FF6B6B" />
              </View>
              <Text style={styles.settingText}>Blocked Users</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Help Center', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="help-circle-outline" size={22} color="#4ECDC4" />
              </View>
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Contact Us', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="mail-outline" size={22} color="#A29BFE" />
              </View>
              <Text style={styles.settingText}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('Rate App', 'Coming soon...')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="star-outline" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.settingText}>Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert('About', 'Version 1.0.0')}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="information-circle-outline" size={22} color="#55EFC4" />
              </View>
              <View>
                <Text style={styles.settingText}>About</Text>
                <Text style={styles.settingSubtext}>Version 1.0.0</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="log-out-outline" size={22} color="#FFB84D" />
              </View>
              <Text style={styles.settingText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
              </View>
              <Text style={[styles.settingText, { color: '#FF6B6B' }]}>
                Delete Account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#636E72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  settingSubtext: {
    fontSize: 13,
    color: '#B2BEC3',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});