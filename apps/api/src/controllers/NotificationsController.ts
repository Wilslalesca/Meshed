import { Response } from "express";
import { NotificationModel } from "../models/NotificationModel";
import { AuthedRequest } from "../middleware/authMiddleware";

export const NotificationsController = {
  async getMyNotifications(req: AuthedRequest, res: Response) {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthenticated" });
    const items = await NotificationModel.getUnreadForUser(req.user.id);
    return res.json(items);
  },

  async markAllRead(req: AuthedRequest, res: Response) {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthenticated" });
    await NotificationModel.markAllReadForUser(req.user.id);
    return res.json({ success: true });
  },
};
