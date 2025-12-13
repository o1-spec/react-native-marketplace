import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Mock user data - replace with API call
const mockUser = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/300?img=12',
  bio: 'Trusted seller with 5+ years experience. Fast shipping, great prices!',
  location: 'New York, NY',
  rating: 4.8,
  totalReviews: 124,
  totalSales: 89,
  responseTime: '~1 hour',
  memberSince: 'Jan 2020',
  verified: true,
  isFollowing: false,
};

const mockListings = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256GB',
    price: 899,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
    condition: 'Used',
  },
  {
    id: '2',
    title: 'MacBook Pro 14" M1 Pro',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    condition: 'New',
  },
  {
    id: '3',
    title: 'Sony WH-1000XM4 Headphones',
    price: 249,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    condition: 'Used',
  },
  {
    id: '4',
    title: 'iPad Air 5th Gen 64GB',
    price: 499,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    condition: 'New',
  },
];

const mockReviews = [
  {
    id: '1',
    reviewerName: 'Sarah Smith',
    reviewerAvatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    comment: 'Great seller! Item exactly as described. Fast shipping!',
    date: '2 days ago',
  },
  {
    id: '2',
    reviewerName: 'Mike Johnson',
    reviewerAvatar: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    comment: 'Very responsive and professional. Highly recommend!',
    date: '1 week ago',
  },
  {
    id: '3',
    reviewerName: 'Emily Davis',
    reviewerAvatar: 'https://i.pravatar.cc/150?img=47',
    rating: 4,
    comment: 'Good experience overall. Item was in great condition.',
    date: '2 weeks ago',
  },
];

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Following',
      isFollowing
        ? `You unfollowed ${mockUser.name}`
        : `You're now following ${mockUser.name}`
    );
  };

  const handleMessage = () => {
    router.push(`/chat/${id}`);
  };

  const renderListingCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listingCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      {item.condition === 'New' && (
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>NEW</Text>
        </View>
      )}
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listingPrice}>${item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReviewCard = (item: any) => (
    <View key={item.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.reviewerAvatar }} style={styles.reviewerAvatar} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.rating ? 'star' : 'star-outline'}
                size={14}
                color="#FFB84D"
              />
            ))}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => Alert.alert('Share', 'Coming soon...')}
        >
          <Ionicons name="share-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
            {mockUser.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={28} color="#4ECDC4" />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{mockUser.name}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.rating}</Text>
              <View style={styles.statLabelRow}>
                <Ionicons name="star" size={14} color="#FFB84D" />
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.totalReviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.totalSales}</Text>
              <Text style={styles.statLabel}>Sales</Text>
            </View>
          </View>

          {mockUser.bio && <Text style={styles.userBio}>{mockUser.bio}</Text>}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollow}
            >
              <Ionicons
                name={isFollowing ? 'checkmark' : 'person-add-outline'}
                size={20}
                color={isFollowing ? '#4ECDC4' : '#2D3436'}
              />
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{mockUser.location}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Response Time</Text>
              <Text style={styles.infoValue}>{mockUser.responseTime}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{mockUser.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsSection}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'listings' && styles.activeTab]}
              onPress={() => setActiveTab('listings')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'listings' && styles.activeTabText,
                ]}
              >
                Listings ({mockListings.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text
                style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}
              >
                Reviews ({mockReviews.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.tabContent}>
            {activeTab === 'listings' ? (
              <View style={styles.listingsGrid}>
                {mockListings.map(renderListingCard)}
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {mockReviews.map(renderReviewCard)}
              </View>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#636E72',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  userBio: {
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2D3436',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2D3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  followButton: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  followingButton: {
    backgroundColor: '#E5F9F8',
    borderColor: '#4ECDC4',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  followingButtonText: {
    color: '#4ECDC4',
  },
  infoSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#636E72',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  tabsSection: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2D3436',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B2BEC3',
  },
  activeTabText: {
    color: '#2D3436',
  },
  tabContent: {
    paddingTop: 16,
  },
  listingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  listingCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  listingImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E5EA',
  },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 6,
    lineHeight: 18,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#B2BEC3',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});