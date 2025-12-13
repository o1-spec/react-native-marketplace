import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Animated Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="search-outline" size={100} color="#B2BEC3" />
        <View style={styles.errorBadge}>
          <Text style={styles.errorText}>404</Text>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Go Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#2D3436" />
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={[styles.decorCircle, styles.decorCircle1]} />
      <View style={[styles.decorCircle, styles.decorCircle2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  errorBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
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
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2D3436',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 10,
  },
  secondaryButtonText: {
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '600',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.3,
  },
  decorCircle1: {
    width: 200,
    height: 200,
    backgroundColor: '#FFE5E5',
    top: -50,
    right: -50,
  },
  decorCircle2: {
    width: 150,
    height: 150,
    backgroundColor: '#E5F9F8',
    bottom: -30,
    left: -30,
  },
});