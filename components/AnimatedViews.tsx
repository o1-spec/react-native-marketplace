import { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

export function FadeInView({ children, duration = 400, delay = 0, style }: FadeInViewProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
}

export function SlideInView({
  children,
  direction = 'up',
  duration = 500,
  delay = 0,
  distance = 50,
  style,
}: SlideInViewProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    translateX.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 100,
      })
    );

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 20,
        stiffness: 100,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

interface ScaleInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  style?: ViewStyle;
}

export function ScaleInView({
  children,
  duration = 400,
  delay = 0,
  initialScale = 0.8,
  style,
}: ScaleInViewProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(initialScale);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    );

    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 150,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'scale';
  style?: ViewStyle;
}

export function StaggeredList({
  children,
  staggerDelay = 100,
  animationType = 'slide',
  style,
}: StaggeredListProps) {
  const AnimationComponent = 
    animationType === 'fade' ? FadeInView :
    animationType === 'scale' ? ScaleInView :
    SlideInView;

  return (
    <>
      {children.map((child, index) => (
        <AnimationComponent
          key={index}
          delay={index * staggerDelay}
          style={style}
        >
          {child}
        </AnimationComponent>
      ))}
    </>
  );
}

// Bounce animation for interactive elements
interface BounceViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  scale?: number;
  style?: ViewStyle;
}

export function BounceView({ children, onPress, scale = 0.95, style }: BounceViewProps) {
  const scaleValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withSpring(scale, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View
      style={[style, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {children}
    </Animated.View>
  );
}
