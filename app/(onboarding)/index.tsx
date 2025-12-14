import AnimatedButton from '@/components/AnimatedButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Buy & Sell with Ease',
    description: 'Browse thousands of products from local sellers and find great deals',
    icon: 'storefront',
    color: '#FF6B6B',
    bgColor: '#FFE5E5',
  },
  {
    id: '2',
    title: 'List Your Products',
    description: 'Take a photo, add details, and start selling in minutes',
    icon: 'camera',
    color: '#4ECDC4',
    bgColor: '#E5F9F8',
  },
  {
    id: '3',
    title: 'Chat with Sellers',
    description: 'Message sellers directly to ask questions and negotiate',
    icon: 'chatbubbles',
    color: '#FFB84D',
    bgColor: '#FFF4E5',
  },
  {
    id: '4',
    title: 'Safe & Secure',
    description: 'All transactions are protected. Buy and sell with confidence',
    icon: 'shield-checkmark',
    color: '#A29BFE',
    bgColor: '#E8E5FF',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Mark onboarding as completed
    // AsyncStorage.setItem('onboardingCompleted', 'true');
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        <Ionicons name={item.icon} size={80} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <View style={styles.skipButton}>
          <AnimatedButton
            title="Skip"
            variant="ghost"
            size="small"
            onPress={handleSkip}
          />
        </View>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: slides[currentIndex].color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next/Get Started Button */}
        <AnimatedButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          icon={currentIndex === slides.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
          iconPosition="right"
          onPress={scrollTo}
          fullWidth
          size="large"
          style={{ backgroundColor: slides[currentIndex].color }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});