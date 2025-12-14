import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ContactUsScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    if (subject.trim().length < 5) {
      Alert.alert('Error', 'Subject must be at least 5 characters');
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert('Error', 'Message must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubject('');
      setMessage('');
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <Text style={styles.contactText}>
            Have a question or need help? We're here to assist you.
          </Text>

          <View style={styles.contactMethods}>
            <View style={styles.contactMethod}>
              <View style={[styles.contactIcon, { backgroundColor: '#E5F9F8' }]}>
                <Ionicons name="mail-outline" size={20} color="#4ECDC4" />
              </View>
              <View>
                <Text style={styles.contactMethodTitle}>Email</Text>
                <Text style={styles.contactMethodValue}>support@marketplace.com</Text>
              </View>
            </View>

            <View style={styles.contactMethod}>
              <View style={[styles.contactIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="call-outline" size={20} color="#A29BFE" />
              </View>
              <View>
                <Text style={styles.contactMethodTitle}>Phone</Text>
                <Text style={styles.contactMethodValue}>1-800-MARKET</Text>
              </View>
            </View>

            <View style={styles.contactMethod}>
              <View style={[styles.contactIcon, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="time-outline" size={20} color="#FFB84D" />
              </View>
              <View>
                <Text style={styles.contactMethodTitle}>Response Time</Text>
                <Text style={styles.contactMethodValue}>Within 24 hours</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Send us a Message</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="What's this about?"
                value={subject}
                onChangeText={setSubject}
                maxLength={100}
                autoCapitalize="words"
              />
            </View>
            <Text style={styles.charCount}>{subject.length}/100</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <View style={[styles.inputContainer, styles.messageContainer]}>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Tell us how we can help you..."
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            <Text style={styles.charCount}>{message.length}/500</Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.disabledButton]}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Text>
            {!isLoading && (
              <Ionicons name="send" size={18} color="#fff" style={styles.sendIcon} />
            )}
          </TouchableOpacity>
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
  contactInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: '#636E72',
    lineHeight: 22,
    marginBottom: 24,
  },
  contactMethods: {
    gap: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactMethodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  contactMethodValue: {
    fontSize: 14,
    color: '#636E72',
  },
  form: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3436',
  },
  messageContainer: {
    minHeight: 120,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#B2BEC3',
    textAlign: 'right',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#B2BEC3',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sendIcon: {
    marginLeft: 4,
  },
});