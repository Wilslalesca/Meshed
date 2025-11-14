import { Router } from "express";
import { FacilityController } from "../controllers/FacilityController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

// must be logged in AND have the correct role
router.use(requireAuth);
router.use(requireRole(["admin", "manager"]));

router.get("/", FacilityController.list);
router.post("/", FacilityController.create);

export default router;
