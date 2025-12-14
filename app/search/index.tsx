import AnimatedButton from "@/components/AnimatedButton";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const mockProducts = [
  {
    id: "1",
    title: "iPhone 13 Pro Max 256GB",
    price: 899,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    location: "San Francisco, CA",
    condition: "Used",
    category: "Electronics",
    createdAt: "2024-12-10",
    trending: true,
    views: 1234,
  },
  {
    id: "2",
    title: 'MacBook Pro 14" M1 Pro',
    price: 1899,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    location: "New York, NY",
    condition: "New",
    category: "Electronics",
    createdAt: "2024-12-12",
    trending: true,
    views: 2345,
  },
  {
    id: "3",
    title: "Sony WH-1000XM4 Headphones",
    price: 249,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    location: "Los Angeles, CA",
    condition: "Used",
    category: "Electronics",
    createdAt: "2024-12-11",
    views: 567,
  },
  {
    id: "4",
    title: "iPad Air 5th Gen 64GB",
    price: 499,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    location: "Chicago, IL",
    condition: "New",
    category: "Electronics",
    createdAt: "2024-12-13",
    views: 890,
  },
  {
    id: "5",
    title: "Nike Air Max Sneakers",
    price: 89,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    location: "Miami, FL",
    condition: "New",
    category: "Fashion",
    createdAt: "2024-12-12",
    views: 456,
  },
  {
    id: "6",
    title: "Vintage Leather Jacket",
    price: 129,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    location: "Seattle, WA",
    condition: "Used",
    category: "Fashion",
    createdAt: "2024-12-09",
    views: 234,
  },
];

type FilterType =
  | "trending"
  | "new-arrivals"
  | "nearby"
  | "deals"
  | "category"
  | "price"
  | "condition"
  | "search"
 | "condition"
 | "all-categories";

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const filterType = params.type as FilterType;
  const filterValue = params.value as string;
  const [searchQuery, setSearchQuery] = useState(
    (params.query as string) || ""
  );
  const [sortBy, setSortBy] = useState<
    "relevant" | "price-low" | "price-high" | "newest"
  >("relevant");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading search results
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Slightly faster for search refinements

    return () => clearTimeout(timer);
  }, [filterType, filterValue, sortBy, searchQuery]);

  // Get filtered products based on filter type and search query
  const getFilteredProducts = () => {
    let filtered = [...mockProducts];

    // Apply search query filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      );
    }

    // Then apply other filters
    switch (filterType) {
      case "trending":
        filtered = filtered.filter((p) => p.trending);
        break;

      case "new-arrivals":
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        filtered = filtered.filter((p) => new Date(p.createdAt) > threeDaysAgo);
        break;

      case "nearby":
        // In real app, filter by user's location
        filtered = filtered.filter((p) => p.location.includes("San Francisco"));
        break;

      case "deals":
        // Filter items under $500
        filtered = filtered.filter((p) => p.price < 500);
        break;

      case "category":
        filtered = filtered.filter((p) => p.category === filterValue);
        break;

      case "price":
        const [min, max] = filterValue.split("-").map(Number);
        filtered = filtered.filter((p) => {
          if (max) {
            return p.price >= min && p.price <= max;
          }
          return p.price >= min;
        });
        break;

      case "condition":
        filtered = filtered.filter((p) => p.condition === filterValue);
        break;

      case "search":
        // Search query filtering is already handled above
        // This case indicates this is a search-based result
        break;

      default:
        // No additional filtering for unknown types
        break;
    }

    return filtered;
  };
  // Sort products
  const getSortedProducts = () => {
    const filtered = getFilteredProducts();

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "newest":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "relevant":
      default:
        return filtered;
    }
  };

  const products = getSortedProducts();

  // Get page title based on filter type
  const getPageTitle = () => {
  switch (filterType) {
    case "trending":
      return "Trending Now";
    case "new-arrivals":
      return "New Arrivals";
    case "nearby":
      return "Nearby Items";
    case "deals":
      return "Best Deals";
    case "category":
      return filterValue;
    case "price":
      return "Price Range";
    case "condition":
      return `${filterValue} Items`;
    case "all-categories":
      return "All Categories";
    default:
      return "Search Results";
  }
};

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#636E72" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => {
            // Perform new search with updated query
            router.push({
              pathname: "/search",
              params: {
                query: searchQuery,
                type: filterType,
                value: filterValue,
              },
            });
          }}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#636E72" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderSortButton = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.resultCount}>
        {products.length} {products.length === 1 ? "item" : "items"} found
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortButtonsScroll}
        style={styles.sortButtonsContainer}
      >
        <View style={styles.sortButtons}>
          {[
            { key: "relevant", label: "Relevant" },
            { key: "price-low", label: "Price: Low" },
            { key: "price-high", label: "Price: High" },
            { key: "newest", label: "Newest" },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortChip,
                sortBy === sort.key && styles.activeSortChip,
              ]}
              onPress={() => setSortBy(sort.key as any)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === sort.key && styles.activeSortChipText,
                ]}
              >
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="search-outline" size={80} color="#B2BEC3" />
      </View>
      <Text style={styles.emptyTitle}>No Items Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or browse other categories
      </Text>
      <AnimatedButton
        title="Browse All"
        icon="grid"
        onPress={() => router.push("/(tabs)/explore")}
        size="large"
      />
    </View>
  );

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
        <Text style={styles.headerTitle}>{getPageTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            /* TODO: Open advanced filters */
          }}
        >
          <Ionicons name="options-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Results */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={`skeleton-${index}`} style={styles.productCardWrapper}>
              <ProductCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.productCardWrapper}>
              <ProductCard
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
                location={item.location}
                condition={item.condition as "New" | "Used"}
                isFavorite={favorites.includes(item.id)}
                onFavoritePress={() => handleFavoriteToggle(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={[
            styles.listContent,
            products.length === 0 && styles.emptyContainer,
          ]}
          ListHeaderComponent={products.length > 0 ? renderSortButton : null}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flex: 1,
    textAlign: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
    paddingVertical: 0, // Remove default padding
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636E72",
  },
  sortButtonsContainer: {
    marginHorizontal: -16,
  },
  sortButtonsScroll: {
    paddingHorizontal: 16,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeSortChip: {
    backgroundColor: "#2D3436",
    borderColor: "#2D3436",
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
  },
  activeSortChipText: {
    color: "#fff",
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  productCardWrapper: {
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  skeletonGrid: {
    padding: 16,
  },
});
