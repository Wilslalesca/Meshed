import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/", EventController.getAllEvents);

export default router;