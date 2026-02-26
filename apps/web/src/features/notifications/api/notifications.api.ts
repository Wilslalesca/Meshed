export const API_BASE = import.meta.env.VITE_API_BASE_URL;

import type { NotificationListResponse } from "../types/types";

export async function getNotifications(userId: string, limit = 20, token: string | null, cursor?: string) {
    try {
        const res = await fetch(`${API_BASE}/notifications?userId=${userId}&limit=${limit}${cursor ? `&cursor=${cursor}` : ""}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data: NotificationListResponse = await res.json();
            return data;
    } catch {
        throw new Error("Failed to fetch notifications");
    }
}

export async function getUnreadCount(userId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/notifications/unreadCount?userId=${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            return data.count;
    } catch  {
        throw new Error("Failed to fetch unread count");
    }
}

export async function markAsRead(userId: string, notificationId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/notifications/${notificationId}/read?userId=${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            return data.updated;
    } catch  {
        throw new Error("Failed to mark notification as read");
    }
}

export async function markAllRead(userId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE}/notifications/read?userId=${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            return data.updated;
    } catch  {
        throw new Error("Failed to mark all notifications as read");
    }
}