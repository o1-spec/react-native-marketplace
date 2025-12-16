const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000"
    : "https://your-production-api.com",
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
    COMPLETE_PROFILE: '/api/auth/complete-profile',
  },

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

  // Other endpoints...
} as const;

export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getHeaders = (includeAuth: boolean = false, token?: string) => {
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
  const url = buildUrl(endpoint);

  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
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
     completeProfile: (data: {
    phoneNumber?: string;
    location?: string;
    bio?: string;
    avatar?: string;
  }) =>
    apiRequest(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const productsAPI = {
  getAll: (params?: Record<string, any>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}${queryString}`);
  },

  create: (data: FormData) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.CREATE, {
      method: "POST",
      body: data,
      headers: {},
    }),

  getById: (id: string) => apiRequest(API_ENDPOINTS.PRODUCTS.DETAIL(id)),

  update: (id: string, data: any) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(API_ENDPOINTS.PRODUCTS.DELETE(id), {
      method: "DELETE",
    }),
};
