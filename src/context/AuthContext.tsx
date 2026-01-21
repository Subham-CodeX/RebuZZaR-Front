import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { logError } from "../utils/logError";

const API = import.meta.env.VITE_BACKEND_URL;

/* =======================
   User Type
======================= */
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "admin";
  studentCode?: string;
  programType?: "Diploma" | "UG" | "PG" | "PhD";
  department?: string;
  year?: "1st" | "2nd" | "3rd" | "4th" | "5th";
  hasSeenWelcome?: boolean;
}

/* =======================
   Context Type
======================= */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  justSignedUp: boolean;
  setJustSignedUp: (v: boolean) => void;
  login: (user: User | null, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

/* =======================
   Context
======================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   Provider
======================= */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐ session-only flag (NOT persisted)
  const [justSignedUp, setJustSignedUp] = useState(false);

  /* =======================
     Logout (your same logic ✅)
  ======================= */
  const logout = async () => {
    const jwt = localStorage.getItem("authToken");

    try {
      if (jwt) {
        await fetch(`${API}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      }
    } catch (err) {
      logError("Logout API failed", err);
      // Do NOT block logout
    }

    // ✅ Clear frontend auth AFTER API call
    setUser(null);
    setToken(null);
    setJustSignedUp(false);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  /* =======================
     Fetch current user (FIXED ✅)
  ======================= */
  const fetchUser = async (jwt: string) => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      /**
       * ✅ FIX:
       * If Google user is not verified/profile not complete,
       * backend returns 403.
       * We must NOT logout, because user needs token to finish onboarding.
       */
      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        console.warn("Onboarding required:", data?.message);

        // ✅ Keep token but keep user null
        setUser(null);
        localStorage.removeItem("authUser");
        return;
      }

      // ✅ If token invalid/expired -> logout
      if (res.status === 401) {
        await logout();
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
    } catch (err) {
      logError("Auth fetchUser failed", err);
      await logout();
    }
  };

  /* =======================
     On App Load
  ======================= */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<{ exp: number }>(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          await logout();
          return;
        }

        setToken(storedToken);
        await fetchUser(storedToken);
      } catch {
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /* =======================
     Login (Email / Google)
  ======================= */
  const login = (userData: User | null, jwt: string) => {
    setToken(jwt);
    localStorage.setItem("authToken", jwt);

    if (userData) {
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));
    } else {
      fetchUser(jwt);
    }

    // 🔴 IMPORTANT: login should NOT trigger welcome
    setJustSignedUp(false);
  };

  /* =======================
     Update User
  ======================= */
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        justSignedUp,
        setJustSignedUp,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   Hook
======================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
