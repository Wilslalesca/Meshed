// apps/api/src/routes/index.ts
import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import uploadRoutes from "./upload.routes";
import scheduleRoutes from "./schedule.routes";
import courseRoutes from "./course.routes";
import userCourseRoutes from "./usercourse.routes"; // User-course linking (any user type)
import facilitiesRoutes from "./facilities.routes";
import teamsRoutes from "./teams.routes";
import lookupsRoutes from "./lookup.routes";
import inviteRoutes from "./invites.routes";
import athleteRoutes from "./athletes.routes";
import notificationsRoutes from "./notifications.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/course", courseRoutes);
router.use("/usercourse", userCourseRoutes); // Links users to courses (replaces athlete-specific)
router.use("/facilities", facilitiesRoutes);
router.use("/teams", teamsRoutes);
router.use("/lookups", lookupsRoutes);
router.use("/invites", inviteRoutes);
router.use("/athletes", athleteRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
