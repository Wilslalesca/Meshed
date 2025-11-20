import { Router } from "express";
import { AthleteController } from "../controllers/AthleteController";

const router = Router();

router.get("/:athleteId", AthleteController.getAthlete);

export default router;
