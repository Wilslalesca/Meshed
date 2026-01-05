import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { NotificationsController } from "../controllers/NotificationsController";

const router = Router();
router.use(requireAuth);

router.get("/", NotificationsController.getMyNotifications);
router.post("/read", NotificationsController.markAllRead);

export default router;
