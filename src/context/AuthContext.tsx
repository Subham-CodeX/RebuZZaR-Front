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

  // ✅ NEW (Phone Verification)
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  isFullyVerified?: boolean;
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

  // ✅ NEW
  refreshUser: () => Promise<void>;
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
     Logout
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
    }

    // ✅ Clear frontend auth AFTER API call
    setUser(null);
    setToken(null);
    setJustSignedUp(false);

    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");

    // ✅ NEW: clear onboarding step too
    localStorage.removeItem("onboardingStep");
  };

  /* =======================
     Fetch current user
  ======================= */
  const fetchUser = async (jwt: string) => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      /**
       * ✅ If onboarding required (google/profile/phone),
       * backend returns 403.
       * We must NOT logout, because user needs token to finish onboarding.
       */
      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        console.warn("Onboarding required:", data?.message);

        // ✅ Store onboarding step if backend sends it
        if (data?.step) {
          localStorage.setItem("onboardingStep", data.step);
        }

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

      // ✅ User successfully loaded => onboarding done
      localStorage.removeItem("onboardingStep");

      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
    } catch (err) {
      logError("Auth fetchUser failed", err);
      await logout();
    }
  };

  // ✅ NEW helper to refresh user after phone verification
  const refreshUser = async () => {
    const jwt = localStorage.getItem("authToken");
    if (!jwt) return;
    await fetchUser(jwt);
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

      // ✅ If user not fully verified, keep onboarding step
      if (userData.isFullyVerified === false) {
        localStorage.setItem("onboardingStep", "FULL_VERIFICATION_REQUIRED");
      } else {
        localStorage.removeItem("onboardingStep");
      }
    } else {
      fetchUser(jwt);
    }

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
        refreshUser,
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
