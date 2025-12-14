import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function Shimmer({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: ShimmerProps) {
  const translateX = useSharedValue(-300);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(300, { duration: 1500 }),
        withTiming(-300, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={['#E5E5EA', '#F5F5F5', '#E5E5EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});
