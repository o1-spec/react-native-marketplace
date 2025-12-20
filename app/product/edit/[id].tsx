import AnimatedButton from "@/components/AnimatedButton";
import { productsAPI } from "@/lib/api"; // ✅ ADD API IMPORT
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const categories = [
  { id: "1", name: "Electronics", icon: "laptop-outline" },
  { id: "2", name: "Fashion", icon: "shirt-outline" },
  { id: "3", name: "Home", icon: "home-outline" },
  { id: "4", name: "Sports", icon: "basketball-outline" },
  { id: "5", name: "Books", icon: "book-outline" },
  { id: "6", name: "Toys", icon: "game-controller-outline" },
  { id: "7", name: "Vehicles", icon: "car-outline" },
  { id: "8", name: "Other", icon: "ellipsis-horizontal-outline" },
];

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

interface ListingData {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("Good");
  const [location, setLocation] = useState("");
  const [originalData, setOriginalData] = useState<ListingData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const uploadImageToCloudinary = async (uri: string): Promise<string> => {
    const formData = new FormData();

    const fileExtension = uri.split(".").pop() || "jpg";
    const fileName = `listing_${Date.now()}.${fileExtension}`;

    formData.append("file", {
      uri,
      type: `image/${fileExtension}`,
      name: fileName,
    } as any);

    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/upload?folder=listings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const uploadImages = async (uris: string[]): Promise<string[]> => {
    try {
      const uploadPromises = uris.map((uri) => uploadImageToCloudinary(uri));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload images");
    }
  };

  useEffect(() => {
    loadListingData();
  }, [id]);

  const loadListingData = async () => {
  try {
    setLoadError(null);
    setIsLoading(true);

    const response = await productsAPI.getProductById(id as string);
    const productData = response.product; 

    const conditionDisplayMap: { [key: string]: string } = {
      "new": "New",
      "like_new": "Like New",
      "good": "Good",
      "fair": "Fair",
      "poor": "Poor",
    };

    setTitle(productData.title || "");
    setDescription(productData.description || "");
    setPrice(productData.price ? productData.price.toString() : "");
    setCategory(productData.category || "");
    setCondition(conditionDisplayMap[productData.condition] || "Good");
    setLocation(
      productData.location?.city && productData.location?.state
        ? `${productData.location.city}, ${productData.location.state}`
        : ""
    );
    setImages(productData.images || []);
    setOriginalData(productData);
  } catch (error: any) {
    console.error("Load listing error:", error);
    setLoadError("Failed to load listing data. Please try again.");
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to load listing data. Please try again.",
    });
    router.back();
  } finally {
    setIsLoading(false);
  }
};

  const pickImages = async () => {
    if (images.length >= 5) {
      Toast.show({
        type: "error",
        text1: "Maximum Images",
        text2: "You can only upload up to 5 images",
      });
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission needed",
        text2: "Please allow access to your photos",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) {
      Toast.show({
        type: "error",
        text1: "Maximum Images",
        text2: "You can only upload up to 5 images",
      });
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission needed",
        text2: "Please allow access to your camera",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setImages(images.filter((_, i) => i !== index)),
      },
    ]);
  };

  const handleImageOptions = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImages },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const hasChanges = () => {
    if (!originalData) return false;

    return (
      title !== originalData.title ||
      description !== originalData.description ||
      price !== originalData.price.toString() ||
      category !== originalData.category ||
      condition !== originalData.condition ||
      location !== `${originalData.location}` ||
      JSON.stringify(images) !== JSON.stringify(originalData.images)
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Title",
        text2: "Please enter a title for your listing",
      });
      return;
    }
    if (!price.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Price",
        text2: "Please enter a price",
      });
      return;
    }
    if (images.length === 0) {
      Toast.show({
        type: "error",
        text1: "Missing Images",
        text2: "Please add at least one photo",
      });
      return;
    }
    if (!category) {
      Toast.show({
        type: "error",
        text1: "Missing Category",
        text2: "Please select a category",
      });
      return;
    }

    if (!hasChanges()) {
      Toast.show({
        type: "info",
        text1: "No Changes",
        text2: "No changes were made to save",
      });
      return;
    }

    setIsSaving(true);
    try {
      const existingImages = images.filter((img) => img.startsWith("http"));
      const newImageUris = images.filter((img) => !img.startsWith("http"));

      let allImageUrls = existingImages;
      if (newImageUris.length > 0) {
        const uploadedUrls = await uploadImages(newImageUris);
        allImageUrls = [...existingImages, ...uploadedUrls];
      }

      const [city, state] = location.split(",").map((s) => s.trim());
      if (!city || !state) {
        Toast.show({
          type: "error",
          text1: "Invalid Location",
          text2: "Please enter a valid location (City, State)",
        });
        return;
      }

      const conditionMap: { [key: string]: string } = {
        New: "new",
        "Like New": "like_new",
        Good: "good",
        Fair: "fair",
        Poor: "poor",
      };

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        condition: conditionMap[condition] || "good",
        images: allImageUrls,
        location: {
          city,
          state,
          country: "USA",
        },
      };

      await productsAPI.updateProduct(id as string, updateData);

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Your listing has been updated",
      });
      Alert.alert("Success!", "Your listing has been updated", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Save listing error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to update listing. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await productsAPI.deleteProduct(id as string);
              Toast.show({
                type: "success",
                text1: "Deleted",
                text2: "Your listing has been deleted",
              });
              router.push("/(tabs)");
            } catch (error: any) {
              console.error("Delete listing error:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error.message ||
                  "Failed to delete listing. Please try again.",
              });
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <Ionicons name="refresh" size={32} color="#4ECDC4" />
        </View>
        <Text style={styles.loadingText}>Loading listing...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={48} color="#B2BEC3" />
        <Text style={styles.errorText}>{loadError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadListingData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
        <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
          <Ionicons
            name={isDeleting ? "refresh" : "trash-outline"}
            size={24}
            color={isDeleting ? "#B2BEC3" : "#FF6B6B"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Photos <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Add up to 5 photos (first photo will be the cover)
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {/* Add Photo Button */}
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleImageOptions}
            >
              <Ionicons name="camera" size={32} color="#B2BEC3" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {/* Image Previews */}
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri }} style={styles.previewImage} />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverText}>Cover</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="What are you selling?"
            placeholderTextColor="#B2BEC3"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{title.length}/100</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your item (condition, features, etc.)"
            placeholderTextColor="#B2BEC3"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Price <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0.00"
              placeholderTextColor="#B2BEC3"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  category === cat.name && styles.categoryCardActive,
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={24}
                  color={category === cat.name ? "#4ECDC4" : "#636E72"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.name && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.conditionsContainer}
          >
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.conditionChip,
                  condition === cond && styles.conditionChipActive,
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    condition === cond && styles.conditionTextActive,
                  ]}
                >
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#636E72" />
            <TextInput
              style={styles.locationInput}
              placeholder="City, State"
              placeholderTextColor="#B2BEC3"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity>
              <Ionicons name="navigate" size={20} color="#4ECDC4" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <AnimatedButton
            title="Save Changes"
            icon="checkmark-circle"
            onPress={handleSave}
            loading={isSaving}
            disabled={
              isSaving ||
              !title.trim() ||
              !price.trim() ||
              images.length === 0 ||
              !category ||
              !hasChanges()
            }
            fullWidth
            size="large"
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingSpinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E5F9F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#636E72",
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
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  required: {
    color: "#FF6B6B",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#636E72",
    marginBottom: 16,
  },
  imagesContainer: {
    gap: 12,
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  addPhotoText: {
    fontSize: 13,
    color: "#B2BEC3",
    marginTop: 8,
    fontWeight: "600",
  },
  imagePreview: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  coverBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(78, 205, 196, 0.9)",
    paddingVertical: 4,
    alignItems: "center",
  },
  coverText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#2D3436",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#B2BEC3",
    textAlign: "right",
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryCardActive: {
    backgroundColor: "#E5F9F8",
    borderColor: "#4ECDC4",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#636E72",
  },
  categoryTextActive: {
    color: "#4ECDC4",
  },
  conditionsContainer: {
    gap: 8,
  },
  conditionChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  conditionChipActive: {
    backgroundColor: "#E5F9F8",
    borderColor: "#4ECDC4",
  },
  conditionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636E72",
  },
  conditionTextActive: {
    color: "#4ECDC4",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 15,
    color: "#2D3436",
  },
  bottomSpacing: {
    height: 40,
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
});
