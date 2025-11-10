import { Router } from "express";
import { CourseController } from "../controllers/CourseController";

const router = Router();

router.post("/coursetime", CourseController.createCourse);
router.post("/athletecoursetime", CourseController.addAthleteCourse);
router.post("/addcourseandathlete", CourseController.addCourseAndAthlete);
router.patch("/:classId", CourseController.updateCourse);
router.delete("/:classId", CourseController.deleteCourse);
router.get("/", (_req, res) => res.json({ message: "course route is running!" }));

export default router;
