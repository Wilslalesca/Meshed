import { Router } from "express";
import { InviteController } from "../controllers/InviteController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/:teamId", requireAuth, InviteController.invite);
router.get("/accept/:token", InviteController.acceptInvite);

export default router;
