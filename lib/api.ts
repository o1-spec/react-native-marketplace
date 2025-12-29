import AsyncStorage from "@react-native-async-storage/async-storage";

const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000"
    : "https://marketplace-backend-blush.vercel.app/",
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
    RESEND_VERIFICATION: "/api/auth/resend-verification",
    COMPLETE_PROFILE: "/api/auth/complete-profile",
  },

  NOTIFICATIONS: "/api/notifications",
  NOTIFICATIONS_MARK_ALL_READ: "/api/notifications/mark-all-read",
  NOTIFICATIONS_CLEAR_ALL: "/api/notifications/clear-all",
  // Users
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
    UPLOAD_AVATAR: "/api/users/avatar",
  },

  // Products
  PRODUCTS: {
    LIST: "/api/products",
    CREATE: "/api/products",
    DETAIL: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    SEARCH: "/api/products/search",
    CATEGORIES: "/api/products/categories",
  },
  PRODUCTS_MY_LISTINGS: "/api/products/my-listings",
  CONVERSATIONS: {
    LIST: "/api/conversations",
    DETAIL: (id: string) => `/api/conversations/${id}`,
    MESSAGES: (id: string) => `/api/conversations/${id}/messages`,
    CREATE: "/api/conversations",
    MARK_READ: (id: string) => `/api/conversations/${id}/read`,
  },
} as const;

export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getHeaders = (
  includeAuth: boolean = false,
  token?: string | null
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await AsyncStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const url = buildUrl(endpoint);

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
    throw new Error("Network error");
  }
};

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
    }),

  refreshToken: (token: string) =>
    apiRequest(API_ENDPOINTS.AUTH.REFRESH, {
      method: "POST",
      headers: getHeaders(true, token),
    }),

  forgotPassword: (data: { email: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  verifyEmail: (data: { email: string; code: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resendVerification: (data: { email: string }) =>
    apiRequest(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  completeProfile: async (data: {
    phoneNumber?: string;
    location?: string;
    bio?: string;
    avatar?: string;
  }) => {
    const token = await AsyncStorage.getItem("token");
    return apiRequest(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: getHeaders(true, token),
    });
  },
};

export const notificationsAPI = {
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    filter?: "all" | "unread";
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.filter) query.append("filter", params.filter);

    return apiRequest(`${API_ENDPOINTS.NOTIFICATIONS}?${query}`);
  },

  createNotification: (data: {
    type: string;
    title: string;
    message: string;
    recipientId: string;
    avatar?: string;
    productImage?: string;
    actionId?: string;
    relatedUserId?: string;
    relatedProductId?: string;
  }) =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markAllAsRead: () =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ, {
      method: "PUT",
    }),

  clearAll: () =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS_CLEAR_ALL, {
      method: "DELETE",
    }),
  markAsRead: (id: string) =>
    apiRequest(`API_ENDPOINTS.NOTIFICATIONS/${id}/read`, {
      method: "PUT",
    }),

  deleteNotification: (id: string) =>
    apiRequest(`API_ENDPOINTS.NOTIFICATIONS/${id}`, {
      method: "DELETE",
    }),
  getUnreadCount: () => apiRequest("/api/notifications/unread-count"),
};

export const productsAPI = {
  getProducts: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}`);
  },

  getProduct: (id: string) => apiRequest(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  createProduct: (data: any) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProductById: (id: string) => apiRequest(`/api/products/${id}`),

  updateProduct: (id: string, data: any) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.DELETE(id), {
      method: "DELETE",
    }),

  getMyListings: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`${API_ENDPOINTS.PRODUCTS_MY_LISTINGS}?${queryString}`);
  },
  getListingsByUser: (userId: string) =>
    apiRequest(`/api/products?userId=${userId}`),
  getProductsByCategory: (category: string, excludeId?: string) =>
    apiRequest(
      `/api/products?category=${encodeURIComponent(category)}${
        excludeId ? `&excludeId=${excludeId}` : ""
      }`
    ),
};

export const userAPI = {
  getProfile: () => apiRequest("/api/users/profile"),
  getUserProfile: (id: string) => apiRequest(`/api/users/${id}`),
  updateProfile: (data: any) =>
    apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// lib/api.ts
export const reviewsAPI = {
  getReviews: (sellerId: string) => apiRequest(`/api/reviews?sellerId=${sellerId}`),
  
  getReviewsByUser: (userId: string) => apiRequest(`/api/reviews?userId=${userId}`),
  
  getProductReviews: (productId: string) => apiRequest(`/api/reviews?productId=${productId}`),
  
  createReview: (reviewData: {
    sellerId: string; 
    rating: number;
    comment: string;
    orderId?: string;
  }) =>
    apiRequest("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  
  createProductReview: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
    orderId?: string;
  }) =>
    apiRequest("/api/product-reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  
  deleteReview: (reviewId: string) =>
    apiRequest(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

export const favoritesAPI = {
  getFavorites: () => apiRequest("/api/favorites"),
  addFavorite: (productId: string) =>
    apiRequest("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  removeFavorite: (productId: string) =>
    apiRequest(`/api/favorites?productId=${productId}`, {
      method: "DELETE",
    }),
};

export const contactAPI = {
  submitContact: (subject: string, message: string) =>
    apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    }),
};

export const conversationsAPI = {
  getConversations: () => apiRequest(API_ENDPOINTS.CONVERSATIONS.LIST),
  
  getConversation: (id: string) => 
    apiRequest(API_ENDPOINTS.CONVERSATIONS.DETAIL(id)),
  
  getMessages: (id: string) => 
    apiRequest(API_ENDPOINTS.CONVERSATIONS.MESSAGES(id)),
  
  createConversation: (data: { productId: string; sellerId: string }) =>
    apiRequest(API_ENDPOINTS.CONVERSATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  markAsRead: (conversationId: string) =>
    apiRequest(API_ENDPOINTS.CONVERSATIONS.MARK_READ(conversationId), {
      method: 'POST',
    }),
};

export const messagesAPI = {
  sendMessage: (data: { conversationId: string; content: string }) =>
    apiRequest(`/api/conversations/${data.conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: data.content }),
    }),
};