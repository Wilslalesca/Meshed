import { Router } from 'express';
import { requireAuth, requireRole, AuthedRequest } from '../middleware/auth';
import { db } from '../db';


const router = Router();


router.get('/me', requireAuth, (req: AuthedRequest, res) => {
    const user = db.findById(req.user!.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});


router.get('/admin/ping', requireAuth, requireRole('admin'), (_req, res) => {
    res.json({ ok: true, msg: 'admin ok' });
});


router.get('/manager/ping', requireAuth, requireRole(['manager','admin']), (_req, res) => {
    res.json({ ok: true, msg: 'manager ok' });
});


export default router;