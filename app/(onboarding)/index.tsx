import AnimatedButton from '@/components/AnimatedButton';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Amazing Products',
    subtitle: 'Buy & Sell with Ease',
    description: 'Browse thousands of products from local sellers and find incredible deals.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    color: '#FF6B6B',
  },
  {
    id: '2',
    title: 'List Your Products Instantly',
    subtitle: 'Start Selling Today',
    description: 'Take a photo, add details, and start selling your items in minutes.',
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600',
    color: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Connect with Buyers & Sellers',
    subtitle: 'Chat & Negotiate',
    description: 'Message sellers directly to ask questions and arrange safe meetups.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600',
    color: '#FFB84D',
  },
  {
    id: '4',
    title: 'Safe & Secure Transactions',
    subtitle: 'Buy with Confidence',
    description: 'All transactions are protected with our secure platform.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    color: '#A29BFE',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <View style={styles.content}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.subtitle, { color: item.color }]}>
              {item.subtitle}
            </Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
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
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && {
                  backgroundColor: slides[currentIndex].color,
                  width: 32,
                },
              ]}
            />
          ))}
        </View>

        {/* Continue Button */}
        <AnimatedButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          icon={currentIndex === slides.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
          iconPosition="right"
          onPress={scrollTo}
          fullWidth
          size="large"
          style={{
            backgroundColor: slides[currentIndex].color,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
  },
  slide: {
    width,
    height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E5EA',
  },
});