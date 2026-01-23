import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRouteProps } from "@models/common.model";
import Loading from "./Loading";
import { DEFAULT_PATH, ROLE_PATHS } from "@models/const/menu.consts";

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loading />;

  if (!isAuthenticated || !user) return <Navigate to="/" replace />;

  if (allowedRoles && user.role && !allowedRoles.includes(user.role))
    return <Navigate to="/emptyPage" replace />;

  return children;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const path = getPathByRole(user?.role);
  if (isLoading) return <Loading />;
  if (isAuthenticated && user) return <Navigate to={path} replace />;
  return children;
}

const getPathByRole = (role?: string | null): string => {
  if (!role) return DEFAULT_PATH;
  return ROLE_PATHS[role as keyof typeof ROLE_PATHS] || DEFAULT_PATH;
};

export default ProtectedRoute;
