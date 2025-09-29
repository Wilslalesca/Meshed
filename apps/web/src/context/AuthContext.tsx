
// Call the login function here to get access to jwt
import React, { 
    createContext, 
    useCallback,
    useContext, 
    useState, 
    useEffect,
    useMemo
} from 'react';
import { 
    type AuthResponse, 
    type AuthState, 
    type LoginCredentials, 
    type RegisterCredentials, 
    type Role 
} from '../types/auth';

import { storage } from '../services/storage';

// REMOVE AFTER TESTING
import { apiLogin, apiRegister, apiMe } from '../api/auth';

interface AuthContextValue extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    hasRole: (allowed: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({ user: null, token: null, isAuthenticated: false, loading: true, error: null });

    useEffect(() => {
        const token = storage.getToken();
        const user = storage.getUser();
        if (token && user) {
            setState({ user, token, isAuthenticated: true, loading: false, error: null });
        } else {
            setState({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
        }
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const res: AuthResponse = await apiLogin(credentials);
        storage.setToken(res.token);
        storage.setUser(res.user);
        setState({ user: res.user, token: res.token, isAuthenticated: true, loading: false, error: null });
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        const res: AuthResponse = await apiRegister(credentials);
        storage.setToken(res.token);
        storage.setUser(res.user);
        setState({ user: res.user, token: res.token, isAuthenticated: true, loading: false, error: null });
    }, []);

    const logout = useCallback(() => {
        storage.clearToken();
        storage.clearUser();
        setState({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
    }, []);

    const hasRole = useCallback((allowed: Role | Role[]) => {
        const roles = Array.isArray(allowed) ? allowed : [allowed];
        const r = state.user?.role;
        return r ? roles.includes(r) : false;
    }, [state.user]);

    const value = useMemo(() => ({
        ...state,
        login,
        register,
        logout,
        hasRole,
        isLoading: state.loading
    }), [state, login, register, logout, hasRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuthCtx() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthCtx must be used within an AuthProvider');
    }
    return ctx;
};