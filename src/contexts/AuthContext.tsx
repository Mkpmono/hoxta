import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, demoUsers, demoCredentials } from "@/lib/mockData";

interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  session: AuthSession;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: "client" | "admin" | "owner") => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "hoxta_demo_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.user) {
          setSession(parsed);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save session to localStorage when it changes
  useEffect(() => {
    if (session.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check demo credentials
    if (email === demoCredentials.client.email && password === demoCredentials.client.password) {
      const user = demoUsers.find((u) => u.email === email);
      if (user) {
        setSession({ isAuthenticated: true, user });
        return { success: true };
      }
    }

    if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
      const user = demoUsers.find((u) => u.email === email);
      if (user) {
        setSession({ isAuthenticated: true, user });
        return { success: true };
      }
    }

    if (email === demoCredentials.owner.email && password === demoCredentials.owner.password) {
      const user = demoUsers.find((u) => u.email === email);
      if (user) {
        setSession({ isAuthenticated: true, user });
        return { success: true };
      }
    }

    return { success: false, error: "Invalid email or password" };
  };

  const loginAsDemo = (role: "client" | "admin" | "owner") => {
    const user = demoUsers.find((u) => u.role === role);
    if (user) {
      setSession({ isAuthenticated: true, user });
    }
  };

  const logout = () => {
    setSession({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ session, login, loginAsDemo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
