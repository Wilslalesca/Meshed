import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import {
    type AuthResponse,
    type AuthState,
    type LoginCredentials,
    type RegisterCredentials,
    type Role,
} from "@/features/auth/types/auth";

import { storage } from "@/shared/services/storage";
import { apiLogin, apiRegister, apiMe } from "@/features/auth/api/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextValue extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<{ userId: string }>;
    logout: () => void;
    isLoading: boolean;
    hasRole: (allowed: Role | Role[]) => boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = storage.getToken();
        
        const init = async () => {
            if (!token) {
                setState((s) => ({
                    ...s,
                    loading: false,
                }));
                return;
            }
            const user = await apiMe(token);

            if (user) {
                storage.setUser(user);
                setState({
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
            } else {
                storage.clearToken();
                storage.clearUser();
                setState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    error: null,
                });
            }
        };
        init();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const res: AuthResponse = await apiLogin(credentials);
        storage.setToken(res.token);

        const backendUser = await apiMe(res.token);
        const user = backendUser ?? res.user;

        storage.setUser(user);
        setState({
            user,
            token: res.token,
            isAuthenticated: true,
            loading: false,
            error: null,
        });
    }, []);

    const register = useCallback(
        async (credentials: RegisterCredentials): Promise<{ userId: string }> => {
            const res = await apiRegister(credentials);
            return res;
        }, []
    );

    const logout = useCallback(() => {
        storage.clearToken();
        storage.clearUser();

        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
        navigate("/login", { replace: true });
    }, [navigate]);

    const hasRole = useCallback(
        (allowed: Role | Role[]) => {
            const roles = Array.isArray(allowed) ? allowed : [allowed];
            const userRole = state.user?.role;
            return userRole ? roles.includes(userRole) : false;
        },
        [state.user]
    );

    const refreshUser = useCallback(async () => {
        if (!state.token) return;

        const user = await apiMe(state.token);
        if (user) {
            storage.setUser(user);
            setState((prev) => ({ ...prev, user }));
        }
    }, [state.token]);

    const value = useMemo(
        () => ({
            ...state,
            login,
            register,
            logout,
            hasRole,
            refreshUser,
            isLoading: state.loading,
        }),
        [state, login, register, logout, hasRole, refreshUser]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export function useAuthCtx() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthCtx must be used within an AuthProvider");
    }
    return ctx;
}
