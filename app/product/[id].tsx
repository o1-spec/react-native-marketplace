import AnimatedButton from '@/components/AnimatedButton';
import { FadeInView, SlideInView } from '@/components/AnimatedViews';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data - replace with API call
const mockProduct = {
  id: '1',
  title: 'iPhone 13 Pro Max 256GB',
  price: 899,
  images: [
    'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
  ],
  description:
    'iPhone 13 Pro Max in excellent condition. Barely used, comes with original box and all accessories. Battery health at 98%. No scratches or dents. Unlocked and ready to use with any carrier.',
  condition: 'Used',
  category: 'Electronics',
  location: 'San Francisco, CA',
  createdAt: '2 days ago',
  seller: {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4.8,
    totalReviews: 124,
    responseTime: '~1 hour',
    verified: true,
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading product details
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${mockProduct.title} for $${mockProduct.price}`,
        url: `myapp://product/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessage = () => {
    // Navigate to chat
    router.push(`/chat/${mockProduct.seller.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
        </View>
        <ProductDetailSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#2D3436" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF6B6B' : '#2D3436'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <FadeInView duration={300}>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {mockProduct.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.productImage}
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {mockProduct.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>

            {/* Condition Badge */}
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{mockProduct.condition}</Text>
            </View>
          </View>
        </FadeInView>

        {/* Product Info */}
        <SlideInView direction="up" delay={150}>
          <View style={styles.infoContainer}>
          <Text style={styles.price}>${mockProduct.price.toLocaleString()}</Text>
          <Text style={styles.title}>{mockProduct.title}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#636E72" />
              <Text style={styles.metaText}>{mockProduct.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#636E72" />
              <Text style={styles.metaText}>{mockProduct.createdAt}</Text>
            </View>
          </View>

          {/* Category Tag */}
          <View style={styles.categoryTag}>
            <Ionicons name="pricetag-outline" size={14} color="#4ECDC4" />
            <Text style={styles.categoryText}>{mockProduct.category}</Text>
          </View>
          </View>
        </SlideInView>

        {/* Seller Info */}
        <SlideInView direction="up" delay={250}>
          <TouchableOpacity
            style={styles.sellerContainer}
            onPress={() => router.push(`/user/${mockProduct.seller.id}`)}
          >
          <View style={styles.sellerLeft}>
            <Image
              source={{ uri: mockProduct.seller.avatar }}
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{mockProduct.seller.name}</Text>
                {mockProduct.seller.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                )}
              </View>
              <View style={styles.sellerMeta}>
                <Ionicons name="star" size={14} color="#FFB84D" />
                <Text style={styles.ratingText}>
                  {mockProduct.seller.rating} ({mockProduct.seller.totalReviews})
                </Text>
              </View>
              <Text style={styles.responseTime}>
                Responds in {mockProduct.seller.responseTime}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </SlideInView>

        {/* Description */}
        <SlideInView direction="up" delay={350}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{mockProduct.description}</Text>
          </View>
        </SlideInView>

        {/* Similar Products Placeholder */}
        <SlideInView direction="up" delay={450}>
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Similar Products</Text>
            <Text style={styles.placeholderText}>Coming soon...</Text>
          </View>
        </SlideInView>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
        <View style={styles.messageButtonWrapper}>
          <AnimatedButton
            title="Message Seller"
            icon="chatbubble-outline"
            onPress={handleMessage}
            size="large"
            style={styles.messageButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#fff',
  },
  conditionBadge: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  conditionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3436',
    lineHeight: 28,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#636E72',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E5F9F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  sellerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  sellerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  responseTime: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#636E72',
    lineHeight: 24,
  },
  similarSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#B2BEC3',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonWrapper: {
    flex: 1,
  },
  messageButton: {
    height: 56,
    borderRadius: 28,
  },
});