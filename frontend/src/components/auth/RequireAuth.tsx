import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

interface RequireAuthProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

export const RequireAuth = ({ allowedRoles, children }: RequireAuthProps) => {
    const { user, token } = useAuthStore();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return children ? null : <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
