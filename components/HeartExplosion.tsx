import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface HeartExplosionProps {
  onComplete?: () => void;
}

// Individual heart particle
function HeartParticle({ delay, angle }: { delay: number; angle: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const distance = 40 + Math.random() * 30;
    const radian = (angle * Math.PI) / 180;

    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    translateX.value = withDelay(
      delay,
      withSpring(Math.cos(radian) * distance, { damping: 8, stiffness: 80 })
    );

    translateY.value = withDelay(
      delay,
      withSpring(Math.sin(radian) * distance, { damping: 8, stiffness: 80 })
    );

    opacity.value = withDelay(
      delay + 300,
      withTiming(0, { duration: 400 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <Ionicons name="heart" size={12} color="#FF6B6B" />
    </Animated.View>
  );
}

export default function HeartExplosion({ onComplete }: HeartExplosionProps) {
  const mainScale = useSharedValue(1);

  useEffect(() => {
    // Main heart animation
    mainScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Call onComplete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const mainHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainScale.value }],
  }));

  // Create particles in a circle
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    angle: (360 / 8) * i,
    delay: i * 30,
  }));

  return (
    <View style={styles.container}>
      {/* Particles */}
      {particles.map((particle, index) => (
        <HeartParticle
          key={index}
          delay={particle.delay}
          angle={particle.angle}
        />
      ))}

      {/* Main Heart */}
      <Animated.View style={mainHeartStyle}>
        <Ionicons name="heart" size={28} color="#FF6B6B" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
