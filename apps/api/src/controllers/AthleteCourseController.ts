import { Request, Response } from "express";
import { z } from "zod";
import { AthleteCourseModel } from "../models/AthleteCourseModel";

const updateSchema = z
  .object({
    athlete_id: z.string(),
    class_id: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  })
  .partial();

export const AthleteCourseController = {
  async update(req: Request, res: Response) {
    try {
      const athleteId = Array.isArray(req.params.athleteId) ? req.params.athleteId[0] : req.params.athleteId;
      const courseId = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
      const parse = updateSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
      }
      const updated = await AthleteCourseModel.updateAthleteCourseTime(courseId, athleteId, parse.data);
      if (!updated) {
        return res.status(404).json({ message: "Athlete-course record not found" });
      }
      res.status(200).json({ message: "Athlete course updated", updated, success: true });
    } catch (err) {
      console.error("Error updating athlete course:", err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
  },

  async delete(req: Request, res: Response) {
    const athleteId = Array.isArray(req.params.athleteId) ? req.params.athleteId[0] : req.params.athleteId;
    const classId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;
    try {
      const deleted = await AthleteCourseModel.deleteAthleteCourseTime(classId, athleteId);
      if (!deleted) {
        return res.status(404).json({ message: "Course not found for athlete", success: false });
      }
      res.status(200).json({ message: "Course removed from athlete schedule", success: true });
    } catch (err) {
      console.error("Error deleting athlete course time:", err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
  },
};
