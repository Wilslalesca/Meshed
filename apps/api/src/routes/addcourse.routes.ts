import { Router } from 'express';
import { success, z } from 'zod';

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Add course route is running!" });
});

export default router;