import AnimatedButton from "@/components/AnimatedButton";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { productsAPI } from "@/lib/api"; // ✅ ADD IMPORT
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

type FilterType =
  | "trending"
  | "new-arrivals"
  | "nearby"
  | "deals"
  | "category"
  | "price"
  | "condition"
  | "search"
  | "all-categories"
  | "advanced";

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
  const [products, setProducts] = useState<any[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ✅ FETCH PRODUCTS BASED ON FILTERS
  const fetchProducts = async (pageNum = 1, append = false) => {
    try {
      if (!append) {
        setProductsError(null);
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Build API parameters based on filter type
      let apiParams: any = {
        page: pageNum,
        limit: 20,
      };

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          apiParams.sortBy = "price";
          apiParams.sortOrder = "asc";
          break;
        case "price-high":
          apiParams.sortBy = "price";
          apiParams.sortOrder = "desc";
          break;
        case "newest":
          apiParams.sortBy = "createdAt";
          apiParams.sortOrder = "desc";
          break;
        case "relevant":
        default:
          apiParams.sortBy = "createdAt";
          apiParams.sortOrder = "desc";
          break;
      }

      // Apply filters based on type
      switch (filterType) {
        case "trending":
          apiParams.sortBy = "views";
          apiParams.sortOrder = "desc";
          break;

        case "new-arrivals":
          // Get products from last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          // Note: This would need backend support for date filtering
          break;

        case "nearby":
          // In real app, use user's location
          // For now, just show all products
          break;

        case "deals":
          apiParams.maxPrice = 500;
          break;

        case "category":
          apiParams.category = filterValue;
          break;

        case "price":
          const [min, max] = filterValue.split("-").map(Number);
          if (min) apiParams.minPrice = min;
          if (max) apiParams.maxPrice = max;
          break;

        case "condition":
          apiParams.condition = filterValue.toLowerCase().replace(" ", "_");
          break;

        case "search":
        case "advanced":
          if (searchQuery) apiParams.search = searchQuery;
          
          // Handle advanced filters
          if (params.priceRange) {
            const [min, max] = (params.priceRange as string).split("-");
            if (min && min !== "0") apiParams.minPrice = parseFloat(min);
            if (max) apiParams.maxPrice = parseFloat(max);
          }
          if (params.condition) apiParams.condition = params.condition;
          if (params.location) apiParams.location = params.location;
          break;

        default:
          // No additional filtering
          break;
      }

      const response = await productsAPI.getProducts(apiParams);

      if (append) {
        setProducts(prev => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setHasMore(response.products.length === 20);
    } catch (error: any) {
      console.error('Fetch products error:', error);
      setProductsError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [filterType, filterValue, sortBy, searchQuery]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    // fetchProducts will be called via useEffect
  };

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
      case "advanced":
        return "Search Results";
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
              onPress={() => handleSortChange(sort.key as any)}
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

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ProductCardSkeleton />
      </View>
    );
  };

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
      ) : productsError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color="#B2BEC3" />
          <Text style={styles.errorText}>{productsError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchProducts(1, false)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
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
                image={item.images?.[0] || ''}
                location={`${item.location?.city}, ${item.location?.state}`}
                condition={item.condition}
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
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});