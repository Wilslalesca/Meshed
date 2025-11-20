// All types needed for frontend and backend auth

// admin is a rare role only for dev team so us currently
export type Role = "admin" | "user" | "manager" | "facility_manager";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    role: Role;
    active: boolean;
    verified: boolean;
};

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

export type RegisterCredentials = {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'admin' | 'manager' | 'user' | 'facility_manager';
    invitedToken?: string | null;
};

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
    expiresAt?: string;
}
