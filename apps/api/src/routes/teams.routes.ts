import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/mine", TeamController.getMyTeams);
router.post("/", TeamController.createTeam);

router.get("/:teamId/athletes", TeamController.getTeamAthletes);
router.post("/:teamId/athletes", TeamController.addAthleteToTeam);
router.post("/:teamId/athletes/by-email", TeamController.addAthleteByEmail); // ← NEW

export default router;
