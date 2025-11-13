import { Router } from 'express';
import { requireAuth, requireRole, AuthedRequest } from '../middleware/auth';
import { db } from '../db/users';


const router = Router();


router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await db.findById(req.user!.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    active: user.active,
    verified: user.verified,
  });
});


router.get('/admin/ping', requireAuth, requireRole('admin'), (_req, res) => {
    res.json({ ok: true, msg: 'admin ok' });
});


router.get('/manager/ping', requireAuth, requireRole(['manager','admin']), (_req, res) => {
    res.json({ ok: true, msg: 'manager ok' });
});


export default router;