import AnimatedButton from '@/components/AnimatedButton';
import ProductCard from '@/components/ProductCard';
import { favoritesAPI } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.favorites);
    } catch (error) {
      console.error('Fetch favorites error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this item from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesAPI.removeFavorite(id);
              setFavorites(favorites.filter((item) => item.id !== id));
            } catch (error) {
              console.error('Remove favorite error:', error);
              Alert.alert('Error', 'Failed to remove favorite');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all items from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                favorites.map(item => favoritesAPI.removeFavorite(item.id))
              );
              setFavorites([]);
            } catch (error) {
              console.error('Clear favorites error:', error);
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  const handleSort = () => {
    Alert.alert(
      'Sort By',
      'Choose how to sort your favorites',
      [
        {
          text: 'Recently Added',
          onPress: () => setSortBy('recent'),
        },
        {
          text: 'Price: Low to High',
          onPress: () => setSortBy('price-low'),
        },
        {
          text: 'Price: High to Low',
          onPress: () => setSortBy('price-high'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getFilteredAndSortedFavorites = () => {
    let filtered = [...favorites];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => 
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'recent':
      default:
        return filtered;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color="#B2BEC3" />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Save items you love by tapping the heart icon on any product
      </Text>
      <AnimatedButton
        title="Start Browsing"
        icon="compass"
        onPress={() => router.push('/(tabs)')}
        size="large"
      />
    </View>
  );

  const renderHeader = () => {
    const filteredFavorites = getFilteredAndSortedFavorites();
    
    return (
      <View>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#636E72" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your favorites..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#636E72" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{filteredFavorites.length}</Text>
            <Text style={styles.statsLabel}>
              {searchQuery ? 'Matching Items' : 'Saved Items'}
            </Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>
              ₦{filteredFavorites.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
            </Text>
            <Text style={styles.statsLabel}>Total Value</Text>
          </View>
        </View>
      </View>
    );
  };

  const filteredFavorites = getFilteredAndSortedFavorites();

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
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerRight}>
          {favorites.length > 0 && (
            <>
              <TouchableOpacity style={styles.headerButton} onPress={handleSort}>
                <Ionicons name="swap-vertical" size={22} color="#2D3436" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleClearAll}>
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={filteredFavorites}
        renderItem={({ item }) => (
          <View style={styles.productCardWrapper}>
            <ProductCard
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              location={item.location}
              condition={item.condition}
              isFavorite={true}
              onFavoritePress={() => handleRemoveFavorite(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={[
          styles.listContent,
          filteredFavorites.length === 0 && styles.emptyContainer,
        ]}
        ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={loading ? null : renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 13,
    color: '#636E72',
  },
  productCardWrapper: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
});