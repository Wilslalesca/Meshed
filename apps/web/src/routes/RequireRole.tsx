import React from 'react';
import { Navigate } from 'react-router-dom';
import type { Role } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

export const RequireRole: React.FC<{ allow: Role | Role[]; children: React.ReactNode }> = ({ allow, children }) => {
  const { isLoading, token, hasRole } = useAuth();
  if (isLoading) return <div className="center">Loading…</div>;

  if (!token) return <Navigate to="/login" replace />;

  if (!hasRole(allow)) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};
