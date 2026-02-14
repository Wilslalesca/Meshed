import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/", EventController.getAllEvents);
router.get("/:facilityId", EventController.getFacilityEvents);
router.get("/:facilityId/conflicts", EventController.getConflictingFacilityEvents);
router.get("/:facilityId/:status", EventController.getStatusFacilityEvents);
router.post("/:id/:status", EventController.updateEventStatus);

export default router;