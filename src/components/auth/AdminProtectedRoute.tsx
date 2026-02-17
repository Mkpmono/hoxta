import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
