import { Router } from "express";
import { TeamController } from "../controllers/TeamController";
import { StaffController } from "../controllers/StaffController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/mine", TeamController.getMyTeams);
router.post("/", TeamController.createTeam);

router.get("/:teamId", TeamController.getTeamById);
router.put("/:teamId", TeamController.updateTeam);
router.delete("/:teamId", TeamController.deleteTeam);

router.get("/:teamId/athletes", TeamController.getTeamAthletes);
router.delete("/:teamId/athletes/:userId", TeamController.removeAthlete);
router.put("/:teamId/athletes/:userId", TeamController.updateAthlete);
router.post("/:teamId/athletes/by-email", TeamController.addAthleteByEmail);

router.get("/:teamId/staff", StaffController.getStaff);
router.post("/:teamId/staff", StaffController.addStaff);
router.put("/staff/:staffId", StaffController.updateStaff);
router.delete("/staff/:staffId", StaffController.removeStaff);


export default router;
