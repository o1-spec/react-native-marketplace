import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { id: '1', name: 'Electronics', icon: 'laptop-outline', color: '#FF6B6B', count: 1234 },
  { id: '2', name: 'Fashion', icon: 'shirt-outline', color: '#4ECDC4', count: 856 },
  { id: '3', name: 'Home', icon: 'home-outline', color: '#FFB84D', count: 642 },
  { id: '4', name: 'Sports', icon: 'basketball-outline', color: '#A29BFE', count: 421 },
  { id: '5', name: 'Books', icon: 'book-outline', color: '#FD79A8', count: 389 },
  { id: '6', name: 'Toys', icon: 'game-controller-outline', color: '#74B9FF', count: 312 },
  { id: '7', name: 'Beauty', icon: 'rose-outline', color: '#FF7979', count: 278 },
  { id: '8', name: 'Vehicles', icon: 'car-outline', color: '#6C5CE7', count: 195 },
];

const priceRanges = [
  { id: '1', label: 'Under $25', min: 0, max: 25, icon: 'cash-outline' },
  { id: '2', label: '$25 - $50', min: 25, max: 50, icon: 'wallet-outline' },
  { id: '3', label: '$50 - $100', min: 50, max: 100, icon: 'card-outline' },
  { id: '4', label: '$100 - $500', min: 100, max: 500, icon: 'pricetag-outline' },
  { id: '5', label: 'Over $500', min: 500, max: null, icon: 'diamond-outline' },
];

const conditions = [
  { id: '1', label: 'New', icon: 'sparkles' },
  { id: '2', label: 'Like New', icon: 'star' },
  { id: '3', label: 'Good', icon: 'thumbs-up' },
  { id: '4', label: 'Fair', icon: 'hand-left' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryPress = (category: any) => {
    Alert.alert(category.name, `Browse ${category.count} items in ${category.name}`);
    // TODO: Navigate to category screen with filter
  };

  const handlePricePress = (range: any) => {
    Alert.alert('Price Filter', `Browse items ${range.label}`);
    // TODO: Navigate to search with price filter
  };

  const handleConditionPress = (condition: any) => {
    Alert.alert('Condition', `Browse ${condition.label} items`);
    // TODO: Navigate to search with condition filter
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => Alert.alert('Filters', 'Advanced filters coming soon...')}
        >
          <Ionicons name="options-outline" size={24} color="#2D3436" />
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
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
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
                    { backgroundColor: category.color + '20' },
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
                    <Ionicons name={range.icon as any} size={24} color="#4ECDC4" />
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Trending', 'Coming soon...')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="trending-up" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.quickActionText}>Trending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('New Arrivals', 'Coming soon...')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="flash" size={28} color="#FFB84D" />
              </View>
              <Text style={styles.quickActionText}>New Arrivals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Nearby', 'Coming soon...')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="location" size={28} color="#4ECDC4" />
              </View>
              <Text style={styles.quickActionText}>Nearby</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Deals', 'Coming soon...')}
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
              'iPhone 13',
              'MacBook',
              'Gaming Console',
              'Headphones',
              'Camera',
              'Smartwatch',
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
  },
  seeAll: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    color: '#B2BEC3',
  },
  priceList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  priceSubtext: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  conditionsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
  },
  popularSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
  },
  bottomSpacing: {
    height: 40,
  },
});