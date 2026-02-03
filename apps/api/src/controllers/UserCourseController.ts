/**
 * UserCourseController — Generalized controller for user-course links.
 *
 * This controller uses UserCourseModel (direct table access) instead of
 * AthleteCourseModel (legacy view). Prefer these endpoints for new clients.
 *
 * Endpoints:
 *   POST   /             — Link a user to a course
 *   PATCH  /:linkId      — Update a link (e.g., change meta)
 *   DELETE /:userId/:classId — Remove a link by user + course
 *   GET    /user/:userId — Get all courses for a user
 *   GET    /class/:classId — Get all users for a course
 */
import { Request, Response } from "express";
import { z } from "zod";
import { UserCourseModel } from "../models/UserCourseModel";

// Validation schema for creating a user-course link
const createLinkSchema = z.object({
  user_id: z.string().uuid("user_id must be a valid UUID"),
  class_id: z.string().uuid("class_id must be a valid UUID"),
  // Optional JSONB for sector-specific metadata (role context, notes, overrides)
  meta: z.record(z.string(), z.any()).optional(),
});

// Partial schema for updates
const updateLinkSchema = createLinkSchema.partial();

export const UserCourseController = {
  /**
   * POST / — Create a new user-course link.
   * If the link already exists (UNIQUE constraint), upserts metadata.
   */
  async create(req: Request, res: Response) {
    const parse = createLinkSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parse.error.flatten(),
      });
    }

    try {
      const link = await UserCourseModel.insert(parse.data);
      return res.status(201).json({
        success: true,
        message: "User linked to course",
        link,
      });
    } catch (err) {
      console.error("Error creating user-course link:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  /**
   * PATCH /:linkId — Update an existing link's fields (user_id, class_id, meta).
   */
  async update(req: Request, res: Response) {
    const { linkId } = req.params;
    const parse = updateLinkSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parse.error.flatten(),
      });
    }

    try {
      const updated = await UserCourseModel.update(linkId, parse.data);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Link not found or no fields to update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Link updated",
        link: updated,
      });
    } catch (err) {
      console.error("Error updating user-course link:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  /**
   * DELETE /:userId/:classId — Remove a user-course link.
   */
  async delete(req: Request, res: Response) {
    const { userId, classId } = req.params;

    try {
      const deleted = await UserCourseModel.delete(userId, classId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Link not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Link removed",
      });
    } catch (err) {
      console.error("Error deleting user-course link:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  /**
   * GET /user/:userId — Retrieve all courses linked to a user (their schedule).
   * Returns full course_times details plus link-level meta.
   */
  async getByUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const courses = await UserCourseModel.getCoursesForUser(userId);
      return res.status(200).json({
        success: true,
        count: courses.length,
        courses,
      });
    } catch (err) {
      console.error("Error fetching user courses:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  /**
   * GET /class/:classId — Retrieve all user IDs linked to a course.
   * Useful for notifications or checking enrollment.
   */
  async getByClass(req: Request, res: Response) {
    const { classId } = req.params;

    try {
      const userIds = await UserCourseModel.getUsersForClass(classId);
      return res.status(200).json({
        success: true,
        count: userIds.length,
        user_ids: userIds,
      });
    } catch (err) {
      console.error("Error fetching class users:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  /**
   * Health check endpoint.
   */
  async health(_req: Request, res: Response) {
    return res.json({ message: "User-course route is running!" });
  },
};
