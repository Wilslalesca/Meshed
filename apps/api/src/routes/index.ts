// apps/api/src/routes/index.ts
import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import uploadRoutes from "./upload.routes";
import scheduleRoutes from "./schedule.routes";
import courseRoutes from "./course.routes";
import athleteCourseRoutes from "./athletecourse.routes";
import facilitiesRoutes from "./facilities.routes";
import teamsRoutes from "./teams.routes";
import lookupsRoutes from "./lookup.routes";
import inviteRoutes from "./invites.routes";
import athleteRoutes from "./athletes.routes";
import eventRoutes from "./event.routes";
import notificationsRoutes from "./notifications.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/course", courseRoutes);
router.use("/athletecourse", athleteCourseRoutes);
router.use("/facilities", facilitiesRoutes);
router.use("/teams", teamsRoutes);
router.use("/events", eventRoutes);
router.use("/lookups", lookupsRoutes);
router.use("/invites", inviteRoutes);
router.use("/athletes", athleteRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
