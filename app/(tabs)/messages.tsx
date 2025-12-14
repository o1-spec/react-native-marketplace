import AnimatedButton from '@/components/AnimatedButton';
import LongPressMenu from '@/components/LongPressMenu';
import MessageCardSkeleton from '@/components/MessageCardSkeleton';
import SwipeToDelete from '@/components/SwipeToDelete';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock data - replace with API call later
const mockConversations = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    productId: 'prod1',
    productTitle: 'iPhone 13 Pro Max 256GB',
    productImage: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=100',
    lastMessage: "Is this still available? I'm interested!",
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    productId: 'prod2',
    productTitle: 'MacBook Pro 14" M1 Pro',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
    lastMessage: 'Can you do $1800?',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    productId: 'prod3',
    productTitle: 'Sony WH-1000XM4 Headphones',
    productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100',
    lastMessage: "Thanks! I'll pick it up tomorrow.",
    lastMessageTime: '3h ago',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emily Davis',
    userAvatar: 'https://i.pravatar.cc/150?img=47',
    productId: 'prod4',
    productTitle: 'iPad Air 5th Gen 64GB',
    productImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100',
    lastMessage: 'Where can we meet?',
    lastMessageTime: '1d ago',
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'David Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    productId: 'prod5',
    productTitle: 'Canon EOS R6 Camera Body',
    productImage: 'https://images.unsplash.com/photo-1606980623314-0a13d7e6c5b3?w=100',
    lastMessage: 'Does it come with warranty?',
    lastMessageTime: '2d ago',
    unreadCount: 0,
    isOnline: false,
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading conversations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
  };

  const handleArchiveConversation = (id: string) => {
    Alert.alert('Archived', 'Conversation archived successfully');
  };

  const handleMuteConversation = (id: string) => {
    Alert.alert('Muted', 'Conversation muted');
  };

  const renderConversation = ({ item }: any) => (
    <SwipeToDelete onDelete={() => handleDeleteConversation(item.id)}>
      <LongPressMenu
        actions={[
          {
            icon: 'archive-outline',
            label: 'Archive',
            onPress: () => handleArchiveConversation(item.id),
          },
          {
            icon: 'notifications-off-outline',
            label: 'Mute',
            onPress: () => handleMuteConversation(item.id),
          },
          {
            icon: 'trash-outline',
            label: 'Delete',
            onPress: () => handleDeleteConversation(item.id),
            color: '#FF6B6B',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.conversationCard}
          onPress={() => router.push(`/chat/${item.userId}`)}
          activeOpacity={0.7}
        >
      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>

      {/* Conversation Info */}
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.time}>{item.lastMessageTime}</Text>
        </View>

        {/* Product Preview */}
        <View style={styles.productPreview}>
          <Image
            source={{ uri: item.productImage }}
            style={styles.productThumbnail}
          />
          <Text style={styles.productTitle} numberOfLines={1}>
            {item.productTitle}
          </Text>
        </View>

        {/* Last Message */}
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
        </TouchableOpacity>
      </LongPressMenu>
    </SwipeToDelete>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="chatbubbles-outline" size={64} color="#B2BEC3" />
      </View>
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyText}>
        Start a conversation by messaging sellers about their products
      </Text>
      <AnimatedButton
        title="Browse Products"
        icon="storefront"
        onPress={() => router.push('/(tabs)')}
        size="large"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {conversations.length > 0 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#636E72" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
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
      )}

      {/* Conversations List */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <MessageCardSkeleton key={`skeleton-${index}`} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filteredConversations.length === 0 && styles.emptyContainer
          }
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
    marginVertical: 12,
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
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  time: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  productPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  productThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E5E5EA',
  },
  productTitle: {
    flex: 1,
    fontSize: 13,
    color: '#636E72',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  unreadMessage: {
    color: '#2D3436',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#4ECDC4',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
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
  skeletonContainer: {
    padding: 16,
    gap: 12,
  },
});