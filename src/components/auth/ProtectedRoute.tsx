import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Environment check - API settings only available in dev/mock mode
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("client" | "admin" | "owner")[];
  requireOwner?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireOwner }: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    return <Navigate to="/panel/login" state={{ from: location }} replace />;
  }

  // Special handling for /panel/api route
  if (location.pathname === "/panel/api") {
    // Block in production mode
    if (!isDevelopment) {
      return <Navigate to="/panel" replace />;
    }
    // Only owner can access API settings
    if (session.user?.role !== "owner") {
      return <Navigate to="/panel" replace />;
    }
  }

  // Owner-only route check
  if (requireOwner && session.user?.role !== "owner") {
    if (session.user?.role === "client") {
      return <Navigate to="/panel" replace />;
    }
    if (session.user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  if (allowedRoles && session.user && !allowedRoles.includes(session.user.role)) {
    // Redirect to appropriate panel based on role
    if (session.user.role === "client") {
      return <Navigate to="/panel" replace />;
    }
    if (session.user.role === "admin" || session.user.role === "owner") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
