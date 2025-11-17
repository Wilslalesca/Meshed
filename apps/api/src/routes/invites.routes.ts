import { Router } from "express";
import { InviteController } from "../controllers/InviteController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/:teamId", requireAuth, InviteController.invite);
router.post("/verify", InviteController.verify);
router.get("/accept", InviteController.accept);

export default router;
