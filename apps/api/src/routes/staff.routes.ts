import { Router } from "express";
import { StaffController } from "../controllers/StaffController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);
router.get("/:teamId", StaffController.getStaff);
router.post("/:teamId", StaffController.addStaff);
router.put("/update/:staffId", StaffController.updateStaff);
router.delete("/remove/:staffId", StaffController.removeStaff);

export default router;
