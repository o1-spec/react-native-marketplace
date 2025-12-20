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
} from "react"; // ✅ ADD useRef

interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  avatar?: string;
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
      console.error("Login error:", error);
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
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    try {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        const profileData = await userAPI.getProfile();
        const currentUser = profileData.user;

        setToken(storedToken);
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
