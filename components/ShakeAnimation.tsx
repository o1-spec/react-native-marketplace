import { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface ShakeAnimationProps {
  children: React.ReactNode;
  shouldShake?: boolean;
  onShakeComplete?: () => void;
  style?: ViewStyle;
}

export default function ShakeAnimation({ 
  children, 
  shouldShake = false,
  onShakeComplete,
  style,
}: ShakeAnimationProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (shouldShake) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      // Call completion callback
      const timer = setTimeout(() => {
        onShakeComplete?.();
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

// Wiggle animation for attention
interface WiggleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Wiggle({ children, style }: WiggleProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 100 }),
        withTiming(3, { duration: 100 }),
        withTiming(-3, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ),
      -1, // Infinite
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
