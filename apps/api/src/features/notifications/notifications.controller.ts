import { Response } from "express";
import * as service from "./notifications.service";
import { AuthedRequest } from "../../middleware/authMiddleware";
import { ActivityLogModel } from "../../models/ActivityLogModel";
import { TeamModel } from "../../models/TeamModel";


export async function createForTeam(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { teamId } = req.params;
    const { type, message, meta } = req.body;

    const created = await service.createForTeam( req.user.organizationId, teamId as string, type, message, meta);

    // If this is used as an announcement (current UI uses type=SYSTEM), also create an update
    // for the sender so it shows up in their Updates feed with the actual message.
    if (type === "SYSTEM") {
        const team = await TeamModel.getTeam(teamId as string, req.user.organizationId);
        const teamName = team?.name ?? "your team";
        await service.createForUser(
            req.user.organizationId,
            req.user.id,
            "SYSTEM",
            `Announcement to ${teamName}: ${message}`,
            { ...(meta ?? {}), teamId: teamId as string, url: `/teams/${teamId}` },
        );

        await ActivityLogModel.log(
            req.user.organizationId,
            req.user.id,
            "ANNOUNCEMENT_SENT",
            "team",
            teamId as string,
        );
    }
    res.status(201).json({ created });
}

export async function createForUser(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { userId } = req.params;
    const { type, message, meta } = req.body;

    const created = await service.createForUser(req.user.organizationId, userId as string, type, message, meta );
    res.status(201).json({ created });
}

export async function list(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string | undefined;

    const result = await service.list(req.user.organizationId, req.user.id, { limit, cursor });
    res.json(result);
}

export async function getUnreadCount(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");

    const count = await service.getUnreadCount(req.user.organizationId, req.user.id);
    res.json({ count });
}

export async function markAsRead(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const updated = await service.markRead(req.user.organizationId, req.user.id, req.params.id as string);
    res.json({ updated });
}

export async function markAllRead(req: AuthedRequest, res: Response) {
    if (!req.user) return res.status(401).send("Unauthorized");
    const updated = await service.markAllRead(req.user.organizationId, req.user.id);
    res.json({ updated });
}
