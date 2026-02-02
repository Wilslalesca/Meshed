/**
 * User-Course Routes — Generalized endpoints for linking users to courses.
 *
 * These routes use UserCourseModel (direct table access) and should be
 * preferred over /athletecourse routes for new clients. The legacy
 * /athletecourse routes remain functional via the view + triggers.
 *
 * Endpoints:
 *   GET    /                    — Health check
 *   POST   /                    — Link a user to a course
 *   PATCH  /:linkId             — Update a link
 *   DELETE /:userId/:classId    — Remove a link
 *   GET    /user/:userId        — Get all courses for a user
 *   GET    /class/:classId      — Get all users for a course
 */
import { Router } from "express";
import { UserCourseController } from "../controllers/UserCourseController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Health check
router.get("/", UserCourseController.health);

// Create a user-course link
// Body: { user_id, class_id, meta? }
router.post("/", UserCourseController.create);

// Update a link by its ID
// Body: { user_id?, class_id?, meta? }
router.patch("/:linkId", UserCourseController.update);

// Delete a link by user + class
router.delete("/:userId/:classId", UserCourseController.delete);

// Get all courses for a specific user (their schedule)
router.get("/user/:userId", UserCourseController.getByUser);

// Get all users linked to a specific course
router.get("/class/:classId", UserCourseController.getByClass);

export default router;
