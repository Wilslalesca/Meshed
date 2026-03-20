import type { AuthUser, LoginCredentials, RegisterCredentials } from "../types/auth";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiLogin(input: LoginCredentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data as { token: string; user: AuthUser };
}

export async function apiRegister(input: RegisterCredentials) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data as { message: string; userId: string };
}

export async function apiRefresh() {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data as { token: string; user: AuthUser };
}

export async function apiMe(token: string) {
    const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
    });

    if (!res.ok) {
        return null;
    }

    return (await res.json()) as AuthUser;
}

export async function apiVerify(input: { userId: string; code: string }) {
    const res = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}

export async function apiResend(input: { userId: string }) {
    const res = await fetch(`${API_BASE}/auth/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}
