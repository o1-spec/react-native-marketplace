import { useState } from 'react';
import { ActivityIndicator, ImageProps, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedImageProps extends ImageProps {
  fallback?: React.ReactNode;
  showLoader?: boolean;
  fadeDuration?: number;
}

export function AnimatedImage({
  style,
  fallback,
  showLoader = true,
  fadeDuration = 400,
  ...props
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const opacity = useSharedValue(0);

  const handleLoad = () => {
    setIsLoading(false);
    opacity.value = withTiming(1, {
      duration: fadeDuration,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[style, styles.container]}>
      {/* Loading Indicator */}
      {isLoading && showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#4ECDC4" />
        </View>
      )}

      {/* Error Fallback */}
      {hasError && fallback ? (
        fallback
      ) : (
        <Animated.Image
          {...props}
          style={[style, animatedStyle]}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    zIndex: 1,
  },
});
