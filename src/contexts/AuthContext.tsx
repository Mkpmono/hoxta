import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiClient, ClientDetails, AuthExpiredError } from "@/integrations/api/client";

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
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({ isAuthenticated: false, user: null, client: null });
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth:expired events (401 from API)
  useEffect(() => {
    const handler = () => {
      setSession({ isAuthenticated: false, user: null, client: null });
    };
    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, []);

  // Initialize: check if token exists and validate via /me
  useEffect(() => {
    const init = async () => {
      try {
        const token = apiClient.getAuthToken();
        if (token) {
          const result = await apiClient.me();
          if (result.ok && result.client) {
            const client = result.client;
            setSession({
              isAuthenticated: true,
              user: {
                id: client.id,
                email: client.email,
                name: `${client.firstName} ${client.lastName}`,
                firstName: client.firstName,
                lastName: client.lastName,
                role: "client",
              },
              client,
            });
          } else {
            // Token invalid
            await apiClient.logout();
          }
        }
      } catch (error) {
        // Token expired or invalid
        if (!(error instanceof AuthExpiredError)) {
          console.error("Auth init error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await apiClient.login(email, password);

      if (result.ok && result.token) {
        // Fetch full client details
        const meResult = await apiClient.me();
        if (meResult.ok && meResult.client) {
          const client = meResult.client;
          setSession({
            isAuthenticated: true,
            user: {
              id: client.id,
              email: client.email,
              name: `${client.firstName} ${client.lastName}`,
              firstName: client.firstName,
              lastName: client.lastName,
              role: "client",
            },
            client,
          });
          return { success: true };
        }
      }

      return { success: false, error: "Invalid email or password" };
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
      const result = await apiClient.register({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
        address1: data.address1 || "",
        city: data.city || "",
        state: data.state || "",
        postcode: data.postcode || "",
        country: data.country || "US",
        phonenumber: data.phone || "",
        companyname: data.companyName,
        address2: data.address2,
      });

      if (result.ok && result.token) {
        // Fetch full client details
        const meResult = await apiClient.me();
        if (meResult.ok && meResult.client) {
          const client = meResult.client;
          setSession({
            isAuthenticated: true,
            user: {
              id: client.id,
              email: client.email,
              name: `${client.firstName} ${client.lastName}`,
              firstName: client.firstName,
              lastName: client.lastName,
              role: "client",
            },
            client,
          });
          return { success: true };
        }
      }

      return { success: false, error: "Registration failed" };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
    setSession({ isAuthenticated: false, user: null, client: null });
  }, []);

  const refreshSession = useCallback(async () => {
    if (!session.isAuthenticated) return;
    try {
      const result = await apiClient.me();
      if (result.ok && result.client) {
        setSession(prev => ({
          ...prev,
          client: result.client,
        }));
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }, [session.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ session, login, register, logout, isLoading, refreshSession }}>
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
