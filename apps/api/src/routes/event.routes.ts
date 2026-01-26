import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/", EventController.getAllEvents);
router.get("/:facilityId", EventController.getFacilityEvents);
router.get("/:facilityId/conflicts", EventController.getConflictingFacilityEvents);
router.get("/:facilityId/pending", EventController.getPendingFacilityEvents);

export default router;