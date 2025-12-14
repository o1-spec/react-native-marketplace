import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface RippleEffectProps {
  children: React.ReactNode;
  onPress?: () => void;
  rippleColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function RippleEffect({
  children,
  onPress,
  rippleColor = 'rgba(78, 205, 196, 0.3)',
  style,
  disabled = false,
}: RippleEffectProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const handlePress = () => {
    // Reset
    scale.value = 0;
    opacity.value = 0.8;

    // Animate
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });

    onPress?.();
  };

  const rippleStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [0, 2]
    );

    return {
      transform: [{ scale: scaleValue }],
      opacity: opacity.value,
    };
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {children}
      <Animated.View
        style={[
          styles.ripple,
          { backgroundColor: rippleColor },
          rippleStyle,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});
