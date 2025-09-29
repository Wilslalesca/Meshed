// This will guard routes that need access to a JWT or private views such as admin

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div className="center">Loading…</div>;

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
}
    