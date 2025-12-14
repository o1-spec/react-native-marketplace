import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const categories = [
  {
    id: "1",
    name: "Electronics",
    icon: "laptop-outline",
    color: "#FF6B6B",
    count: 1234,
  },
  {
    id: "2",
    name: "Fashion",
    icon: "shirt-outline",
    color: "#4ECDC4",
    count: 856,
  },
  { id: "3", name: "Home", icon: "home-outline", color: "#FFB84D", count: 642 },
  {
    id: "4",
    name: "Sports",
    icon: "basketball-outline",
    color: "#A29BFE",
    count: 421,
  },
  {
    id: "5",
    name: "Books",
    icon: "book-outline",
    color: "#FD79A8",
    count: 389,
  },
  {
    id: "6",
    name: "Toys",
    icon: "game-controller-outline",
    color: "#74B9FF",
    count: 312,
  },
  {
    id: "7",
    name: "Beauty",
    icon: "rose-outline",
    color: "#FF7979",
    count: 278,
  },
  {
    id: "8",
    name: "Vehicles",
    icon: "car-outline",
    color: "#6C5CE7",
    count: 195,
  },
];

const priceRanges = [
  { id: "1", label: "Under $25", min: 0, max: 25, icon: "cash-outline" },
  { id: "2", label: "$25 - $50", min: 25, max: 50, icon: "wallet-outline" },
  { id: "3", label: "$50 - $100", min: 50, max: 100, icon: "card-outline" },
  {
    id: "4",
    label: "$100 - $500",
    min: 100,
    max: 500,
    icon: "pricetag-outline",
  },
  { id: "5", label: "Over $500", min: 500, max: null, icon: "diamond-outline" },
];

const conditions = [
  { id: "1", label: "New", icon: "sparkles" },
  { id: "2", label: "Like New", icon: "star" },
  { id: "3", label: "Good", icon: "thumbs-up" },
  { id: "4", label: "Fair", icon: "hand-left" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    condition: "",
    location: "",
    distance: "25", // Default 25 miles
    datePosted: "",
    sortBy: "relevance",
  });

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

  const handlePricePress = (range: any) => {
    const value = range.max ? `${range.min}-${range.max}` : `${range.min}`;
    router.push({
      pathname: "/search",
      params: {
        type: "price",
        value: value,
        query: searchQuery,
      },
    });
  };

  const handleConditionPress = (condition: any) => {
    router.push({
      pathname: "/search",
      params: {
        type: "condition",
        value: condition.label,
        query: searchQuery,
      },
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        params: { 
          query: searchQuery.trim(),
          type: 'search'
        }
      });
    }
  };

  const handleSeeAllCategories = () => {
    router.push({
      pathname: "/search",
      params: { 
        type: "all-categories",
        value: "all"
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.condition) count++;
    if (filters.location) count++;
    if (filters.distance !== "25") count++;
    if (filters.datePosted) count++;
    if (filters.sortBy !== "relevance") count++;
    return count;
  };

  const handleApplyFilters = () => {
    const params: any = { type: "advanced" };
    
    if (filters.minPrice || filters.maxPrice) {
      params.priceRange = `${filters.minPrice || 0}-${filters.maxPrice || ""}`;
    }
    if (filters.condition) params.condition = filters.condition;
    if (filters.location) params.location = filters.location;
    if (filters.distance) params.distance = filters.distance;
    if (filters.datePosted) params.datePosted = filters.datePosted;
    if (filters.sortBy) params.sortBy = filters.sortBy;
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
      location: "",
      distance: "25",
      datePosted: "",
      sortBy: "relevance",
    });
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={24} color="#2D3436" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={handleSeeAllCategories}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Browse by Price */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Price</Text>
          </View>

          <View style={styles.priceList}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={styles.priceCard}
                onPress={() => handlePricePress(range)}
                activeOpacity={0.7}
              >
                <View style={styles.priceLeft}>
                  <View style={styles.priceIcon}>
                    <Ionicons
                      name={range.icon as any}
                      size={24}
                      color="#4ECDC4"
                    />
                  </View>
                  <View>
                    <Text style={styles.priceLabel}>{range.label}</Text>
                    <Text style={styles.priceSubtext}>Find great deals</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Browse by Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Condition</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.conditionsContainer}
          >
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={styles.conditionChip}
                onPress={() => handleConditionPress(condition)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={condition.icon as any}
                  size={20}
                  color="#4ECDC4"
                />
                <Text style={styles.conditionText}>{condition.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { type: "trending" },
                })
              }
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="trending-up" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.quickActionText}>Trending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { type: "new-arrivals" },
                })
              }
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="flash" size={28} color="#FFB84D" />
              </View>
              <Text style={styles.quickActionText}>New Arrivals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { type: "nearby" },
                })
              }
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="location" size={28} color="#4ECDC4" />
              </View>
              <Text style={styles.quickActionText}>Nearby</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { type: "deals" },
                })
              }
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="pricetag" size={28} color="#A29BFE" />
              </View>
              <Text style={styles.quickActionText}>Best Deals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
          </View>

          <View style={styles.popularSearches}>
            {[
              "iPhone 13",
              "MacBook",
              "Gaming Console",
              "Headphones",
              "Camera",
              "Smartwatch",
            ].map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchChip}
                onPress={() => setSearchQuery(search)}
              >
                <Ionicons name="search" size={16} color="#636E72" />
                <Text style={styles.searchChipText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Advanced Filters Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#2D3436" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceInputLabel}>Min Price</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="0"
                      value={filters.minPrice}
                      onChangeText={(value) => updateFilter('minPrice', value)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceInputLabel}>Max Price</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="No limit"
                      value={filters.maxPrice}
                      onChangeText={(value) => updateFilter('maxPrice', value)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Condition */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Condition</Text>
              <View style={styles.conditionOptions}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition.id}
                    style={[
                      styles.conditionOption,
                      filters.condition === condition.label && styles.activeConditionOption,
                    ]}
                    onPress={() => updateFilter('condition', 
                      filters.condition === condition.label ? '' : condition.label
                    )}
                  >
                    <Ionicons
                      name={condition.icon as any}
                      size={20}
                      color={filters.condition === condition.label ? '#4ECDC4' : '#636E72'}
                    />
                    <Text style={[
                      styles.conditionOptionText,
                      filters.condition === condition.label && styles.activeConditionOptionText,
                    ]}>
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#B2BEC3" />
                <TextInput
                  style={styles.locationInput}
                  placeholder="City, State or ZIP code"
                  value={filters.location}
                  onChangeText={(value) => updateFilter('location', value)}
                />
              </View>
              <View style={styles.distanceOptions}>
                <Text style={styles.distanceLabel}>Distance:</Text>
                {['5', '10', '25', '50'].map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.distanceOption,
                      filters.distance === distance && styles.activeDistanceOption,
                    ]}
                    onPress={() => updateFilter('distance', distance)}
                  >
                    <Text style={[
                      styles.distanceOptionText,
                      filters.distance === distance && styles.activeDistanceOptionText,
                    ]}>
                      {distance} miles
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Posted */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Posted</Text>
              <View style={styles.dateOptions}>
                {[
                  { label: 'Any time', value: '' },
                  { label: 'Today', value: 'today' },
                  { label: 'This week', value: 'week' },
                  { label: 'This month', value: 'month' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dateOption,
                      filters.datePosted === option.value && styles.activeDateOption,
                    ]}
                    onPress={() => updateFilter('datePosted', option.value)}
                  >
                    <Text style={[
                      styles.dateOptionText,
                      filters.datePosted === option.value && styles.activeDateOptionText,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { label: 'Relevance', value: 'relevance' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' },
                  { label: 'Date: Newest First', value: 'date-new' },
                  { label: 'Distance', value: 'distance' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      filters.sortBy === option.value && styles.activeSortOption,
                    ]}
                    onPress={() => updateFilter('sortBy', option.value)}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      filters.sortBy === option.value && styles.activeSortOptionText,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: "23%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D3436",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    color: "#B2BEC3",
  },
  priceList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5F9F8",
    justifyContent: "center",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 2,
  },
  priceSubtext: {
    fontSize: 12,
    color: "#B2BEC3",
  },
  conditionsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  conditionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
  },
  popularSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 8,
  },
  searchChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636E72",
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  modalHeader: {
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
  modalBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  distanceOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  distanceLabel: {
    fontSize: 14,
    color: '#636E72',
    marginRight: 8,
  },
  distanceOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeDistanceOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  distanceOptionText: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '600',
  },
  activeDistanceOptionText: {
    color: '#fff',
  },
  conditionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeConditionOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  conditionOptionText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '600',
  },
  activeConditionOptionText: {
    color: '#fff',
  },
  dateOptions: {
    gap: 8,
  },
  dateOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeDateOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '600',
  },
  activeDateOptionText: {
    color: '#fff',
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeSortOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '600',
  },
  activeSortOptionText: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636E72',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});