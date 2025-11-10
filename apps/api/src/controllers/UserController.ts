import { Response } from "express";
import { AuthedRequest } from "../middleware/authMiddleware";
import { UserModel } from "../models/UserModel";

export const UserController = {

    async me(req: AuthedRequest, res: Response) {
        const user = await UserModel.findById(req.user!.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
    },

    adminPing(_req: AuthedRequest, res: Response) {
        res.json({ ok: true, msg: "admin ok" });
    },

    managerPing(_req: AuthedRequest, res: Response) {
        res.json({ ok: true, msg: "manager ok" });
    },
};