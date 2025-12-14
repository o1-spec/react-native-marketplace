import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  deleteThreshold?: number;
  deleteColor?: string;
}

export default function SwipeToDelete({
  children,
  onDelete,
  deleteThreshold = 100,
  deleteColor = '#FF6B6B',
}: SwipeToDeleteProps) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const marginVertical = useSharedValue(12);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow left swipe (negative values)
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -deleteThreshold) {
        // Delete: slide out completely
        translateX.value = withTiming(-500, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        itemHeight.value = withTiming(0, { duration: 300 });
        marginVertical.value = withTiming(0, { duration: 300 });
        
        // Call delete after animation
        setTimeout(() => runOnJS(onDelete)(), 350);
      } else {
        // Spring back
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 150,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    height: itemHeight.value || undefined,
    marginVertical: marginVertical.value,
  }));

  const deleteIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, -deleteThreshold],
      [0.5, 1.2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity: interpolate(
        translateX.value,
        [0, -50, -deleteThreshold],
        [0, 0.5, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const deleteBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, -deleteThreshold],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={styles.container}>
      {/* Delete Background */}
      <Animated.View 
        style={[
          styles.deleteBackground, 
          { backgroundColor: deleteColor },
          deleteBackgroundStyle
        ]}
      >
        <Animated.View style={deleteIconStyle}>
          <Ionicons name="trash" size={24} color="#fff" />
        </Animated.View>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>

      {/* Swipeable Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    gap: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    backgroundColor: '#fff',
  },
});
