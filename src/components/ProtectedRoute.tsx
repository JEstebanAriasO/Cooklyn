import { Navigate, useLocation } from "react-router-dom";
import { useCooklyn } from "@/context/CooklynContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useCooklyn();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
