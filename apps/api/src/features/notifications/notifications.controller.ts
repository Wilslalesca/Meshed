import { Request, Response } from "express";
import * as service from "./notifications.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

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



export async function list(req: Request, res: Response) {
    const userId = req.user!.id;

    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;

    const result = await service.list(userId, { limit, cursor });
    res.json(result);
}



export async function getUnreadCount(req: Request, res: Response) {
    const userId = req.user!.id;
    const count = await service.getUnreadCount(userId);
    res.json({ count });
}

export async function markAsRead(req: Request, res: Response) {
    const userId  = req.user!.id;
    const updated = await service.markRead(userId, req.params.id as string);
    res.json({ updated });
}

export async function markAllRead(req: Request, res: Response) {
  const userId = req.user!.id;
  const updated = await service.markAllRead(userId);
  res.json({ updated });
}
