// All types needed for frontend and backend auth 

// admin is a rare role only for dev team so us currently
export type Role = 'admin' | 'user' | 'manager';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: Role;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
    expiresAt?: string;
} 