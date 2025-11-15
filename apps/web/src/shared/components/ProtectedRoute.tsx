import { Navigate } from "react-router-dom";
import { useUserRole } from "@/shared/hooks/useUserRole";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children: React.ReactNode;
}


export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { isAuthenticated, role } = useUserRole();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};