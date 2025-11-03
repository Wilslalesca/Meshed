import express from "express";
import { z } from "zod";
import { db } from "../db/athletecoursetime";

export const athleteCourseTimeSchema = z.object({
  athlete_id: z.string(),
  class_id: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const router = express.Router();

const updateCourseSchema = athleteCourseTimeSchema.partial(); // allow partial updates

router.patch("/:athleteId/:courseId", async (req, res) => {
    try {
      const { athleteId, courseId } = req.params;

      const parse = updateCourseSchema.safeParse(req.body);
      if (!parse.success) {
        return res
          .status(400)
          .json({ error: "Validation error", details: parse.error.flatten() });
      }

      const updated = await db.updateAthleteCourseTime(courseId, athleteId, parse.data);

      if (!updated) {
        return res.status(404).json({ message: "Athlete-course record not found" });
      }

      res.status(200).json({ message: "Athlete course updated", updated, success: true });
    } catch (err) {
      console.error("Error updating athlete course:", err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
});


router.delete("/:athleteId/:classId", async (req, res) => {
  const { athleteId, classId } = req.params;

  try {
    const deleted = await db.deleteAthleteCourseTime(classId, athleteId);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found for athlete", success: false });
    }

    res.status(200).json({ message: "Course removed from athlete schedule", success: true });
  } catch (err) {
    console.error("Error deleting athlete course time:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.get("/", (_req, res) => {
  res.json({ message: "athlete course route is running!" });
});

export default router;