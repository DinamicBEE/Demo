import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRouteProps } from "@models/common.model";
import Loading from "./Loading";

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/emptyPage" replace />;

  return children;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

export default ProtectedRoute;