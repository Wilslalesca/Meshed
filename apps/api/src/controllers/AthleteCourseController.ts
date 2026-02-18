import { Request, Response } from "express";
import { z } from "zod";
import { UserEventModel } from "../models/UserEventModel";

const updateSchema = z
  .object({
    user_id: z.string().uuid().optional(),
    athlete_id: z.string().uuid().optional(),
    class_id: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  })
  .partial();

export const AthleteCourseController = {
  async update(req: Request, res: Response) {
    try {
      const { athleteId, courseId } = req.params;
      const parse = updateSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
      }
      // The web client uses this endpoint primarily to ensure the link row exists.
      // Treat PATCH as a "touch" that bumps updated_at.
      const updated = await UserEventModel.updateUserEvent(courseId, athleteId, {});
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
    const { athleteId, classId } = req.params;
    try {
      const deleted = await UserEventModel.deleteUserEvent(classId, athleteId);
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
