import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { ProtectedRouteProps } from '@models/common.model';
import Loading from './loading';

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const { user, loading } = useUser();

    if (loading || isLoading) {
        return <Loading />;
    }
        
    if (!isAuthenticated) return <Navigate to="/" />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/emptyPage" />;
    }

    return children;
}

export function PublicRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
  
    return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default ProtectedRoute;