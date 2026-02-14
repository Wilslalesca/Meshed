import { Request, Response } from "express";
import * as service from "./notifications.service";

export async function create(req: Request, res: Response) {
    const { userId, type, message, meta } = req.body;
    await service.create(userId, type, message, meta);
    res.status(201).json({ message: "Notification created" });
}

// export async function update(req: Request, res: Response) {
//     try {
//         const { id } = req.params;
//         const { read_at } = req.body;
//         const notification = await service.updateNotification(id, { read_at });
//         res.json(notification);
//     } catch (error) {
//         console.error("Error updating notification:", error);
//         res.status(500).json({ error: "Failed to update notification" });
//     }
// }

export async function list(req: Request, res: Response) {
    const { userId } = req.query;
    
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;

    const result = await service.list(userId as string, {limit, cursor});
    res.json(result);
}

export async function getUnreadCount(req: Request, res: Response) {
    const { userId } = req.query;
    const count = await service.getUnreadCount(userId as string);
    res.json({ count });
}


export async function markAsRead(req: Request, res: Response) {
    const { userId } = req.query;
    const updated = await service.markRead(userId as string, req.params.id);
    res.json({ updated });
}

export async function markAllRead(req: Request, res: Response) {
    const { userId } = req.query;
    const updated = await service.markAllRead(userId as string);
    res.json({ updated });
}

