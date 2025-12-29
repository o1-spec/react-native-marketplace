// app/chat/[id].tsx
import AnimatedButton from "@/components/AnimatedButton";
import { useAuth } from "@/contexts/AuthContext";
import { conversationsAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import io, { Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
}

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ProductInfo {
  id: string;
  title: string;
  image: string;
  price: number;
}

interface MessageEvent {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  conversationId: string;
}

interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

interface ErrorEvent {
  message: string;
}

interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
}

interface ReadReceiptEvent {
  conversationId: string;
  userId: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  useEffect(() => {
    const loadConversationData = async () => {
      if (!token || !id) {
        return;
      }

      try {
        const messagesData = await conversationsAPI.getMessages(id);
        setMessages(messagesData.messages);

        const convData = await conversationsAPI.getConversation(id);
        setUserInfo({
          id: convData.conversation.user._id,
          name: convData.conversation.user.name,
          avatar: convData.conversation.user.avatar,
          isOnline: false,
        });

        if (convData.conversation.product && convData.conversation.product.id) {
          const productData = {
            id: convData.conversation.product.id,
            title: convData.conversation.product.title || "Product",
            image: convData.conversation.product.image || "",
            price: convData.conversation.product.price || 0,
          };
          setProductInfo(productData);
        } else {
          setProductInfo(null);
        }
      } catch (error: any) {
        console.error("❌ Failed to load conversation:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to load conversation",
        });
      }
    };

    loadConversationData();
  }, [id, token]);

  useEffect(() => {
    const markAsRead = async () => {
      if (token && id && messages.length > 0) {
        try {
          await conversationsAPI.markAsRead(id);
        } catch (error) {
          console.error("Failed to mark as read:", error);
        }
      }
    };

    markAsRead();
  }, [id, token, messages.length]);

  useEffect(() => {
    if (!token) return;

    const newSocket = io("https://marketplace-backend-blush.vercel.app", {
      auth: { token: token },
    });

    setSocket(newSocket);

    newSocket.emit("joinConversation", id);

    newSocket.on("message", (message: MessageEvent) => {
      if (message.conversationId === id) {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    newSocket.on("userTyping", (data: TypingEvent) => {
      console.log("User typing:", data);
    });

    newSocket.on("messagesRead", (data: ReadReceiptEvent) => {
      if (data.conversationId === id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            isRead: msg.senderId === user?._id ? true : msg.isRead,
          }))
        );
      }
    });

    newSocket.on("userStatus", (data: UserStatusEvent) => {
      if (data.userId === userInfo?.id) {
        setUserInfo((prev) =>
          prev ? { ...prev, isOnline: data.isOnline } : null
        );
      }
    });

    newSocket.on("connect_error", (error: ErrorEvent) => {
      console.error("Socket connection error:", error);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Failed to connect to chat server",
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id, token, user?._id]);

  const handlePayment = async (method: string) => {
    setProcessingPayment(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Toast.show({
        type: "success",
        text1: "Payment Successful!",
        text2: `Paid ₦${productInfo?.price?.toLocaleString()} via ${method}`,
      });

      setShowPaymentModal(false);

      // Optionally navigate back or update order status
      // router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Please try again",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !socket || !user) return;

    setIsSending(true);
    try {
      const messageData = {
        conversationId: id,
        content: inputText.trim(),
      };

      socket.emit("sendMessage", messageData);

      const optimisticMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        senderId: user._id,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        isRead: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setInputText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send message",
      });
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (!user) return null;

    const isMe = item.senderId === user._id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!isMe && userInfo?.avatar && (
          <Image
            source={{ uri: userInfo.avatar }}
            style={styles.messageAvatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timestamp,
                isMe ? styles.myTimestamp : styles.theirTimestamp,
              ]}
            >
              {item.timestamp}
            </Text>
            {isMe && (
              <Ionicons
                name={item.isRead ? "checkmark-done" : "checkmark"}
                size={14}
                color={item.isRead ? "#4ECDC4" : "#B2BEC3"}
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push(`/user/${userInfo?.id}`)}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: userInfo?.avatar || "https://i.pravatar.cc/150",
                }}
                style={styles.avatar}
              />
              {userInfo?.isOnline && <View style={styles.onlineBadge} />}
            </View>
            <View>
              <Text style={styles.userName}>
                {userInfo?.name || "Loading..."}
              </Text>
              <Text style={styles.status}>
                {userInfo?.isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={24} color="#2D3436" />
          </TouchableOpacity>
        </View>

        {productInfo && productInfo.id && (
          <View style={styles.productCard}>
            <TouchableOpacity
              style={styles.productLink}
              onPress={() => router.push(`/product/${productInfo.id}`)}
            >
              <Image
                source={{ uri: productInfo.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {productInfo.title}
                </Text>
                <Text style={styles.productPrice}>
                  ₦{productInfo.price?.toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.payButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color="#636E72" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#B2BEC3"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <View style={styles.sendButtonWrapper}>
            <AnimatedButton
              icon="send"
              onPress={handleSend}
              loading={isSending}
              disabled={!inputText.trim() || isSending}
              size="small"
              style={styles.sendButton}
              title=""
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <Text style={styles.modalTitle}>Complete Payment</Text>
            <Text style={styles.modalSubtitle}>
              Pay ₦{productInfo?.price?.toLocaleString()} for "
              {productInfo?.title}"
            </Text>

            {/* Dummy Payment Options */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePayment("card")}
              disabled={processingPayment}
            >
              <Ionicons name="card-outline" size={24} color="#4ECDC4" />
              <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
              <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePayment("bank")}
              disabled={processingPayment}
            >
              <Ionicons name="business-outline" size={24} color="#4ECDC4" />
              <Text style={styles.paymentOptionText}>Bank Transfer</Text>
              <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePayment("wallet")}
              disabled={processingPayment}
            >
              <Ionicons name="wallet-outline" size={24} color="#4ECDC4" />
              <Text style={styles.paymentOptionText}>Digital Wallet</Text>
              <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4ECDC4",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
  },
  status: {
    fontSize: 12,
    color: "#636E72",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4ECDC4",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  theirMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: "#2D3436",
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: "#fff",
  },
  theirMessageText: {
    color: "#2D3436",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  myTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  theirTimestamp: {
    color: "#B2BEC3",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 12,
  },
  attachButton: {
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2D3436",
    maxHeight: 100,
  },
  sendButtonWrapper: {
    marginBottom: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  payButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paymentModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: "90%",
    maxWidth: 400,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
  },
  productLink: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 20,
  },
  modalButtons: {
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F1F2F6",
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#636E72",
  },
});
