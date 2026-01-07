import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
router.use(requireAuth);

router.get("/", ScheduleController.health);
router.get("/athlete/:athleteId", ScheduleController.getAthleteSchedule);

export default router;
