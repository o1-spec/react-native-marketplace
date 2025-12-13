import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  condition?: 'New' | 'Used';
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  index?: number; 
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  location,
  condition = 'Used',
  isFavorite = false,
  onFavoritePress,
  index = 0,
}: ProductCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Card press animation
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
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
    router.push(`/product/${id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavoritePress?.();
  };

  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: 50,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
        scale: 1,
      }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 100, // Stagger effect
      }}
    >
      <Animated.View style={animatedCardStyle}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={1}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {/* Image Container */}
          <View style={styles.imageContainer}>
            {/* Image Loading Skeleton */}
            {!imageLoaded && (
              <MotiView
                from={{ opacity: 0.3 }}
                animate={{ opacity: 0.6 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  loop: true,
                }}
                style={styles.imageSkeleton}
              />
            )}

            {/* Image */}
            <Image
              source={{ uri: image }}
              style={styles.image}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Condition Badge with animation */}
            {condition === 'New' && (
              <MotiView
                from={{
                  scale: 0,
                  opacity: 0,
                  translateX: -20,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  translateX: 0,
                }}
                transition={{
                  type: 'spring',
                  delay: 200 + index * 100,
                  damping: 15,
                }}
              >
                <View style={styles.conditionBadge}>
                  <Text style={styles.conditionText}>NEW</Text>
                </View>
              </MotiView>
            )}

            {/* Favorite Button with animation */}
            <MotiView
              from={{
                scale: 0,
                opacity: 0,
                rotate: '-180deg',
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: '0deg',
              }}
              transition={{
                type: 'spring',
                delay: 300 + index * 100,
                damping: 12,
              }}
            >
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                activeOpacity={0.7}
              >
                {/* Heart Animation */}
                <MotiView
                  animate={{
                    scale: isFavorite ? [1, 1.4, 1] : 1,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 10,
                  }}
                >
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? '#FF6B6B' : '#fff'}
                  />
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          </View>

          {/* Info Section */}
          <View style={styles.info}>
            {/* Title with fade-in */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 300,
                delay: 400 + index * 100,
              }}
            >
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </MotiView>

            {/* Location with fade-in */}
            <MotiView
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'timing',
                duration: 300,
                delay: 450 + index * 100,
              }}
            >
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color="#636E72" />
                <Text style={styles.location} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </MotiView>

            {/* Price with scale animation */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                delay: 500 + index * 100,
                damping: 12,
              }}
            >
              <Text style={styles.price}>${price.toLocaleString()}</Text>
            </MotiView>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E5EA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  conditionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  conditionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 6,
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: '#636E72',
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
});