import { Router } from "express";
import { AthleteController } from "../controllers/AthleteController";
import { requireAuth, requireOrganization,  } from "../middleware/authMiddleware";

const router = Router();
router.use(requireAuth);
router.use(requireOrganization);

router.get("/:athleteId", AthleteController.getAthlete);

export default router;
