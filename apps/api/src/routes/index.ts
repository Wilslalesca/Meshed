import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import uploadRoutes from "./upload.routes";
import scheduleRoutes from "./schedule.routes";
import courseRoutes from "./course.routes";
import athleteCourseRoutes from "./athletecourse.routes";
import facilitiesRoutes from "./facilities.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/course", courseRoutes);
router.use("/athletecourse", athleteCourseRoutes);
router.use("/facilities", facilitiesRoutes);

export default router;
