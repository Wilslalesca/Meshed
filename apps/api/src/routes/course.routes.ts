import express from "express";
import { z } from "zod";
import { db } from "../db/course";

const courseTimeSchema = z.object({
    name: z.string().min(1).max(100),
    course_code: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(100),
    day_of_week: z.string().min(1).max(20),
    start_time: z
    .string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Invalid time format (use like '9:00 AM')").optional(),
  end_time: z
    .string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Invalid time format (use like '1:00 PM')").optional(),
    term: z.string().min(1).max(50),
    start_date:z.string().min(1).max(100),
    end_date:z.string().min(1).max(100),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

export const athleteCourseTimeSchema = z.object({
  athlete_id: z.string(),
  class_id: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const router = express.Router();

const updateCourseSchema = courseTimeSchema.partial(); // allow partial updates

router.patch("/:classId", async (req, res) => {
    try {
        const { classId } = req.params;

        const parse = updateCourseSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
        }

        const updated = await db.updateCourse(classId, parse.data);
        if (!updated) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course updated", course: updated, success: true });
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

router.delete("/:classId", async (req, res) => {
  const { classId } = req.params;

  try {
    const deleted = await db.deleteCourseByID(classId);

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
  res.json({ message: "course route is running!" });
});

export default router;