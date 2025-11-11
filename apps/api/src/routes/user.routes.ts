import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/me", requireAuth, UserController.me);
router.get("/admin/ping", requireAuth, requireRole("admin"), UserController.adminPing);
router.get("/manager/ping", requireAuth, requireRole(["manager", "admin"]), UserController.managerPing);
router.patch("/:userId", UserController.updateUser);

export default router;