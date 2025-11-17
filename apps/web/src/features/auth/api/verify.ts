export const API_BASE = import.meta.env.VITE_API_BASE_URL;


export async function apiSendEmailVerification(email: string) {
  const res = await fetch(`${API_BASE}/auth/send-email-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

export async function apiVerifyEmail(email: string, code: string) {
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });
  return res.ok;
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

export async function apiResetPassword(email: string, code: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password })
  });
  return res.ok;
}
