import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function AnimatedButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Press animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePress = () => {
    // Haptic feedback effect
    opacity.value = withTiming(0.7, { duration: 50 }, () => {
      opacity.value = withTiming(1, { duration: 50 });
    });
    onPress();
  };

  // Get button styles based on variant
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#2D3436',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#4ECDC4',
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#2D3436',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#FF6B6B',
          borderWidth: 0,
        };
      default:
        return baseStyle;
    }
  };

  // Get text styles based on variant
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return { color: '#fff' };
      case 'outline':
      case 'ghost':
        return { color: '#2D3436' };
      default:
        return { color: '#fff' };
    }
  };

  // Get size styles
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
        };
    }
  };

  // Get icon size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  // Get text size
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      case 'medium':
      default:
        return { fontSize: 16 };
    }
  };

  // Get loading color
  const getLoadingColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return '#2D3436';
    }
    return '#fff';
  };

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'spring',
        damping: 15,
      }}
      style={fullWidth && { width: '100%' }}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.button,
            getButtonStyle(),
            getSizeStyle(),
            disabled && styles.disabledButton,
            fullWidth && styles.fullWidth,
            style,
          ]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          {loading ? (
            <ActivityIndicator color={getLoadingColor()} size="small" />
          ) : (
            <>
              {/* Left Icon */}
              {icon && iconPosition === 'left' && (
                <MotiView
                  from={{ scale: 0, rotate: '-180deg' }}
                  animate={{ scale: 1, rotate: '0deg' }}
                  transition={{
                    type: 'spring',
                    delay: 100,
                  }}
                >
                  <Ionicons
                    name={icon}
                    size={getIconSize()}
                    color={getTextStyle().color}
                    style={styles.iconLeft}
                  />
                </MotiView>
              )}

              {/* Text */}
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'timing',
                  duration: 300,
                  delay: 50,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    getTextStyle(),
                    getTextSize(),
                    textStyle,
                  ]}
                >
                  {title}
                </Text>
              </MotiView>

              {/* Right Icon */}
              {icon && iconPosition === 'right' && (
                <MotiView
                  from={{ scale: 0, rotate: '180deg' }}
                  animate={{ scale: 1, rotate: '0deg' }}
                  transition={{
                    type: 'spring',
                    delay: 100,
                  }}
                >
                  <Ionicons
                    name={icon}
                    size={getIconSize()}
                    color={getTextStyle().color}
                    style={styles.iconRight}
                  />
                </MotiView>
              )}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    borderColor: '#E5E5EA',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});