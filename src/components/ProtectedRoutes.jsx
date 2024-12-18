import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AutContext';

function ProtectedRoute({ children  }) {
    const { isAuthenticated } = useAuth();
    
    return isAuthenticated ? children  : <Navigate to="/" />;
}

export default ProtectedRoute;