import { Router } from "express";
import { CourseController } from "../controllers/CourseController";

const router = Router();

// Create a course/schedule item
router.post("/coursetime", CourseController.createCourse);

// Link any user to an existing course
router.post("/usercoursetime", CourseController.addUserCourse);

// Create a course AND link a user in one transaction
router.post("/addcourseanduser", CourseController.addCourseAndUser);

// Update a course (notifies all linked users)
router.patch("/:classId", CourseController.updateCourse);

// Delete a course (cascades to user links)
router.delete("/:classId", CourseController.deleteCourse);

// Health check
router.get("/", (_req, res) => res.json({ message: "course route is running!" }));

export default router;
