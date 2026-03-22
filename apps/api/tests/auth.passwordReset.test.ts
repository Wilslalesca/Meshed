import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Ensure required env vars exist before importing the controller (config.ts exits if missing).
process.env.JWT_ACCESS_SECRET ??= "test-access-secret";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret";
process.env.DATABASE_URL ??= "postgres://user:password@localhost:5432/test";
process.env.SMTP_HOST ??= "smtp.example.com";
process.env.SMTP_PORT ??= "587";
process.env.SMTP_USER ??= "test@example.com";
process.env.SMTP_PASS ??= "test-password";
process.env.MAIL_FROM ??= "test@example.com";

vi.mock("../src/models/UserModel", () => ({
  UserModel: {
    findByEmail: vi.fn(),
    setPassword: vi.fn(),
  },
}));

vi.mock("../src/models/PasswordResetCodeModel", () => ({
  PasswordResetCodeModel: {
    invalidateAllForUser: vi.fn(),
    create: vi.fn(),
    findValid: vi.fn(),
    markUsed: vi.fn(),
  },
}));

vi.mock("../src/services/emailService", () => ({
  sendEmail: {
    sendPasswordResetEmail: vi.fn(),
    sendVerificationEmail: vi.fn(),
    sendEmailInvite: vi.fn(),
    sendAddedToTeamEmail: vi.fn(),
  },
}));

import { UserModel } from "../src/models/UserModel";
import { PasswordResetCodeModel } from "../src/models/PasswordResetCodeModel";
import { sendEmail } from "../src/services/emailService";
import type { Request, Response } from "express";

let AuthController: typeof import("../src/controllers/AuthController").AuthController;

function makeRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

beforeAll(async () => {
  ({ AuthController } = await import("../src/controllers/AuthController"));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthController forgot/reset password", () => {
  it("forgotPassword returns a generic success message for unknown emails", async () => {
    vi.mocked(UserModel.findByEmail).mockResolvedValue(null);

    const req = {
      body: { email: "unknown@example.com" },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.forgotPassword(req, res as unknown as Response);

    expect(UserModel.findByEmail).toHaveBeenCalledWith("unknown@example.com");
    expect(PasswordResetCodeModel.invalidateAllForUser).not.toHaveBeenCalled();
    expect(PasswordResetCodeModel.create).not.toHaveBeenCalled();
    expect(sendEmail.sendPasswordResetEmail).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message:
        "If an account exists for that email, a password reset code has been sent.",
    });
  });

  it("forgotPassword creates a 6-digit code and emails it for known users", async () => {
    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    });

    vi.mocked(PasswordResetCodeModel.invalidateAllForUser).mockResolvedValue(
      undefined
    );
    vi.mocked(PasswordResetCodeModel.create).mockResolvedValue(undefined);
    vi.mocked(sendEmail.sendPasswordResetEmail).mockResolvedValue(undefined);

    const req = {
      body: { email: "User@Example.com" },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.forgotPassword(req, res as unknown as Response);

    expect(UserModel.findByEmail).toHaveBeenCalledWith("user@example.com");
    expect(PasswordResetCodeModel.invalidateAllForUser).toHaveBeenCalledWith(
      "user-1"
    );
    expect(PasswordResetCodeModel.create).toHaveBeenCalledTimes(1);

    const createdCode = vi.mocked(PasswordResetCodeModel.create).mock.calls[0]?.[1];
    expect(createdCode).toMatch(/^\d{6}$/);

    expect(sendEmail.sendPasswordResetEmail).toHaveBeenCalledWith(
      "user@example.com",
      createdCode
    );

    expect(res.json).toHaveBeenCalledWith({
      message:
        "If an account exists for that email, a password reset code has been sent.",
    });
  });

  it("resetPassword rejects invalid payloads (zod validation)", async () => {
    const req = {
      body: { email: "user@example.com", code: "123", newPassword: "short" },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.resetPassword(req, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Validation error" })
    );
  });

  it("resetPassword rejects unknown emails", async () => {
    vi.mocked(UserModel.findByEmail).mockResolvedValue(null);

    const req = {
      body: {
        email: "unknown@example.com",
        code: "123456",
        newPassword: "new-password-123",
      },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.resetPassword(req, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired reset code",
    });
  });

  it("resetPassword rejects invalid/expired codes", async () => {
    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    });

    vi.mocked(PasswordResetCodeModel.findValid).mockResolvedValue(null);

    const req = {
      body: {
        email: "USER@EXAMPLE.COM",
        code: "123456",
        newPassword: "new-password-123",
      },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.resetPassword(req, res as unknown as Response);

    expect(UserModel.findByEmail).toHaveBeenCalledWith("user@example.com");
    expect(PasswordResetCodeModel.findValid).toHaveBeenCalledWith(
      "user-1",
      "123456"
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired reset code",
    });
  });

  it("resetPassword marks code used and updates password when valid", async () => {
    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    });

    vi.mocked(PasswordResetCodeModel.findValid).mockResolvedValue({
      id: "reset-1",
      user_id: "user-1",
      code: "123456",
      used: false,
    });

    vi.mocked(PasswordResetCodeModel.markUsed).mockResolvedValue(undefined);
    vi.mocked(UserModel.setPassword).mockResolvedValue(undefined);

    const req = {
      body: {
        email: "USER@EXAMPLE.COM",
        code: "123456",
        newPassword: "new-password-123",
      },
    } as unknown as Request;
    const res = makeRes();

    await AuthController.resetPassword(req, res as unknown as Response);

    expect(PasswordResetCodeModel.markUsed).toHaveBeenCalledWith("reset-1");
    expect(UserModel.setPassword).toHaveBeenCalledWith(
      "user-1",
      "new-password-123"
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Password reset successfully",
    });
  });
});
