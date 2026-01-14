import { authAPI, userAPI } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  avatar?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  checkAuthState: () => Promise<void>;
  reloadAuth: () => Promise<void>; // ✅ ADD THIS
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  const isAuthenticated = !!token && !!user;
  const isVerified = user?.emailVerified ? true : false;

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authAPI.login({ email, password });
      await AsyncStorage.setItem("token", data.token);
      const profileData = await userAPI.getProfile();
      const fullUser = profileData.user;
      await AsyncStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
      setToken(data.token);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    hasCheckedAuth.current = false;
    router.replace("/(auth)/login");
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const checkAuthState = async () => {
    if (hasCheckedAuth.current) {
      // console.log("⏭️ Auth already checked, skipping");
      return;
    }
    hasCheckedAuth.current = true;

    // console.log("🔐 Checking auth state...");

    try {
      const storedToken = await AsyncStorage.getItem("token");
      // console.log("💾 Stored token found:", !!storedToken);

      if (storedToken) {
        // console.log("🔑 Token preview:", storedToken.substring(0, 30) + "...");
        setToken(storedToken);

        await new Promise(resolve => setTimeout(resolve, 100));

        // console.log("📞 Fetching user profile...");
        const profileData = await userAPI.getProfile();
        const currentUser = profileData.user;

        // console.log("👤 User profile:", currentUser?.email);

        if (!currentUser || !currentUser._id) {
          console.error("❌ Invalid user data");
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          setIsLoading(false);
          return;
        }

        // console.log("✅ User authenticated:", currentUser.email);
        setUser(currentUser);
      } else {
        console.log("❌ No stored token found");
      }
    } catch (error) {
      console.error("🚨 Auth check failed:", error);
      // ✅ Only clear on auth errors, not network errors
      if (error instanceof Error && error.message.includes("Authentication required")) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
      // console.log("🏁 Auth check complete");
    }
  };

  const reloadAuth = async () => {
    // console.log("🔄 === RELOAD AUTH STARTED ===");
    
    hasCheckedAuth.current = false;
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // console.log("📂 Reading token from AsyncStorage...");
    const storedToken = await AsyncStorage.getItem("token");
    // console.log("💾 Token found:", !!storedToken);
    
    if (storedToken) {
      // console.log("🔑 Token preview:", storedToken.substring(0, 50) + "...");
      
      try {
        const parts = storedToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        // console.log("📋 Token payload:", {
        //   userId: payload.userId,
        //   email: payload.email,
        //   temp: payload.temp,
        //   exp: new Date(payload.exp * 1000).toISOString(),
        //   isExpired: Date.now() > payload.exp * 1000,
        // });
      } catch (e) {
        console.error("❌ Failed to decode token:", e);
      }
    }
    
    await checkAuthState();
    
    // console.log("🔄 === RELOAD AUTH COMPLETED ===");
    // console.log("📊 Final state:", {
    //   hasUser: !!user,
    //   hasToken: !!token,
    //   userEmail: user?.email,
    // });
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isVerified,
    login,
    logout,
    updateUser,
    checkAuthState,
    reloadAuth, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};