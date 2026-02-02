import { Request, Response } from "express";
import { z } from "zod";
import { CourseModel } from "../models/CourseModel";
import { UserCourseModel } from "../models/UserCourseModel";
import { pool } from "../config/db";

/**
 * Validation schema for creating a course/schedule item.
 */
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
  meta: z.record(z.any()).optional(), // Optional JSONB for sector-specific fields
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

/**
 * Validation schema for linking a user to a course.
 */
const userCourseTimeSchema = z.object({
  user_id: z.string().uuid("user_id must be a valid UUID"),
  class_id: z.string().uuid("class_id must be a valid UUID"),
  meta: z.record(z.any()).optional(), // Optional link-level metadata
});

const updateCourseSchema = courseTimeSchema.partial();

export const CourseController = {
  /**
   * POST /course/coursetime — Create a new course/schedule item.
   */
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

  /**
   * POST /course/usercoursetime — Link a user to an existing course.
   * Works for any user type (athlete, patient, customer, etc.)
   */
  async addUserCourse(req: Request, res: Response) {
    const parse = userCourseTimeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }
    try {
      const link = await UserCourseModel.insert(parse.data);
      return res.status(200).json({
        message: "Linked user to course",
        link,
        success: true,
      });
    } catch (err) {
      console.error("Error linking user to course:", err);
      return res.status(500).json({ message: "Internal server error", success: false });
    }
  },

  /**
   * POST /course/addcourseanduser — Create a course AND link it to a user in one transaction.
   * Replaces the old addCourseAndAthlete endpoint.
   */
  async addCourseAndUser(req: Request, res: Response) {
    const { user_id, coursetimedata, link_meta } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    
    const parseCourse = courseTimeSchema.safeParse(coursetimedata);
    if (!parseCourse.success) {
      return res.status(400).json({ error: "Validation error", details: parseCourse.error.flatten() });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      // Create the course
      const course = await CourseModel.insertCourse(parseCourse.data, client);
      
      // Link the user to the course
      await UserCourseModel.insert(
        { user_id, class_id: course.id, meta: link_meta },
        client
      );
      
      await client.query("COMMIT");
      res.status(200).json({
        success: true,
        message: "Added course and linked user",
        course,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error adding course and user:", err);
      res.status(500).json({ success: false, message: "Transaction failed" });
    } finally {
      client.release();
    }
  },

  /**
   * PATCH /course/:classId — Update a course. Notifies all linked users.
   */
  async updateCourse(req: Request, res: Response) {
    const { classId } = req.params;

    const parse = updateCourseSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Validation error", details: parse.error.flatten() });
    }

    try {
      const updated = await CourseModel.updateCourse(classId, parse.data);
      if (!updated) return res.status(404).json({ message: "Course not found" });

      // Notify all users linked to this course about the update
      try {
        const userIds = await UserCourseModel.getUsersForClass(classId);
        for (const userId of userIds) {
          const userRes = await pool.query(
            `SELECT id, email, first_name, last_name FROM users WHERE id = $1 LIMIT 1`,
            [userId]
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

  /**
   * DELETE /course/:classId — Delete a course (cascades to user links).
   */
  async deleteCourse(req: Request, res: Response) {
    const { classId } = req.params;
    try {
      const deleted = await CourseModel.deleteCourseByID(classId);
      if (!deleted) {
        return res.status(404).json({ message: "Course not found", success: false });
      }
      res.status(200).json({ message: "Course deleted", success: true });
    } catch (err) {
      console.error("Error deleting course:", err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
  },
};
