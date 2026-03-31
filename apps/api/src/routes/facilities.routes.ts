import { Router } from "express";
import { FacilityController } from "../controllers/FacilityController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/", FacilityController.list);
router.post("/", requireRole(["admin", "manager"]), FacilityController.create);

export default router;