import { Router } from 'express';
import { optimizeScheduleController } from '../controllers/Optimization.controller';
import { requireAuth, requireOrganization } from '../middleware/authMiddleware';

export const router = Router();
router.use(requireAuth);
router.use(requireOrganization);
router.post("/run", optimizeScheduleController);

export default router;