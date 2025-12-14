import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

interface SuccessCheckmarkProps {
  size?: number;
  color?: string;
  delay?: number;
}

export default function SuccessCheckmark({
  size = 48,
  color = '#55EFC4',
  delay = 0,
}: SuccessCheckmarkProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-45);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      )
    );

    rotation.value = withDelay(
      delay,
      withSpring(0, { damping: 12, stiffness: 100 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Ionicons name="checkmark-circle" size={size} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
