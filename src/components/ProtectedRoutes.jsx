import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

function ProtectedRoute({ children, allowedRoles  }) {
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
        
    if (!isAuthenticated) return <Navigate to="/" />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/emptyPage" />;
    }

    return children;
}

export function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
  
    return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default ProtectedRoute;