import { Request, Response } from "express";
import * as service from "./notifications.service";
import { AuthedRequest } from "../../middleware/authMiddleware";


export async function createForTeam(req: Request, res: Response) {
    const { teamId } = req.params;
    const { type, message, meta } = req.body;
    const created = await service.createForTeam(teamId as string, type, message, meta);
    res.status(201).json({ created });
}

export async function createForUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { type, message, meta } = req.body;
    const created = await service.createForUser(userId as string, type, message, meta);
    res.status(201).json({ created });
}



export async function list(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;

    const result = await service.list(userId, { limit, cursor });
    res.json(result);
}



export async function getUnreadCount(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const count = await service.getUnreadCount(userId);
    res.json({ count });
}

export async function markAsRead(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const updated = await service.markRead(userId, req.params.id as string);
    res.json({ updated });
}

export async function markAllRead(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const updated = await service.markAllRead(userId);
    res.json({ updated });
}
