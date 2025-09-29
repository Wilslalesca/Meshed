export type Role = "admin" | "manager" | "user";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
}

export interface JWTPayload {
    userId: string;
    role: Role;
    jti?: string; 
}