import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface CategoryChipProps {
  icon: string;
  label: string;
  color: string;
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CategoryChip({
  icon,
  label,
  color,
  isActive = false,
  onPress,
  style,
}: CategoryChipProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(isActive ? 1 : 0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const bgOpacity = withTiming(backgroundColor.value, { duration: 200 });
    
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: bgOpacity === 1 ? color : 'transparent',
      borderColor: color,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: backgroundColor.value === 1 ? '#fff' : color,
  }));

  return (
    <AnimatedTouchable
      style={[styles.chip, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={icon as any} 
        size={18} 
        color={isActive ? '#fff' : color} 
      />
      <Animated.Text style={[styles.label, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 10,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
