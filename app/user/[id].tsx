import AnimatedButton from "@/components/AnimatedButton";
import { productsAPI, reviewsAPI, userAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  createdAt: string;
}

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">(
    "listings"
  );

  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const userResponse = await userAPI.getUserProfile(id as string);
      setUser(userResponse.user);
      setIsFollowing(userResponse.user.isFollowing || false);

      const listingsResponse = await productsAPI.getListingsByUser(
        id as string
      );
      setListings(listingsResponse.products || []);

      const reviewsResponse = await reviewsAPI.getReviewsByUser(id as string);
      setReviews(reviewsResponse.reviews || []);
    } catch (error) {
      console.error("Fetch user data error:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? "Unfollowed" : "Following",
      isFollowing
        ? `You unfollowed ${user?.name}`
        : `You're now following ${user?.name}`
    );
  };

  const handleMessage = () => {
    router.push(`/chat/${id}`);
  };

  const renderListingCard = (item: Listing) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listingCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.images[0] || "https://i.pravatar.cc/300?img=47" }}
        style={styles.listingImage}
      />
      {item.condition === "new" && (
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

  const renderReviewCard = (item: Review) => (
    <View key={item.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={{
            uri: item.reviewer.avatar || "https://i.pravatar.cc/150?img=47",
          }}
          style={styles.reviewerAvatar}
        />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.reviewer.name}</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.rating ? "star" : "star-outline"}
                size={14}
                color="#FFB84D"
              />
            ))}
            <Text style={styles.reviewDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  // ✅ LOADING STATE
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  // ✅ ERROR STATE
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View />
        </View>
        <View style={styles.errorContainer}>
          <Text>User not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => Alert.alert("Share", "Coming soon...")}
        >
          <Ionicons name="share-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user.avatar || "https://i.pravatar.cc/300?img=47",
              }}
              style={styles.avatar}
            />
            {user.emailVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={28} color="#4ECDC4" />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user.name}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.rating || 0}</Text>
              <View style={styles.statLabelRow}>
                <Ionicons name="star" size={14} color="#FFB84D" />
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalReviews || 0}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalSales || 0}</Text>
              <Text style={styles.statLabel}>Sales</Text>
            </View>
          </View>

          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <AnimatedButton
              title="Message"
              icon="chatbubble-outline"
              onPress={handleMessage}
              size="large"
              style={styles.messageButton}
            />
            <AnimatedButton
              title={isFollowing ? "Following" : "Follow"}
              icon={isFollowing ? "checkmark" : "person-add-outline"}
              variant={isFollowing ? "outline" : "secondary"}
              onPress={handleFollow}
              size="large"
              style={isFollowing ? styles.followingButton : undefined}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user.location || "Unknown"}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Response Time</Text>
              <Text style={styles.infoValue}>~1 hour</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsSection}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "listings" && styles.activeTab]}
              onPress={() => setActiveTab("listings")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "listings" && styles.activeTabText,
                ]}
              >
                Listings ({listings.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
              onPress={() => setActiveTab("reviews")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "reviews" && styles.activeTabText,
                ]}
              >
                Reviews ({reviews.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.tabContent}>
            {activeTab === "listings" ? (
              <View style={styles.listingsGrid}>
                {listings.length > 0 ? (
                  listings.map(renderListingCard)
                ) : (
                  <Text style={styles.emptyText}>No listings yet</Text>
                )}
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.length > 0 ? (
                  reviews.map(renderReviewCard)
                ) : (
                  <Text style={styles.emptyText}>No reviews yet</Text>
                )}
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
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#636E72",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
  },
  userBio: {
    fontSize: 15,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  messageButton: {
    flex: 1,
  },
  followingButton: {
    borderColor: "#4ECDC4",
  },
  infoSection: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5F9F8",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#636E72",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
  },
  tabsSection: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2D3436",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B2BEC3",
  },
  activeTabText: {
    color: "#2D3436",
  },
  tabContent: {
    paddingTop: 16,
  },
  listingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  listingCard: {
    width: "48%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  listingImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#E5E5EA",
  },
  conditionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 6,
    lineHeight: 18,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#B2BEC3",
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#B2BEC3",
    fontSize: 16,
    paddingVertical: 40,
  },
  bottomSpacing: {
    height: 40,
  },
});
