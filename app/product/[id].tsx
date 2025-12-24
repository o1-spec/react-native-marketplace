import AnimatedButton from "@/components/AnimatedButton";
import { FadeInView, SlideInView } from "@/components/AnimatedViews";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { productsAPI, reviewsAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const sellerId = product?.sellerId?._id;
      if (sellerId) {
        const response = await reviewsAPI.getReviews(sellerId);
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };
  const fetchProduct = async () => {
    try {
      setProductError(null);
      setIsLoading(true);
      const response = await productsAPI.getProductById(id as string);
      setProduct(response.product);
    } catch (error: any) {
      console.error("Fetch product error:", error);
      setProductError("Failed to load product. Please try again.");
      Alert.alert("Error", "Failed to load product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimilarProducts = async (category: string) => {
    try {
      const response = await productsAPI.getProductsByCategory(
        category,
        id as string
      );
      setSimilarProducts(response.products.slice(0, 6));
    } catch (error) {
      console.error("Fetch similar products error:", error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        const favoritesArray = JSON.parse(favorites);
        setIsFavorite(favoritesArray.includes(id));
      }
    } catch (error) {
      console.error("Check favorite error:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoritesArray = favoritesArray.filter((favId: string) => favId !== id);
      } else {
        favoritesArray.push(id);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Toggle favorite error:", error);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkFavoriteStatus();
    }
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      fetchSimilarProducts(product.category);
    }
  }, [product?.category]);

  useEffect(() => {
    if (product?.sellerId) {
      fetchReviews();
    }
  }, [product?.sellerId]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert("Error", "Please write a review comment");
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewsAPI.createReview({
        productId: id as string,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      fetchReviews();
      Toast.show({
        type: "success",
        text1: "Review submitted!",
        text2: "Thank you for your feedback",
      });
    } catch (error: any) {
      console.error("Submit review error:", error);
      Alert.alert("Error", error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.title} for ₦${product?.price}`,
        url: `myapp://product/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessage = () => {
    router.push(`/chat/${product?.seller?.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
        </View>
        <ProductDetailSkeleton />
      </View>
    );
  }

  if (productError || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color="#B2BEC3" />
        <Text style={styles.errorText}>
          {productError || "Product not found"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProduct}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#2D3436" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF6B6B" : "#2D3436"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <FadeInView duration={300}>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {product.images?.map((image: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.productImage}
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {product.images?.map((_: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>

            {/* Condition Badge */}
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          </View>
        </FadeInView>

        {/* Product Info */}
        <SlideInView direction="up" delay={150}>
          <View style={styles.infoContainer}>
            <Text style={styles.price}>₦{product.price.toLocaleString()}</Text>
            <Text style={styles.title}>{product.title}</Text>

            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color="#636E72" />
                <Text style={styles.metaText}>
                  {product.location?.city}, {product.location?.state}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#636E72" />
                <Text style={styles.metaText}>
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            {/* Category Tag */}
            <View style={styles.categoryTag}>
              <Ionicons name="pricetag-outline" size={14} color="#4ECDC4" />
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>
        </SlideInView>

        <SlideInView direction="up" delay={250}>
          <TouchableOpacity
            style={styles.sellerContainer}
            onPress={() => router.push(`/user/${product?.sellerId?._id}`)}
          >
            <View style={styles.sellerLeft}>
              <Image
                source={{
                  uri:
                    product?.sellerId?.avatar ||
                    "https://i.pravatar.cc/300?img=47",
                }}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>
                    {product?.sellerId?.name}
                  </Text>
                  {product?.sellerId?.emailVerified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4ECDC4"
                    />
                  )}
                </View>
                <View style={styles.sellerMeta}>
                  <Ionicons name="star" size={14} color="#FFB84D" />
                  <Text style={styles.ratingText}>
                    {product?.sellerId?.rating || 0} (
                    {product?.sellerId?.totalReviews || 0})
                  </Text>
                </View>
                <Text style={styles.responseTime}>
                  Responds in {product?.sellerId?.responseTime || "~1 hour"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#B2BEC3" />
          </TouchableOpacity>
        </SlideInView>

        {/* Description */}
        <SlideInView direction="up" delay={350}>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </SlideInView>

        {/* Similar Products Placeholder */}
        <SlideInView direction="up" delay={450}>
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Similar Products</Text>
            {similarProducts.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarProductsContainer}
              >
                {similarProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.similarProductCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image
                      source={{
                        uri:
                          item.images[0] || "https://i.pravatar.cc/300?img=47",
                      }}
                      style={styles.similarProductImage}
                    />
                    <View style={styles.similarProductInfo}>
                      <Text
                        style={styles.similarProductTitle}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.similarProductPrice}>
                        ₦{item.price.toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.placeholderText}>
                No similar products found
              </Text>
            )}
          </View>
        </SlideInView>
        <SlideInView direction="up" delay={500}>
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>
                Reviews ({reviews.length})
              </Text>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(true)}
              >
                <Ionicons name="add-circle" size={20} color="#2D3436" />
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            </View>

            {/* Average Rating */}
            {reviews.length > 0 && (
              <View style={styles.averageRating}>
                <Text style={styles.averageRatingText}>
                  ⭐{" "}
                  {product.averageRating ||
                    (
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  ({reviews.length} reviews)
                </Text>
              </View>
            )}
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{
                        uri:
                          review.reviewer.avatar ||
                          "https://i.pravatar.cc/300?img=47",
                      }}
                      style={styles.reviewerAvatar}
                    />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewerName}>
                        {review.reviewer.name}
                      </Text>
                      <View style={styles.ratingContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? "star" : "star-outline"}
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>
                No reviews yet. Be the first to review!
              </Text>
            )}
          </View>
        </SlideInView>
        {showReviewForm && (
          <View style={styles.reviewModalOverlay}>
            <View style={styles.reviewModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Write a Review</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowReviewForm(false)}
                >
                  <Ionicons name="close" size={24} color="#2D3436" />
                </TouchableOpacity>
              </View>

              <View style={styles.ratingInput}>
                <Text style={styles.ratingLabel}>Rating:</Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setReviewRating(i + 1)}
                      disabled={submittingReview}
                    >
                      <Ionicons
                        name={i < reviewRating ? "star" : "star-outline"}
                        size={30}
                        color="#FFD700"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Write your review..."
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={4}
                editable={!submittingReview}
              />

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    submittingReview && styles.disabledButton,
                  ]}
                  onPress={() => setShowReviewForm(false)}
                  disabled={submittingReview}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    submittingReview && styles.disabledButton,
                  ]}
                  onPress={handleSubmitReview}
                  disabled={submittingReview}
                >
                  <Text style={styles.submitButtonText}>
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
        <View style={styles.messageButtonWrapper}>
          <AnimatedButton
            title="Message Seller"
            icon="chatbubble-outline"
            onPress={handleMessage}
            size="large"
            style={styles.messageButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 400,
    backgroundColor: "#F5F5F5",
  },
  productImage: {
    width,
    height: 400,
    resizeMode: "cover",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    width: 24,
    backgroundColor: "#fff",
  },
  conditionBadge: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  conditionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
    lineHeight: 28,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#636E72",
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E5F9F8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#4ECDC4",
    fontWeight: "600",
  },
  sellerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
  },
  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 13,
    color: "#636E72",
    fontWeight: "500",
  },
  responseTime: {
    fontSize: 12,
    color: "#B2BEC3",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#636E72",
    lineHeight: 24,
  },
  similarSection: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: "#B2BEC3",
    fontStyle: "italic",
  },
  bottomSpacing: {
    height: 100,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 12,
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  messageButtonWrapper: {
    flex: 1,
  },
  messageButton: {
    height: 56,
    borderRadius: 28,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  similarProductsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  similarProductCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  similarProductImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#F5F5F5",
  },
  similarProductInfo: {
    padding: 12,
  },
  similarProductTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 6,
    lineHeight: 18,
  },
  similarProductPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
  },
  // ✅ ADD REVIEW STYLES
  reviewsSection: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 20,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addReviewText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  averageRating: {
    marginBottom: 16,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  reviewCard: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#B2BEC3",
  },
  noReviewsText: {
    fontSize: 14,
    color: "#B2BEC3",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  reviewModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  reviewModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  closeButton: {
    padding: 4,
  },
  ratingInput: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2D3436",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#636E72",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
