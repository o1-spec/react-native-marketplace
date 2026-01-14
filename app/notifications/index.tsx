import AnimatedButton from "@/components/AnimatedButton";
import NotificationCardSkeleton from "@/components/NotificationCardSkeleton";
import { notificationsAPI } from "@/lib/api"; // ✅ ADD API IMPORT
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type NotificationType =
  | "message"
  | "like"
  | "offer"
  | "purchase"
  | "follow"
  | "review"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  productImage?: string;
  actionId?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });

  const fetchNotifications = async (page = 1, refresh = false) => {
    try {
      if (!refresh) setIsLoading(true);
      setError(null);

      const response = await notificationsAPI.getNotifications({
        page,
        limit: 20,
        filter: filter === "unread" ? "unread" : undefined,
      });

      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }

      setPagination(response.pagination);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, [filter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages && !isLoading) {
      fetchNotifications(pagination.page + 1, false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return { name: "chatbubble", color: "#4ECDC4" };
      case "like":
        return { name: "heart", color: "#FF6B6B" };
      case "offer":
        return { name: "pricetag", color: "#FFB84D" };
      case "purchase":
        return { name: "checkmark-circle", color: "#55EFC4" };
      case "follow":
        return { name: "person-add", color: "#A29BFE" };
      case "review":
        return { name: "star", color: "#FFB84D" };
      case "system":
        return { name: "information-circle", color: "#636E72" };
      default:
        return { name: "notifications", color: "#636E72" };
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (selectionMode) {
      if (selectedNotifications.includes(notification.id)) {
        setSelectedNotifications(
          selectedNotifications.filter((id) => id !== notification.id)
        );
      } else {
        setSelectedNotifications([...selectedNotifications, notification.id]);
      }
    } else {
      if (!notification.read) {
        try {
          await notificationsAPI.markAsRead(notification.id);
          setNotifications(
            notifications.map((n) =>
              n.id === notification.id ? { ...n, read: true } : n
            )
          );
          Toast.show({
          type: 'success',
          text1: 'Marked as Read',
          text2: 'Notification has been marked as read',
          visibilityTime: 2000, 
        });
        } catch (err) {
          console.error("Mark read error:", err);
          Toast.show({ 
            type: 'error',
            text1: 'Error',
            text2: 'Failed to mark notification as read',
          });
        }
      }

      switch (notification.type) {
        case "message":
          router.push(`/chat/${notification.actionId}`);
          break;
        case "offer":
        case "like":
        case "purchase":
          router.push(`/product/${notification.actionId}`);
          break;
        case "follow":
        case "review":
          router.push(`/user/${notification.actionId}`);
          break;
        case "system":
          // Alert.alert(notification.title, notification.message);
          break;
      }
    }
  };

  const handleLongPress = (notification: Notification) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedNotifications([notification.id]);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'All notifications marked as read',
      });
    } catch (err) {
      console.error("Mark all read error:", err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to mark notifications as read',
      });
    }
  };

  const clearAll = async () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationsAPI.clearAll();
              setNotifications([]);
              Alert.alert("Success", "All notifications cleared");
            } catch (err) {
              console.error("Clear all error:", err);
              Alert.alert("Error", "Failed to clear notifications");
            }
          },
        },
      ]
    );
  };

  const deleteSelected = async () => {
    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${
        selectedNotifications.length
      } notification${selectedNotifications.length > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                selectedNotifications.map((id) =>
                  notificationsAPI.deleteNotification(id)
                )
              );

              setNotifications(
                notifications.filter(
                  (n) => !selectedNotifications.includes(n.id)
                )
              );
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Selected notifications deleted',
              });
              setSelectedNotifications([]);
              setSelectionMode(false);
            } catch (err) {
              console.error("Delete error:", err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete some notifications',
              });
            }
          },
        },
      ]
    );
  };

  const selectAll = () => {
    const allIds = filteredNotifications.map((n) => n.id);
    setSelectedNotifications(allIds);
  };

  const deselectAll = () => {
    setSelectedNotifications([]);
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedNotifications([]);
  };

  const filteredNotifications = notifications; 

  const renderNotification = (notification: Notification) => {
    const icon = getNotificationIcon(notification.type);
    const isSelected = selectedNotifications.includes(notification.id);

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard,
          selectionMode && isSelected && styles.selectedCard,
        ]}
        onPress={() => handleNotificationPress(notification)}
        onLongPress={() => handleLongPress(notification)}
        activeOpacity={0.7}
      >
        {/* Selection Checkbox */}
        {selectionMode && (
          <View style={styles.checkboxContainer}>
            <View
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </View>
        )}

        {/* Left Side - Avatar/Icon */}
        <View style={styles.notificationLeft}>
          {notification.avatar ? (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: notification.avatar }}
                style={styles.avatar}
              />
              <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
                <Ionicons name={icon.name as any} size={12} color="#fff" />
              </View>
            </View>
          ) : notification.productImage ? (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: notification.productImage }}
                style={styles.productThumb}
              />
              <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
                <Ionicons name={icon.name as any} size={12} color="#fff" />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: icon.color + "20" },
              ]}
            >
              <Ionicons name={icon.name as any} size={24} color={icon.color} />
            </View>
          )}
        </View>

        {/* Center - Content */}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>

        {/* Right - Indicator */}
        {!notification.read && !selectionMode && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (selectionMode ? cancelSelection() : router.back())}
        >
          <Ionicons
            name={selectionMode ? "close" : "arrow-back"}
            size={24}
            color="#2D3436"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {selectionMode
              ? `${selectedNotifications.length} Selected`
              : "Notifications"}
          </Text>
          {!selectionMode && unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {selectionMode ? (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={
              selectedNotifications.length === filteredNotifications.length
                ? deselectAll
                : selectAll
            }
          >
            <Text style={styles.selectAllText}>
              {selectedNotifications.length === filteredNotifications.length
                ? "Deselect"
                : "Select All"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.moreButton} onPress={clearAll}>
            <Ionicons name="trash-outline" size={24} color="#2D3436" />
          </TouchableOpacity>
        )}
      </View>

      {/* Selection Mode Actions */}
      {selectionMode && selectedNotifications.length > 0 && (
        <View style={styles.selectionActions}>
          <AnimatedButton
            title={`Delete ${selectedNotifications.length}`}
            icon="trash"
            variant="danger"
            onPress={deleteSelected}
            fullWidth
          />
        </View>
      )}

      {/* Filter Tabs */}
      {!selectionMode && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === "all" && styles.activeFilterTab,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.activeFilterText,
              ]}
            >
              All ({pagination.total})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === "unread" && styles.activeFilterTab,
            ]}
            onPress={() => setFilter("unread")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "unread" && styles.activeFilterText,
              ]}
            >
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mark All as Read Button */}
      {!selectionMode && unreadCount > 0 && (
        <View style={styles.markAllButtonContainer}>
          <AnimatedButton
            title="Mark all as read"
            icon="checkmark-done"
            variant="ghost"
            onPress={markAllAsRead}
            fullWidth
          />
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchNotifications(1, false)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 8 }).map((_, index) => (
            <NotificationCardSkeleton key={`skeleton-${index}`} />
          ))}
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredNotifications.length === 0 && styles.emptyContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#4ECDC4"]}
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const isCloseToBottom =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 50;
            if (isCloseToBottom) handleLoadMore();
          }}
        >
          {filteredNotifications.length > 0
            ? filteredNotifications.map(renderNotification)
            : !error && (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons
                      name="notifications-outline"
                      size={64}
                      color="#B2BEC3"
                    />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {filter === "all"
                      ? "No Notifications"
                      : "No Unread Notifications"}
                  </Text>
                  <Text style={styles.emptyText}>
                    {filter === "all"
                      ? "You're all caught up! Check back later for updates."
                      : "All your notifications have been read."}
                  </Text>
                </View>
              )}

          {/* Loading indicator for pagination */}
          {isLoading && notifications.length > 0 && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#4ECDC4" />
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  headerBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4ECDC4",
  },
  selectionActions: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  activeFilterTab: {
    backgroundColor: "#2D3436",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636E72",
  },
  activeFilterText: {
    color: "#fff",
  },
  markAllButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  content: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  unreadCard: {
    backgroundColor: "#F8FEFF",
    borderLeftWidth: 3,
    borderLeftColor: "#4ECDC4",
  },
  selectedCard: {
    backgroundColor: "#E5F9F8",
    borderLeftWidth: 3,
    borderLeftColor: "#4ECDC4",
  },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4ECDC4",
    borderColor: "#4ECDC4",
  },
  notificationLeft: {
    position: "relative",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
  },
  productThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: "#B2BEC3",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ECDC4",
    marginTop: 4,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
  skeletonContainer: {
    padding: 16,
    gap: 12,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 12,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4ECDC4",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingMore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#636E72",
  },
});
