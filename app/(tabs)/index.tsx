import { FadeInView } from "@/components/AnimatedViews";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { productsAPI, userAPI } from "@/lib/api"; // ✅ ADD IMPORT
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { id: "1", name: "Electronics", icon: "laptop-outline", color: "#FF6B6B" },
  { id: "2", name: "Fashion", icon: "shirt-outline", color: "#4ECDC4" },
  { id: "3", name: "Home", icon: "home-outline", color: "#FFB84D" },
  { id: "4", name: "Sports", icon: "basketball-outline", color: "#A29BFE" },
  { id: "5", name: "Books", icon: "book-outline", color: "#FD79A8" },
  { id: "6", name: "Toys", icon: "game-controller-outline", color: "#74B9FF" },
];

const conditions = ["New", "Like New", "Good", "Fair"];

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // ✅ ADD REAL PRODUCTS STATE
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Mini filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    condition: "",
  });

  // ✅ FETCH FEATURED PRODUCTS
  const fetchFeaturedProducts = async () => {
    try {
      setProductsError(null);
      const response = await productsAPI.getProducts({
        limit: 6,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setFeaturedProducts(response.products || []);
    } catch (error: any) {
      console.error("Fetch featured products error:", error);
      setProductsError("Failed to load products");
      Alert.alert("Error", "Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await userAPI.getProfile();
      setUser(userData.user);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchFeaturedProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeaturedProducts();
    setRefreshing(false);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: "/search",
      params: {
        type: "category",
        value: category.name,
        query: searchQuery,
      },
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/search",
        params: {
          query: searchQuery.trim(),
          type: "search",
        },
      });
    }
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilters = () => {
    const params: any = { type: "quick-filter" };

    if (filters.minPrice || filters.maxPrice) {
      params.priceRange = `${filters.minPrice || 0}-${filters.maxPrice || ""}`;
    }
    if (filters.condition) params.condition = filters.condition;
    if (searchQuery) params.query = searchQuery;

    setFilterModalVisible(false);
    router.push({
      pathname: "/search",
      params,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      condition: "",
    });
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.condition) count++;
    return count;
  };

  const handleSeeAllCategories = () => {
    router.push({
      pathname: "/search",
      params: {
        type: "all-categories",
        value: "all",
      },
    });
  };

  const handleSeeAllFeatured = () => {
    router.push({
      pathname: "/search",
      params: {
        type: "featured",
        value: "all",
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {userLoading
              ? "Hello 👋"
              : user
              ? `Hello ${user.name} 👋`
              : "Hello 👋"}
          </Text>
          <Text style={styles.headerTitle}>Find Your Perfect Item</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="#2D3436" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#636E72" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands..."
          placeholderTextColor="#B2BEC3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Ionicons name="options-outline" size={20} color="#2D3436" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFiltersCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={handleSeeAllCategories}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={handleSeeAllFeatured}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {isLoading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={`skeleton-${index}`}
                  style={styles.productCardWrapper}
                >
                  <ProductCardSkeleton />
                </View>
              ))
            ) : productsError ? (
              // Show error state
              <View style={styles.errorContainer}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={48}
                  color="#B2BEC3"
                />
                <Text style={styles.errorText}>{productsError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchFeaturedProducts}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : featuredProducts.length === 0 ? (
              // Show empty state
              <View style={styles.emptyContainer}>
                <Ionicons name="storefront-outline" size={48} color="#B2BEC3" />
                <Text style={styles.emptyText}>No products available</Text>
                <Text style={styles.emptySubtext}>
                  Check back later for new listings
                </Text>
              </View>
            ) : (
              // Show actual products with fade animation
              featuredProducts.map((product, index) => (
                <FadeInView
                  key={product.id}
                  delay={index * 80}
                  style={styles.productCardWrapper}
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    image={product.images?.[0] || ""}
                    location={`${product.location?.city}, ${product.location?.state}`}
                    condition={product.condition}
                    isFavorite={favorites.includes(product.id)}
                    onFavoritePress={() => toggleFavorite(product.id)}
                    // onPress={() => router.push(`/product/${product.id}`)}
                  />
                </FadeInView>
              ))
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Mini Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Filters</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#636E72" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceInputs}>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Min</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        placeholder="0"
                        value={filters.minPrice}
                        onChangeText={(value) =>
                          updateFilter("minPrice", value)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Max</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        placeholder="No limit"
                        value={filters.maxPrice}
                        onChangeText={(value) =>
                          updateFilter("maxPrice", value)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Condition */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Condition</Text>
                <View style={styles.conditionOptions}>
                  {conditions.map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.conditionOption,
                        filters.condition === condition &&
                          styles.conditionOptionActive,
                      ]}
                      onPress={() =>
                        updateFilter(
                          "condition",
                          filters.condition === condition ? "" : condition
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.conditionText,
                          filters.condition === condition &&
                            styles.conditionTextActive,
                        ]}
                      >
                        {condition}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3436",
  },
  notificationButton: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2D3436",
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
  },
  seeAll: {
    fontSize: 14,
    color: "#636E72",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    alignItems: "center",
    gap: 8,
  },
  categoryCardActive: {
    opacity: 1,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3436",
  },
  productsGrid: {
    paddingHorizontal: 20,
  },
  productCardWrapper: {
    marginBottom: 16,
  },
  // ✅ ADD ERROR AND EMPTY STATES
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
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
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  priceInputs: {
    flexDirection: "row",
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#636E72",
    fontWeight: "600",
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
  },
  conditionOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  conditionOptionActive: {
    backgroundColor: "#E5F9F8",
    borderColor: "#4ECDC4",
  },
  conditionText: {
    fontSize: 14,
    color: "#636E72",
    fontWeight: "600",
  },
  conditionTextActive: {
    color: "#4ECDC4",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#636E72",
  },
  applyButton: {
    flex: 2,
    backgroundColor: "#4ECDC4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
