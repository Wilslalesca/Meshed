import request from "supertest";
import bcrypt from "bcryptjs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import { AuthController } from "../src/controllers/AuthController";

// Mock dependencies
vi.mock("../models/UserModel", () => ({
  UserModel: {
    findByEmailWithMembership: vi.fn(),
  },
}));

vi.mock("../utils/tokens", () => ({
  signAccessToken: vi.fn(() => "mock-access-token"),
  signRefreshToken: vi.fn(() => "mock-refresh-token"),
  verifyRefresh: vi.fn(),
}));

vi.mock("../config/config", () => ({
  config: {
    nodeEnv: "test",
    cookieDomain: undefined,
  },
}));

import { UserModel } from "../src/models/UserModel";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.post("/auth/login", AuthController.login);

  return app;
}

describe("AuthController.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and token for valid credentials", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);

    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      verified: true,
      passwordHash,
      role: "user",
      organizationId: "org-1",
      organizationRole: "admin",
    } as any);

    const app = makeApp();

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("mock-access-token");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 403 for unverified user", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);

    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      verified: false,
      passwordHash,
      role: "user",
      organizationId: "org-1",
      organizationRole: "admin",
    } as any);

    const app = makeApp();

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(403);
    expect(res.body.needsVerification).toBe(true);
  });

  it("returns 401 for wrong password", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);

    vi.mocked(UserModel.findByEmail).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      verified: true,
      passwordHash,
      role: "user",
      organizationId: "org-1",
      organizationRole: "admin",
    } as any);

    const app = makeApp();

    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "wrong-password",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });
});