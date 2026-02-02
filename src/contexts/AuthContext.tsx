import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient, ClientDetails, checkMockMode, isMockMode } from "@/services/apiClient";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "admin" | "owner";
  firstName?: string;
  lastName?: string;
}

interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  client: ClientDetails | null;
}

interface AuthContextType {
  session: AuthSession;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: "client" | "admin" | "owner") => void;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isMockMode: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "hoxta_auth_session";

// Demo users for mock mode
const demoUsers = [
  { id: "1", email: "client@demo.hoxta", name: "Demo Client", role: "client" as const },
  { id: "2", email: "admin@demo.hoxta", name: "Demo Admin", role: "admin" as const },
  { id: "3", email: "owner@demo.hoxta", name: "Demo Owner", role: "owner" as const },
];

const demoCredentials = {
  client: { email: "client@demo.hoxta", password: "Demo1234!" },
  admin: { email: "admin@demo.hoxta", password: "Demo1234!" },
  owner: { email: "owner@demo.hoxta", password: "Demo1234!" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({ isAuthenticated: false, user: null, client: null });
  const [isLoading, setIsLoading] = useState(true);
  const [mockMode, setMockMode] = useState(true);

  // Initialize: check mock mode and restore session
  useEffect(() => {
    const init = async () => {
      try {
        // Check if backend is in mock mode
        const isInMockMode = await checkMockMode();
        setMockMode(isInMockMode);

        // Try to restore session
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.isAuthenticated && parsed.user) {
              // Verify session is still valid by calling /me
              const result = await apiClient.getMe();
              if (result.data) {
                setSession({
                  isAuthenticated: true,
                  user: parsed.user,
                  client: result.data
                });
              } else {
                // Session invalid, clear storage
                localStorage.removeItem(STORAGE_KEY);
              }
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Save session to localStorage when it changes
  useEffect(() => {
    if (session.isAuthenticated && session.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isAuthenticated: true,
        user: session.user
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // In mock mode, check demo credentials first
      if (isMockMode()) {
        if (email === demoCredentials.client.email && password === demoCredentials.client.password) {
          const user = demoUsers.find((u) => u.email === email);
          if (user) {
            setSession({ isAuthenticated: true, user, client: null });
            return { success: true };
          }
        }
        if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
          const user = demoUsers.find((u) => u.email === email);
          if (user) {
            setSession({ isAuthenticated: true, user, client: null });
            return { success: true };
          }
        }
        if (email === demoCredentials.owner.email && password === demoCredentials.owner.password) {
          const user = demoUsers.find((u) => u.email === email);
          if (user) {
            setSession({ isAuthenticated: true, user, client: null });
            return { success: true };
          }
        }
      }

      // Call backend login
      const result = await apiClient.login(email, password);

      if (result.success && result.client) {
        const user: User = {
          id: result.client.id,
          email: result.client.email,
          name: `${result.client.firstName} ${result.client.lastName}`,
          firstName: result.client.firstName,
          lastName: result.client.lastName,
          role: "client",
        };

        setSession({
          isAuthenticated: true,
          user,
          client: result.client
        });

        return { success: true };
      }

      return { success: false, error: result.error || "Invalid email or password" };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Login failed" };
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiClient.register(data);

      if (result.success && result.client) {
        const user: User = {
          id: result.client.id,
          email: result.client.email,
          name: `${result.client.firstName} ${result.client.lastName}`,
          firstName: result.client.firstName,
          lastName: result.client.lastName,
          role: "client",
        };

        setSession({
          isAuthenticated: true,
          user,
          client: result.client
        });

        return { success: true };
      }

      return { success: false, error: result.error || "Registration failed" };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } finally {
      setSession({ isAuthenticated: false, user: null, client: null });
    }
  }, []);

  const loginAsDemo = useCallback((role: "client" | "admin" | "owner") => {
    const user = demoUsers.find((u) => u.role === role);
    if (user) {
      setSession({ isAuthenticated: true, user, client: null });
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!session.isAuthenticated) return;

    try {
      const result = await apiClient.getMe();
      if (result.data) {
        setSession(prev => ({
          ...prev,
          client: result.data!
        }));
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  }, [session.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      login, 
      loginAsDemo,
      register, 
      logout, 
      isLoading, 
      isMockMode: mockMode,
      refreshSession
    }}>
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
