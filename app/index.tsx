import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/(auth)/register');
  };

  const handleClearStorage = () => {
  Alert.alert(
    'Clear Storage',
    'This will remove all stored data. Are you sure?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All storage data has been cleared');
          } catch (error) {
            Alert.alert('Error', 'Failed to clear storage');
          }
        },
      },
    ]
  );
};
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Animated Logo/Icon */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim }
            ],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="bag-handle" size={70} color="#FF6B6B" />
          </View>
          {/* Decorative dots */}
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>

      {/* Animated Text */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Welcome to{'\n'}MarketPlace</Text>
        <Text style={styles.subtitle}>
          Your one-stop shop for everything
        </Text>
        
        {/* Feature Pills */}
        <View style={styles.featuresContainer}>
          <View style={styles.featurePill}>
            <Ionicons name="shield-checkmark" size={16} color="#4ECDC4" />
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="flash" size={16} color="#FFB84D" />
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="heart" size={16} color="#FF6B6B" />
            <Text style={styles.featureText}>Easy</Text>
          </View>
        </View>
      </Animated.View>

      {/* Animated Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>I have an account</Text>
        </TouchableOpacity>

        {/* Social proof */}
        <View style={styles.socialProof}>
          <View style={styles.avatarGroup}>
            <View style={[styles.avatar, { backgroundColor: '#FFB84D' }]} />
            <View style={[styles.avatar, { backgroundColor: '#4ECDC4', marginLeft: -8 }]} />
            <View style={[styles.avatar, { backgroundColor: '#FF6B6B', marginLeft: -8 }]} />
          </View>
          <Text style={styles.socialText}>Join 10,000+ happy users</Text>
        </View>
        {/* <TouchableOpacity 
        style={styles.clearButton}
        onPress={handleClearStorage}
        activeOpacity={0.7}
      >
        <Text style={styles.clearButtonText}>Clear Storage</Text>
      </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  gradientContainer: {
    position: 'absolute',
    width: width,
    height: height,
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
    top: height * 0.4,
    right: -60,
    opacity: 0.4,
  },
  iconContainer: {
    marginTop: 40,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dot1: {
    backgroundColor: '#FF6B6B',
    top: 10,
    right: 10,
  },
  dot2: {
    backgroundColor: '#4ECDC4',
    bottom: 20,
    left: 5,
  },
  dot3: {
    backgroundColor: '#FFB84D',
    top: 40,
    left: -10,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 17,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2D3436',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    gap: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '600',
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  socialText: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
   clearButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#B2BEC3',
    textDecorationLine: 'underline',
  },
});