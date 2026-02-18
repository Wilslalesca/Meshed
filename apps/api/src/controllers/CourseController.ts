import { Request, Response } from "express";
import { z } from "zod";
import { CourseModel } from "../models/CourseModel";
import { UserEventModel } from "../models/UserEventModel";

const courseTimeSchema = z.object({
  user_id: z.string().uuid().optional(),  // Owner/creator of the course
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
  start_date: z.string().min(1).max(100),
  end_date: z.string().min(1).max(100),
  recurring: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const userEventSchema = z
  .object({
    user_id: z.string().uuid().optional(),
    athlete_id: z.string().uuid().optional(),
    class_id: z.string().uuid(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  })
  .refine((v) => Boolean(v.user_id || v.athlete_id), {
    message: "user_id (or legacy athlete_id) is required",
  });

const updateCourseSchema = courseTimeSchema.partial();

export const CourseController = {
  async createCourse(req: Request, res: Response) {
    const parse = courseTimeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }
    try {
      const course = await CourseModel.insertCourse(parse.data);
      return res.status(200).json({
        message: "Added Course to DB",
        course_time: course,
        success: true,
      });
    } catch (err) {
      console.error("Error adding course", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async addAthleteCourse(req: Request, res: Response) {
    const parse = userEventSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }
    try {
      const userId = parse.data.user_id ?? parse.data.athlete_id;
      await UserEventModel.insert({ user_id: userId, class_id: parse.data.class_id });
      return res.status(200).json({ message: "Connected Course to Athlete", success: true });
    } catch (err) {
      console.error("Error adding course to athlete schedule:", err);
      return res.status(500).json({ message: "Internal server error", success: false });
    }
  },

  async addCourseAndAthlete(req: Request, res: Response) {
    const { user_id, coursetimedata } = req.body;
    const parseCourse = courseTimeSchema.safeParse(coursetimedata);
    if (!parseCourse.success) {
      return res.status(400).json({ error: "Validation error", details: parseCourse.error.flatten() });
    }

    try {
      const course = await CourseModel.insertCourseAndLinkUser(parseCourse.data, user_id);
      res.status(200).json({
        success: true,
        message: "Added course and linked athlete",
        course,
      });
    } catch (err) {
      console.error("Error adding course and athlete:", err);
      res.status(500).json({ success: false, message: "Transaction failed" });
    }
  },

  async updateCourse(req: Request, res: Response) {
    const { classId } = req.params;

    const parse = updateCourseSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }

    try {
      const updated = await CourseModel.updateCourse(classId, parse.data);
      if (!updated) return res.status(404).json({ message: "Course not found" });

      res.status(200).json({ message: "Course updated", course: updated, success: true });
    } catch (err) {
      console.error("Error updating course:", err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
  },

  async deleteCourse(req: Request, res: Response) {
    const { classId } = req.params;
    try {
      const deleted = await CourseModel.deleteCourseByID(classId);
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
