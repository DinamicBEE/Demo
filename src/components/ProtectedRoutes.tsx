import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRouteProps } from "@models/common.model";
import Loading from "./Loading";

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  //console.log("ProtectedRoute", { isAuthenticated, isLoading, user, allowedRoles });

  if (isLoading) return <Loading />;

  if (!isAuthenticated || !user) return <Navigate to="/" replace />;

  if (allowedRoles && user.role && !allowedRoles.includes(user.role))
    return <Navigate to="/emptyPage" replace />;

  return children;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const path = user?.role === 'GENERALZONE' ? '/starbucks' : '/homeV2';
  if (isLoading) return <Loading />;
  if (isAuthenticated && user) return <Navigate to={path} replace />;
  return children;
}

export default ProtectedRoute;
