import { Request } from "express";
import { AuthedRequest } from "../../src/middleware/authMiddleware";
import type { Role } from "../../src/types/index";

export function attachUser(req: AuthedRequest, overrides: Partial<{id: string; systemRole: Role; organizationId: string; organizationRole: Role;}> = {},): Request {
    req.user = {
        id: "user-1",
        systemRole: "admin" as Role,
        organizationId: "org-1",
        organizationRole: "admin" as Role,
        ...overrides,
    };

    return req;
}

export function makeAuthedRequest(overrides: Partial<Request> = {}): Request {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        cookies: {},
        user: {
            id: "user-1",
            systemRole: "admin",
            organizationId: "org-1",
            organizationRole: "admin",
        },
        ...overrides,
    } as Request;
}
