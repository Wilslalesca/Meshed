import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";
import { JWTPayload, Role } from "../types/index";
import { nanoid } from "nanoid";

export function signAccessToken(userId: string, systemRole: Role, organizationId: string, organizationRole: Role) {
    const payload: JWTPayload = { userId, systemRole, organizationId, organizationRole };
    return jwt.sign(payload, config.accessSecret, {
        expiresIn: config.accessTtl,
    } as SignOptions);
}

export function signRefreshToken(userId: string, systemRole: Role, organizationId: string, organizationRole: Role) {
    const payload: JWTPayload = { userId, systemRole, organizationId, organizationRole, jti: nanoid() };
    return jwt.sign(payload, config.refreshSecret, {
        expiresIn: config.refreshTtl,
    } as SignOptions);
}

export function verifyAccess(token: string) {
    return jwt.verify(token, config.accessSecret) as JwtPayload;
}

export function verifyRefresh(token: string) {
    return jwt.verify(token, config.refreshSecret) as JwtPayload;
}
