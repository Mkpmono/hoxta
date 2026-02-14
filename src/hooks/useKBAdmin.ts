import { useState, useEffect } from "react";

// TODO: Replace with PHP backend admin check when available
export function useKBAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if current user has admin role via auth token
    const token = localStorage.getItem("auth_token");
    if (token) {
      // For now, admin check can be done via a backend endpoint
      // Admin features will be available when PHP backend supports it
      setUser({ id: "current" });
      setIsAdmin(false); // Default: no admin until PHP backend provides this
    }
    setLoading(false);
  }, []);

  return { isAdmin, loading, user };
}
