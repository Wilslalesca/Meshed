export type Role = "admin" | "manager" | "user";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    role: Role;
    organizationId: string;
    organizationRole: Role;
    active: boolean;
    verified: boolean;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export type RegisterCredentials = {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    organizationName?: string;
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

export interface Invite {
    email: string;
    role: Role;
    token: string;
    expiresAt: string;
}

export interface AuthError {
    message?: string;
    needsVerification?: boolean;
    userId?: string;
}
