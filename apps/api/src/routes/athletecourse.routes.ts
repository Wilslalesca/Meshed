import { Router } from "express";
import { AthleteCourseController } from "../controllers/AthleteCourseController";

const router = Router();

router.patch("/:athleteId/:courseId", AthleteCourseController.update);
router.delete("/:athleteId/:classId", AthleteCourseController.delete);
router.get("/", (_req, res) => res.json({ message: "athlete course route is running!" }));

export default router;
