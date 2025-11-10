import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/UserModel";
import { AthleteProfileModel } from "../models/AthleteProfileModel";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/tokens";
import { config } from "../config/config";

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
  password: z.string().min(1),
});

const cookieOpts = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax" as const,
  domain: config.cookieDomain,
  path: "/auth/refresh",
};

export const AuthController = {

  async register(req: Request, res: Response) {

    const parse = registerSchema.safeParse(req.body);

    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

    const { firstName, lastName, email, password, phone, role } = parse.data;

    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.insert({ firstName, lastName, email, phone, role, passwordHash });

    if (user.role === "user") {
      try {
        await AthleteProfileModel.create({ id: user.id });
      } catch (err) {
        console.error("Error creating athlete profile:", err);
      }
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    res.cookie("refresh_token", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({ token: accessToken, user });
  },

  async login(req: Request, res: Response) {
    const parse = loginSchema.safeParse(req.body);
    
    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });


    const { email, password } = parse.data;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    res.cookie("refresh_token", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.json({ token: accessToken, user });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("refresh_token", { ...cookieOpts, maxAge: 0 });
    return res.json({ ok: true });
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.["refresh_token"];
    if (!token) return res.status(401).json({ error: "Missing refresh token" });

    try {
      const payload = verifyRefresh(token);
      const user = await UserModel.findById(payload.userId);
      if (!user) return res.status(401).json({ error: "Invalid refresh token" });

      const newRefresh = signRefreshToken(user.id, user.role);
      res.cookie("refresh_token", newRefresh, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

      const newAccess = signAccessToken(user.id, user.role);
      return res.json({ token: newAccess, user });
    } catch {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  },
};
