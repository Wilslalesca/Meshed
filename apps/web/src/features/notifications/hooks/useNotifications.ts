import { useCallback, useEffect, useMemo, useState } from "react";
import { getNotifications, getUnreadCount, markAllRead, markAsRead } from "../api/notifications.api";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Notification } from "../types/types";

export function useNotifications() {
    const { user } = useAuth();
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshUnread = useCallback(async () => {
        if (!user || !token) return;
        const count = await getUnreadCount(user!.id, token!);
        setUnreadCount(count);
    }, [user, token]);

    const loadNotifications = useCallback(async (limit = 20) => {
        if (!user || !token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getNotifications(user!.id, limit, token!);
            setNotifications(res.items);
            setUnreadCount(res.items.filter(n => !n.read_at).length);
        }
        catch {
            setError("Failed to load notifications");
        }
        finally {
            setLoading(false);
        }
    }, [user, token]);

    const markNotificationAsRead = useCallback(async (id: string) => {
        if (!user || !token) return;
        try {
            await markAsRead(user!.id, id, token!);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    }, [user, token]);
    
    const markAllNotificationsRead = useCallback(async () => {
        if (!user || !token) return;
        try {
            await markAllRead(user!.id, token!);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        }
        catch (err) {
            console.error("Failed to mark all notifications as read", err);
        }
    }, [user, token]);

    useEffect(() => {
        if (user && token) {
            refreshUnread();
            const time = setInterval(refreshUnread, 60000); 
            return () => clearInterval(time);
        }
    }, [user, token, refreshUnread]);

    return useMemo(() => ({
        unreadCount,
        notifications,
        loading,
        error,
        refresh: loadNotifications,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsRead,
    }), [
        unreadCount,
        notifications,
        loading,
        error,
        loadNotifications,
        markNotificationAsRead,
        markAllNotificationsRead,
    ]);
}