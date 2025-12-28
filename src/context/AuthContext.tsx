import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { logError } from '../utils/logError';

const API = import.meta.env.VITE_BACKEND_URL;

/* =======================
   User Type
======================= */
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'admin';
  studentCode?: string;
  programType?: 'Diploma' | 'UG' | 'PG' | 'PhD';
  department?: string;
  year?: '1st' | '2nd' | '3rd' | '4th' | '5th';
}

/* =======================
   Context Type
======================= */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
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

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('authUser', JSON.stringify(data.user));
    } catch (err) {
      logError('Auth fetchUser failed', err);
      logout();
    }
  };

  /* =======================
     On App Load
  ======================= */
  useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ exp: number }>(storedToken);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setToken(storedToken);
      await fetchUser(storedToken); // ✅ WAIT
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false); // ✅ NOW SAFE
    }
  };

  initAuth();
}, []);


  /* =======================
     Login (Email / Google)
  ======================= */
  const login = (userData: User | null, jwt: string) => {
    setToken(jwt);
    localStorage.setItem('authToken', jwt);

    // Email login → user already known
    if (userData) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
      // Google login → fetch user
      fetchUser(jwt);
    }
  };

  /* =======================
     Logout
  ======================= */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  /* =======================
     Update User
  ======================= */
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
