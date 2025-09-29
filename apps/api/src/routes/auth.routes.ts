import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { Role, User } from '../types';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../auth/tokens';
import { config } from '../config';
import { nanoid } from 'nanoid';



const router = Router();


const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin','manager','user']).optional().default('user')
});


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});


const cookieOpts = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax' as const,
    domain: config.cookieDomain,
    path: '/auth/refresh'
};

router.post('/register', async (req, res) => {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });
    const { name, email, password, role } = parse.data;
    const existing = db.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });


    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const user: User = { id: nanoid(), name, email, role: role as Role, passwordHash, createdAt: now, updatedAt: now };
    db.insert(user);


    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);
    res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge: 7*24*60*60*1000 });
    return res.status(201).json({ token: accessToken, user: { id: user.id, name, email, role: user.role } });
});


router.post('/login', async (req, res) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });
    const { email, password } = parse.data;
    const user = db.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });


    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);
    res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge: 7*24*60*60*1000 });
    return res.json({ token: accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});


router.post('/logout', async (_req, res) => {
    res.clearCookie('refresh_token', { ...cookieOpts, maxAge: 0 });
    return res.json({ ok: true });
});

router.post('/refresh', async (req, res) => {
    const token = req.cookies?.['refresh_token'];
    if (!token) {
        return res.status(401).json({ error: 'Missing refresh token' });
    }
    try {
        const payload = verifyRefresh(token);
        const user = db.findById(payload.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newRefresh = signRefreshToken(user.id, user.role);
        res.cookie('refresh_token', newRefresh, { ...cookieOpts, maxAge: 7*24*60*60*1000 });
        
        const newAccess = signAccessToken(user.id, user.role);
        return res.json({ token: newAccess, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } 
    catch {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});


export default router;