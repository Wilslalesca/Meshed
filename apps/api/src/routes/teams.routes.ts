import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/mine", TeamController.getMyTeams);
router.post("/", TeamController.createTeam);

router.get("/:teamId", TeamController.getTeamById);
router.put("/:teamId", TeamController.updateTeam);
router.delete("/:teamId", TeamController.deleteTeam);

router.get("/:teamId/athletes", TeamController.getTeamAthletes);
router.post("/:teamId/athletes/by-email", TeamController.addAthleteByEmail);
router.delete("/:teamId/athletes/:userId", TeamController.removeAthlete);

router.get("/:teamId/staff", TeamController.getStaff);
router.post("/:teamId/staff", TeamController.addStaff);
router.put("/staff/:staffId", TeamController.updateStaff);
router.delete("/staff/:staffId", TeamController.deleteStaff);
router.delete("/:teamId/athletes/:userId", TeamController.removeAthlete);


export default router;
