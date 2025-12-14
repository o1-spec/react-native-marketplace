import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AnimatedTabIconProps {
  name: string;
  color: string;
  size?: number;
  focused: boolean;
}

export default function AnimatedTabIcon({
  name,
  color,
  size = 24,
  focused,
}: AnimatedTabIconProps) {
  const scale = useSharedValue(focused ? 1 : 0.9);
  const translateY = useSharedValue(focused ? -2 : 0);

  useEffect(() => {
    // Trigger haptic feedback on focus
    if (focused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Scale animation
    scale.value = withSpring(focused ? 1.1 : 1, {
      damping: 15,
      stiffness: 200,
    });

    // Bounce up animation
    translateY.value = withSpring(focused ? -3 : 0, {
      damping: 12,
      stiffness: 150,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
  );
}

// Sliding indicator for active tab
interface SlidingIndicatorProps {
  activeIndex: number;
  itemWidth: number;
}

export function SlidingIndicator({ activeIndex, itemWidth }: SlidingIndicatorProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * itemWidth, {
      damping: 20,
      stiffness: 150,
    });
  }, [activeIndex, itemWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.indicator, { width: itemWidth }, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
});
