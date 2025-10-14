export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';



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

  return (await res.json()) as { token: string; user: any };
}


export async function apiRegister(input: { firstName: string; lastName?: string; email: string; password: string; phone?: string; role?: 'admin'|'manager'|'user'; }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error((await res.json()).error || 'Register failed');
  }

  return (await res.json()) as { token: string; user: any };
}

export async function apiRefresh() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  return (await res.json()) as { token: string; user: any };
}


export async function apiMe(token: string) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
}
