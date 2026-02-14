import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware";
import * as controller from "./notifications.controller";

const router = Router();

router.use(requireAuth);

router.get("/unreadCount", controller.getUnreadCount);
router.get("/", controller.list);
router.post("/:id/read", controller.markAsRead);
router.post("/:id/read", controller.markAsRead);

export default router;