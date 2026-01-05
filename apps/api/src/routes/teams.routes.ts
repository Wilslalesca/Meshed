import { Router } from "express";
import multer from 'multer';
import { TeamController } from "../controllers/TeamController";
import { StaffController } from "../controllers/StaffController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

router.get("/:teamId/staff", StaffController.getStaff);
router.post("/:teamId/staff", StaffController.addStaff);
router.put("/:teamId/staff/:staffId", StaffController.updateStaff);
router.delete("/:teamId/staff/:staffId", StaffController.removeStaff);

router.get("/:teamId/athletes", TeamController.getTeamAthletes);
router.post("/:teamId/athletes/by-email", TeamController.addAthleteByEmail);
router.post("/:teamId/athletes/bulk-upload", upload.single("file"), TeamController.bulkAddAthletesByCsv);
router.put("/:teamId/athletes/:userId", TeamController.updateAthlete);
router.delete("/:teamId/athletes/:userId", TeamController.removeAthlete);

router.get("/mine", TeamController.getMyTeams); 
router.post("/", TeamController.createTeam);

router.get("/:teamId", TeamController.getTeamById);
router.put("/:teamId", TeamController.updateTeam);
router.delete("/:teamId", TeamController.deleteTeam);

export default router;