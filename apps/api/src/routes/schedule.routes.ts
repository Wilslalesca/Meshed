import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController";

const router = Router();

router.get("/", ScheduleController.health);
router.get("/athlete/:athleteId", ScheduleController.getAthleteSchedule);

export default router;
