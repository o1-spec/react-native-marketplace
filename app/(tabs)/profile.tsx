import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock user data - replace with API call later
const mockUser = {
  id: "me",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  avatar: "https://i.pravatar.cc/300?img=47",
  bio: "Passionate seller of quality electronics and gadgets. Always responsive!",
  location: "San Francisco, CA",
  phoneNumber: "+1 (555) 123-4567",
  rating: 4.8,
  totalReviews: 124,
  totalSales: 89,
  memberSince: "Jan 2023",
  verified: true,
};

const mockListings = [
  {
    id: "1",
    title: "iPhone 13 Pro Max 256GB",
    price: 899,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    status: "active",
    views: 245,
  },
  {
    id: "2",
    title: 'MacBook Pro 14" M1 Pro',
    price: 1899,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    status: "active",
    views: 189,
  },
  {
    id: "3",
    title: "iPad Air 5th Gen",
    price: 499,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    status: "sold",
    views: 312,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"listings" | "sold">("listings");

  const activeListings = mockListings.filter(
    (item) => item.status === "active"
  );
  const soldListings = mockListings.filter((item) => item.status === "sold");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: Clear auth state
          router.replace("/(auth)/login");
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
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listingPrice}>${item.price.toLocaleString()}</Text>
        <View style={styles.listingMeta}>
          <Ionicons name="eye-outline" size={14} color="#636E72" />
          <Text style={styles.listingViews}>{item.views} views</Text>
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
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
            {mockUser.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>

          {mockUser.bio && <Text style={styles.userBio}>{mockUser.bio}</Text>}

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

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/(auth)/complete-profile")}
          >
            <Ionicons name="create-outline" size={20} color="#2D3436" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{mockUser.location}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="call-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{mockUser.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{mockUser.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* My Listings Section */}
        <View style={styles.listingsSection}>
          <Text style={styles.sectionTitle}>My Listings</Text>

          {/* Tabs */}
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
          </View>

          {/* Listings Grid */}
          <View style={styles.listingsGrid}>
            {activeTab === "listings"
              ? activeListings.map(renderListingCard)
              : soldListings.map(renderListingCard)}
          </View>

          {/* Empty State */}
          {((activeTab === "listings" && activeListings.length === 0) ||
            (activeTab === "sold" && soldListings.length === 0)) && (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color="#B2BEC3" />
              <Text style={styles.emptyText}>
                {activeTab === "listings"
                  ? "No active listings yet"
                  : "No sold items yet"}
              </Text>
              {activeTab === "listings" && (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/(tabs)/create")}
                >
                  <Text style={styles.createButtonText}>Create Listing</Text>
                </TouchableOpacity>
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
              <Ionicons name="help-circle-outline" size={24} color="#636E72" />
              <Text style={styles.actionText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <View style={styles.actionLeft}>
              <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
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
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
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
  createButton: {
    backgroundColor: "#2D3436",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
});
