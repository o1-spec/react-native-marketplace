import AnimatedButton from "@/components/AnimatedButton";
import { productsAPI, reviewsAPI, userAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"listings" | "sold" | "reviews">(
    "listings"
  );

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserReviews = async () => {
    if (!user?.id) return;

    try {
      setReviewsError(null);
      setReviewsLoading(true);
      const response = await reviewsAPI.getReviews(user.id);
      setReviews(response.reviews);
    } catch (error: any) {
      setReviewsError("Failed to load reviews");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to load reviews",
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setUserError(null);
      const userData = await userAPI.getProfile();
      setUser(userData.user);
    } catch (error: any) {
      setUserError("Failed to load profile");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to load profile",
      });
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      setListingsError(null);
      const response = await productsAPI.getMyListings();
      setListings(response.products || []);
    } catch (error: any) {
      setListingsError("Failed to load listings");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to load listings",
      });
    } finally {
      setListingsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isRefreshing) {
        fetchUserProfile();
        fetchUserListings();
        fetchUserReviews();
      }
    }, [isRefreshing])
  );

  const activeListings = listings.filter((item) => item.status === "active");
  const soldListings = listings.filter((item) => item.status === "sold");

  const uploadAvatarToCloudinary = async (uri: string): Promise<string> => {
    const formData = new FormData();

    const fileExtension = uri.split(".").pop() || "jpg";
    const fileName = `profile_${Date.now()}.${fileExtension}`;

    formData.append("file", {
      uri,
      type: `image/${fileExtension}`,
      name: fileName,
    } as any);

    const response = await fetch(
      "http://localhost:3000/api/upload?folder=profiles",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const handleAvatarChange = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Permission to access media library is required!",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUpdatingAvatar(true);
        const imageUri = result.assets[0].uri;

        const avatarUrl = await uploadAvatarToCloudinary(imageUri);

        await userAPI.updateProfile({ avatar: avatarUrl });

        setUser((prev: any) => ({ ...prev, avatar: avatarUrl }));

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Avatar updated successfully!",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update avatar. Please try again.",
      });
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("authToken");
            router.replace("/(auth)/login");
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to logout. Please try again.",
            });
          }
        },
      },
    ]);
  };

  const renderListingCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listingCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.images?.[0] || "" }}
        style={styles.listingImage}
      />
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listingPrice}>₦{item.price.toLocaleString()}</Text>
        <View style={styles.listingMeta}>
          <Ionicons name="eye-outline" size={14} color="#636E72" />
          <Text style={styles.listingViews}>{item.views || 0} views</Text>
        </View>
      </View>
      {item.status === "sold" && (
        <View style={styles.soldBadge}>
          <Text style={styles.soldText}>SOLD</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/product/edit/${item.id}`)}
      >
        <Ionicons name="pencil" size={16} color="#2D3436" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (userError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color="#B2BEC3" />
        <Text style={styles.errorText}>{userError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {!user ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  onPress={handleAvatarChange}
                  disabled={updatingAvatar}
                >
                  <Image
                    source={{ uri: user.avatar || "" }}
                    style={[
                      styles.avatar,
                      !user.avatar && styles.avatarPlaceholder,
                    ]}
                  />
                  {!user.avatar && (
                    <View style={styles.avatarPlaceholderContent}>
                      <Ionicons name="person" size={40} color="#B2BEC3" />
                    </View>
                  )}
                  <View style={styles.editAvatarButton}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
                {user.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4ECDC4"
                    />
                  </View>
                )}
                {updatingAvatar && (
                  <View style={styles.avatarLoading}>
                    <Ionicons name="refresh" size={24} color="#4ECDC4" />
                  </View>
                )}
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

              {/* Stats */}
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

              <AnimatedButton
                title="Edit Profile"
                icon="create-outline"
                variant="secondary"
                onPress={() => router.push("/profile/edit")}
              />
            </View>

            {/* Quick Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {user.location || "Not set"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call-outline" size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {user.phoneNumber || "Not set"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Unknown"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.listingsSection}>
              <Text style={styles.sectionTitle}>My Listings</Text>

              {/* Tabs */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "listings" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("listings")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "listings" && styles.activeTabText,
                    ]}
                  >
                    Active ({activeListings.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "sold" && styles.activeTab]}
                  onPress={() => setActiveTab("sold")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "sold" && styles.activeTabText,
                    ]}
                  >
                    Sold ({soldListings.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "reviews" && styles.activeTab,
                  ]}
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

              {/* Listings Grid */}
              {activeTab === "reviews" ? (
                reviewsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                    <Text style={styles.loadingText}>Loading reviews...</Text>
                  </View>
                ) : reviewsError ? (
                  <View style={styles.errorContainer}>
                    <Ionicons
                      name="cloud-offline-outline"
                      size={48}
                      color="#B2BEC3"
                    />
                    <Text style={styles.errorText}>{reviewsError}</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={fetchUserReviews}
                    >
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : reviews.length > 0 ? (
                  <View style={styles.reviewsList}>
                    {reviews.map((review) => (
                      <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                          <Image
                            source={{
                              uri:
                                review.reviewer.avatar ||
                                "https://i.pravatar.cc/300?img=47",
                            }}
                            style={styles.reviewerAvatar}
                          />
                          <View style={styles.reviewInfo}>
                            <Text style={styles.reviewerName}>
                              {review.reviewer.name}
                            </Text>
                            <View style={styles.ratingContainer}>
                              {[...Array(5)].map((_, i) => (
                                <Ionicons
                                  key={i}
                                  name={
                                    i < review.rating ? "star" : "star-outline"
                                  }
                                  size={14}
                                  color="#FFD700"
                                />
                              ))}
                            </View>
                          </View>
                          <Text style={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.reviewComment}>
                          {review.comment}
                        </Text>
                        <TouchableOpacity
                          style={styles.productLink}
                          onPress={() =>
                            router.push(`/product/${review.product.id}`)
                          }
                        >
                          <Text style={styles.productLinkText}>
                            About: {review.product.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={64}
                      color="#B2BEC3"
                    />
                    <Text style={styles.emptyText}>No reviews yet</Text>
                    <Text style={styles.emptySubtext}>
                      Reviews from buyers will appear here
                    </Text>
                  </View>
                )
              ) : listingsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4ECDC4" />
                  <Text style={styles.loadingText}>Loading listings...</Text>
                </View>
              ) : listingsError ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={48}
                    color="#B2BEC3"
                  />
                  <Text style={styles.errorText}>{listingsError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchUserListings}
                  >
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.listingsGrid}>
                  {activeTab === "listings"
                    ? activeListings.map(renderListingCard)
                    : soldListings.map(renderListingCard)}
                </View>
              )}

              {!listingsLoading &&
                !listingsError &&
                activeTab !== "reviews" &&
                ((activeTab === "listings" && activeListings.length === 0) ||
                  (activeTab === "sold" && soldListings.length === 0)) && (
                  <View style={styles.emptyState}>
                    <Ionicons name="cube-outline" size={64} color="#B2BEC3" />
                    <Text style={styles.emptyText}>
                      {activeTab === "listings"
                        ? "No active listings yet"
                        : "No sold items yet"}
                    </Text>
                    {activeTab === "listings" && (
                      <AnimatedButton
                        title="Create Listing"
                        icon="add-circle"
                        onPress={() => router.push("/(tabs)/create")}
                        size="large"
                      />
                    )}
                  </View>
                )}
            </View>

            {/* Actions Section */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/favorites")}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
                  <Text style={styles.actionText}>Favorites</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/settings")}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="settings-outline" size={24} color="#636E72" />
                  <Text style={styles.actionText}>Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/help")}
              >
                <View style={styles.actionLeft}>
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#636E72"
                  />
                  <Text style={styles.actionText}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleLogout}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                  <Text style={[styles.actionText, styles.logoutText]}>
                    Logout
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </>
        )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3436",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
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
    borderRadius: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 12,
  },
  userBio: {
    fontSize: 15,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  infoSection: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  listingsSection: {
    backgroundColor: "#fff",
    paddingTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
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
  listingsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
    marginRight: 12,
  },
  listingInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  listingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listingViews: {
    fontSize: 13,
    color: "#636E72",
  },
  soldBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  soldText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  editButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#636E72",
    marginTop: 16,
    marginBottom: 24,
  },
  actionsSection: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  logoutText: {
    color: "#FF6B6B",
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    fontSize: 16,
    color: "#636E72",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  avatarPlaceholder: {
    backgroundColor: "#F5F5F5",
  },
  avatarPlaceholderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 12,
    color: "#B2BEC3",
  },
  reviewComment: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
    marginBottom: 8,
  },
  productLink: {
    alignSelf: "flex-start",
  },
  productLinkText: {
    fontSize: 13,
    color: "#4ECDC4",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#B2BEC3",
    textAlign: "center",
    marginTop: 8,
  },
});
