import { useAuth } from "@/contexts/AuthContext";
import { conversationsAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import io, { Socket } from "socket.io-client";

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  productId: string;
  productTitle: string;
  productImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface MessageEvent {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  conversationId: string;
}

interface ReadReceiptEvent {
  conversationId: string;
  userId: string;
}

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

const loadConversations = async () => {
  console.log("Loading conversations, token:", !!token); 

  try {
    const response = await conversationsAPI.getConversations();
    console.log("Conversations loaded:", response.conversations?.length); // Debug log
    setConversations(response.conversations || []);
  } catch (error: any) {
    console.error("Error loading conversations:", error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error.message || 'Failed to load conversations',
    });
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    loadConversations();
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io("https://marketplace-backend-blush.vercel.app", {
      auth: { token },
    });

    setSocket(newSocket);

    // Listen for new messages
    newSocket.on("message", (message: MessageEvent) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.text,
                lastMessageTime: message.timestamp,
                unreadCount:
                  message.senderId !== user._id
                    ? conv.unreadCount + 1
                    : conv.unreadCount,
              }
            : conv
        )
      );
    });

    // Listen for read receipts
    newSocket.on("messagesRead", (data: ReadReceiptEvent) => {
      if (data.userId === user._id) {
        // User read messages in another conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === data.conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    });

    newSocket.on("userStatus", (data: UserStatusEvent) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === data.userId
            ? { ...conv, isOnline: data.isOnline }
            : conv
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.userAvatar || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.userName}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>

        <Text style={styles.productTitle} numberOfLines={1}>
          {item.productTitle}
        </Text>

        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "No messages yet"}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#B2BEC3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-outline" size={64} color="#E5E5EA" />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        Start chatting with sellers about their products
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {/* <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#2D3436" />
        </TouchableOpacity> */}
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
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#B2BEC3" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3436",
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    fontSize: 16,
    color: "#636E72",
  },
  listContainer: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4ECDC4",
    borderWidth: 3,
    borderColor: "#fff",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "#B2BEC3",
    marginLeft: 8,
  },
  productTitle: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 14,
    color: "#636E72",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#4ECDC4",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  moreButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#B2BEC3",
    textAlign: "center",
    lineHeight: 22,
  },
});
