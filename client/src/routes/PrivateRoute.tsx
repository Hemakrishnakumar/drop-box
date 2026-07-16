import { useAuth } from '@/context';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';



interface PrivateRouteProps {
    children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
