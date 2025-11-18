import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/UserModel";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/tokens";
import { config } from "../config/config";
import { sendEmail } from "../services/emailService";
import { VerificationCodeModel } from "../models/VerificationCodeModel";
import { InviteModel } from "../models/InviteModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { stat } from "fs";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "user"]).optional().default("user"),
  invitedToken: z.string().nullable().optional(),
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

    if (!parse.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parse.error.flatten(),
      });
    }

    const { firstName, lastName, email, password, phone, role, invitedToken } =
      parse.data;

    const normalizedEmail = email.toLowerCase();

    const existing = await UserModel.findByEmail(normalizedEmail);

    let user;

    if (existing && !invitedToken) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (existing && invitedToken) {
      await UserModel.setPassword(existing.id, password);

      await UserModel.updateUser(existing.id, {
        first_name: firstName,
        last_name: lastName ?? "",
        phone: phone ?? "",
        role,
    });

      user = await UserModel.findById(existing.id);
    }


    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);

      user = await UserModel.insert({
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        role,
        passwordHash,
      });
    }

    if (!user) {
      return res.status(500).json({ error: "User creation failed" });
    }

 
    if (invitedToken) {
      const invite = await InviteModel.findByToken(invitedToken);

      if (invite) {

        if (invite.role === "manager") {
          const staff = await TeamStaffModel.findStaffRecord(invite.team_id, user.id);
          if (staff) {
            await TeamStaffModel.updateStaff(staff.id, user.id, { role: invite.role, status: "active" });
          } else {
            await TeamRosterModel.updateAthlete(invite.team_id, user.id, { status: "active", position: invite.position ?? null});
          }
        await InviteModel.markAccepted(invite.id);
        }
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCodeModel.create(user.id, code);
    await sendEmail.sendVerificationEmail(user.email, code);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: user.id,
    });
  },

  async login(req: Request, res: Response) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation error', details: parse.error.flatten() });

    const { email, password } = parse.data;
    const user = await UserModel.findByEmail(email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    if (!user.verified){
      return res.status(403).json({ error: "Email not verified", needsVerification: true, userId: user.id });
    }

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

  async verify(req: Request, res: Response) {
    const { userId, code } = req.body;
    const record = await VerificationCodeModel.findValid(userId, code);

    if (!record) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    await VerificationCodeModel.markUsed(record.id);

    await UserModel.activateUser(userId);

  
    const newAccess = signAccessToken(userId, user.role);
    const newRefresh = signRefreshToken(userId, user.role);
    res.cookie("refresh_token", newRefresh, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.json({ message: "Email verified successfully", token: newAccess } );
  },

  async resendVerification(req: Request, res: Response) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    await VerificationCodeModel.invalidateAllForUser(userId);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCodeModel.create(userId, code);

    await sendEmail.sendVerificationEmail(user.email, code);

    return res.json({ message: "Verification email resent successfully" });
  },


};
