import type { User } from "@/features/profiles/user/types";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiLogin(input: { email: string; password: string; }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error((await res.json()).error || 'Login failed');
  }

  return (await res.json()) as { token: string; user: User };
}

export async function apiRegister(input: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'user';
  invitedToken?: string | null;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Register failed");
  }

  return data; 
}


export async function apiRefresh() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  return (await res.json()) as { token: string; user: User };
}

export async function apiMe(token: string) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!res.ok) {
    return null;
  }

  return await res.json() as User;
}


export async function apiVerify(input: {userId: string, code: string}) {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Resend failed");
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
    throw new Error(data.error || "Resend failed");
  }

  return data;
}