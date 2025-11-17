export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiSendResetCode(email: string) {

  await fetch(`${API_BASE}/auth/password/reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

}

export async function apiResetPassword(email: string, code: string, password: string) {

  await fetch(`${API_BASE}/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
  });
  
}
