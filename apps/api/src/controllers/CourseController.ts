import { Request, Response } from "express";
import { z } from "zod";
import { CourseModel } from "../models/CourseModel";
import { AthleteCourseModel } from "../models/AthleteCourseModel";
import { pool } from "../config/db";
import { parse } from "path";

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
  start_date: z.string().min(1).max(100),
  end_date: z.string().min(1).max(100),
  recurring: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

const athleteCourseTimeSchema = z.object({
  athlete_id: z.string(),
  class_id: z.string(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
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
    const parse = athleteCourseTimeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }
    try {
      await AthleteCourseModel.insert(parse.data);
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

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const course = await CourseModel.insertCourse(parseCourse.data, client);
      await AthleteCourseModel.insert(
        { athlete_id: user_id, class_id: course.id },
        client
      );
      await client.query("COMMIT");
      res.status(200).json({
        success: true,
        message: "Added course and linked athlete",
        course,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error adding course and athlete:", err);
      res.status(500).json({ success: false, message: "Transaction failed" });
    } finally {
      client.release();
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

      // Notify all athletes linked to this course about the update
      try {
        const athleteIds = await AthleteCourseModel.getAthletesForClass(classId);
        for (const athleteId of athleteIds) {
          // Fetch user account to get email
          // athlete_profiles id equals users.id
          const userRes = await pool.query(
            `SELECT id, email, first_name, last_name FROM users WHERE id = $1 LIMIT 1`,
            [athleteId]
          );
          const user = userRes.rows[0];
          if (user?.email) {
            // Create UI notification
            const { NotificationModel } = await import("../models/NotificationModel");
            await NotificationModel.create(
              user.id,
              "schedule_update",
              `Your schedule item '${updated.name ?? updated.course_code ?? "Course"}' was updated.`,
              { classId, updated }
            );
            // Send email notification
            await import("../services/emailService").then(({ sendEmail }) =>
              sendEmail.sendScheduleUpdatedEmail(user.email, updated.name ?? updated.course_code ?? "Course")
            );
          }
        }
      } catch (notifyErr) {
        console.warn("Notification dispatch failed:", notifyErr);
      }

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
