import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// ALL team routes require login
router.use(requireAuth);

router.get("/mine", TeamController.getMyTeams);
router.post("/", TeamController.createTeam);

router.get("/:teamId/athletes", TeamController.getTeamAthletes);
router.post("/:teamId/athletes", TeamController.addAthleteToTeam);

export default router;
