import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware";
import * as controller from "./notifications.controller";

const router = Router();

router.use(requireAuth);

router.get("/unreadCount", controller.getUnreadCount);
router.get("/", controller.list);
router.post("/:id/read", controller.markAsRead);
router.post("/read", controller.markAllRead);
router.post("/team/:teamId", controller.createForTeam);
router.post("/user/:userId", controller.createForUser);

export default router;
