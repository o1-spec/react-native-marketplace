import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

interface BadgeBounceProps {
  children: React.ReactNode;
  shouldBounce?: boolean;
  delay?: number;
}

export default function BadgeBounce({ 
  children, 
  shouldBounce = true,
  delay = 0,
}: BadgeBounceProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (shouldBounce) {
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.3, { damping: 8, stiffness: 200 }),
          withSpring(0.9, { damping: 8, stiffness: 200 }),
          withSpring(1.1, { damping: 10, stiffness: 150 }),
          withSpring(1, { damping: 12, stiffness: 150 })
        )
      );
    }
  }, [shouldBounce]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

// Continuous pulse for notification badges
interface BadgePulseProps {
  children: React.ReactNode;
}

export function BadgePulse({ children }: BadgePulseProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.15, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      ),
      -1, // Infinite
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
