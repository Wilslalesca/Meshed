import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db/users';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../auth/tokens';
import { config } from '../config';



const router = Router();

// Schemas
// ==============================
const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "user"]).optional().default("user"),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});


// Cookie options
// ==============================
const cookieOpts = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax' as const,
    domain: config.cookieDomain,
    path: '/auth/refresh'
};


// Register Route - /auth/register
// =============================
router.post('/register', async (req, res) => {
    const parse = registerSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

    const { firstName, lastName, email, password, phone, role } = parse.data;

    const existing = await db.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.insert({ firstName, lastName, email, phone, role, passwordHash });

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    res.cookie("refresh_token", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({
        token: accessToken,
        user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        verified: user.verified,
        },
    });
});

// Login Route - /auth/login
// =============================
router.post('/login', async (req, res) => {
    const parse = loginSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });


    const { email, password } = parse.data;
    const user = await db.findByEmail(email);


    if (!user) return res.status(401).json({ error: 'Invalid email or password' });


    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });


    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);


    res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge: 7*24*60*60*1000 });

    return res.json({
        token: accessToken,
        user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        verified: user.verified,
        },
    });
});

// Logout Route - /auth/logout
// =============================
router.post('/logout', async (_req, res) => {
    res.clearCookie('refresh_token', { ...cookieOpts, maxAge: 0 });
    return res.json({ ok: true });
});

// Token Refresh Route - /auth/refresh
// =============================
router.post("/refresh", async (req, res) => {
  const token = req.cookies?.["refresh_token"];
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const payload = verifyRefresh(token);
    const user = await db.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });

    const newRefresh = signRefreshToken(user.id, user.role);
    res.cookie("refresh_token", newRefresh, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    const newAccess = signAccessToken(user.id, user.role);
    return res.json({
      token: newAccess,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        verified: user.verified,
      },
    });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});



export default router;