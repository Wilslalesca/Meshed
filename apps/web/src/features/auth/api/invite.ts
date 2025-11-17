export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiVerifyInvite(email: string, code: string) {

    const res = await fetch(`${API_BASE}/invites/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
        return { success: false };
    }
    
    return await res.json();
}

export async function apiAcceptInvite(email: string, code: string) {

    const res = await fetch(`${API_BASE}/invites/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

    return { success: res.ok };
}