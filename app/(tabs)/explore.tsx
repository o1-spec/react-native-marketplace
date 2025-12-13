import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity onPress={() => router.push('/modal')}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search all products..."
          placeholderTextColor="#8E8E93"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* All Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <View style={styles.categoryGrid}>
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'].map((category) => (
              <TouchableOpacity key={category} style={styles.gridItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="cube-outline" size={32} color="#007AFF" />
                </View>
                <Text style={styles.gridItemText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Browse by Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Price</Text>
          <View style={styles.priceRanges}>
            {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map((range) => (
              <TouchableOpacity key={range} style={styles.priceCard}>
                <Text style={styles.priceText}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E3F2FD',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridItemText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
  },
  priceRanges: {
    paddingHorizontal: 16,
  },
  priceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});