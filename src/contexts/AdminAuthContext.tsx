import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session?.user) {
        const admin = await checkAdminRole(session.user.id);
        if (!mounted) return;
        setUser(session.user);
        setIsAdmin(admin);
      }
      setIsLoading(false);
    };
    init();

    // Listen for auth changes - DO NOT await inside callback to prevent deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        // Defer the async role check with setTimeout to avoid Supabase deadlock
        setTimeout(async () => {
          if (!mounted) return;
          const admin = await checkAdminRole(session.user.id);
          if (!mounted) return;
          setIsAdmin(admin);
        }, 0);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be within AdminAuthProvider");
  return ctx;
}
