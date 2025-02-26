import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { ProtectedRouteProps } from '@models/common.model';
import Loading from './loading';

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { user, loading: userLoading } = useUser();

  // Manejo de estados de carga
  const isLoading = authLoading || userLoading;

  // Verificación de permisos
  const hasPermission = allowedRoles 
    ? allowedRoles.includes(user?.role)
    : true;

  // Lógica de redirección
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/" />;
  if (!user) return <Navigate to="/" />;
  if (!hasPermission) return <Navigate to="/emptyPage" />;

  return children;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default ProtectedRoute;