export type Role = "admin" | "manager" | "user";
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    role?: Role;
    password_hash?: string;
    active?: boolean;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
}