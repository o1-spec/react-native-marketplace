import AnimatedButton from '@/components/AnimatedButton';
import ProductCard from '@/components/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock favorites data
const mockFavorites = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max 256GB',
    price: 899,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
    location: 'San Francisco, CA',
    condition: 'Used',
    seller: {
      name: 'John Doe',
      rating: 4.8,
    },
    savedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'MacBook Pro 14" M1 Pro',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    location: 'New York, NY',
    condition: 'New',
    seller: {
      name: 'Sarah Smith',
      rating: 4.9,
    },
    savedDate: '1 week ago',
  },
  {
    id: '3',
    title: 'Sony WH-1000XM4 Headphones',
    price: 249,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    location: 'Los Angeles, CA',
    condition: 'Used',
    seller: {
      name: 'Mike Johnson',
      rating: 4.7,
    },
    savedDate: '2 weeks ago',
  },
  {
    id: '4',
    title: 'iPad Air 5th Gen 64GB',
    price: 499,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    location: 'Chicago, IL',
    condition: 'New',
    seller: {
      name: 'Emily Davis',
      rating: 5.0,
    },
    savedDate: '3 weeks ago',
  },
  {
    id: '5',
    title: 'Canon EOS R6 Camera Body',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1606980623314-0a13d7e6c5b3?w=400',
    location: 'Seattle, WA',
    condition: 'Used',
    seller: {
      name: 'David Wilson',
      rating: 4.6,
    },
    savedDate: '1 month ago',
  },
  {
    id: '6',
    title: 'Nintendo Switch OLED',
    price: 299,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
    location: 'Boston, MA',
    condition: 'New',
    seller: {
      name: 'Lisa Anderson',
      rating: 4.8,
    },
    savedDate: '1 month ago',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent');

  const handleRemoveFavorite = (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this item from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter((item) => item.id !== id));
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
          onPress: () => setFavorites([]),
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

  const getSortedFavorites = () => {
    switch (sortBy) {
      case 'price-low':
        return [...favorites].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...favorites].sort((a, b) => b.price - a.price);
      case 'recent':
      default:
        return favorites;
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

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <Text style={styles.statsValue}>{favorites.length}</Text>
        <Text style={styles.statsLabel}>Saved Items</Text>
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.statsValue}>
          ${favorites.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
        </Text>
        <Text style={styles.statsLabel}>Total Value</Text>
      </View>
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
        data={getSortedFavorites()}
        renderItem={({ item }) => (
          <View style={styles.productCardWrapper}>
            <ProductCard
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
              location={item.location}
              condition={item.condition as 'New' | 'Used'}  
              isFavorite={true}
              onFavoritePress={() => handleRemoveFavorite(item.id)}
            />
            <View style={styles.cardFooter}>
              <View style={styles.sellerInfo}>
                <Ionicons name="person-circle-outline" size={16} color="#636E72" />
                <Text style={styles.sellerName}>{item.seller.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFB84D" />
                  <Text style={styles.ratingText}>{item.seller.rating}</Text>
                </View>
              </View>
              <Text style={styles.savedDate}>Saved {item.savedDate}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyContainer,
        ]}
        ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={favorites.length > 0 ? styles.row : undefined}
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
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
    width: '48%',
    marginBottom: 16,
  },
  cardFooter: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: -8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  sellerName: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFB84D',
  },
  savedDate: {
    fontSize: 11,
    color: '#B2BEC3',
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