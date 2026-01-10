import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("client" | "admin")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
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

  if (allowedRoles && session.user && !allowedRoles.includes(session.user.role)) {
    // Redirect to appropriate panel based on role
    if (session.user.role === "client") {
      return <Navigate to="/panel" replace />;
    }
    if (session.user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
