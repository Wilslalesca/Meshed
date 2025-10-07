const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const storage = {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },
    clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    },
    getUser() {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    setUser(user: any): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearUser(): void {
        localStorage.removeItem(USER_KEY);
    },
};
