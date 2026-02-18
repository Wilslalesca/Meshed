import { Router } from 'express';
import { optimizeScheduleController } from '../controllers/Optimization.controller';
import { requireAuth } from '../middleware/authMiddleware';

export const router = Router();
router.use(requireAuth);
router.post("/run", optimizeScheduleController);

export default router;