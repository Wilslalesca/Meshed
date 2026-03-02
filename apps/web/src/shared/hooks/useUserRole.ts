import { useMemo } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import type { Role } from '@/features/auth/types/auth';

export type UserRole = Role | 'guest';


interface UseUserRoleResult {
  role: UserRole;
  isUser: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}


export const useUserRole = (): UseUserRoleResult => {
    const { user, isAuthenticated } = useAuth();

    const role: UserRole = useMemo(() => {
        if (!isAuthenticated || !user) {
            return 'guest';
        }

        const normalizedRole = user.role.toLowerCase() as UserRole;


        switch (normalizedRole) {
            case 'admin':
                return 'admin';
            case 'manager':
                return 'manager';
            case 'facility_manager':
                return 'facility_manager';
            case 'user':
                return 'user';
            default:
                return 'guest';
        }
    }, [isAuthenticated, user]);

    return {
        role,
        isUser: role === 'user',
        isManager: role === 'manager' || role === 'facility_manager',
        isAdmin: role === 'admin',
        isAuthenticated,
    };
};