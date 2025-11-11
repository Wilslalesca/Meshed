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

    async updateUser(_req: AuthedRequest, res: Response){
        try{
            res.status(200).json({ message: "Profile updated", success: true });
        }
        catch(err){
            console.error("Error updating user profile:", err);
            res.status(500).json({ message: "Internal server error", success: false });
        }
    },
};