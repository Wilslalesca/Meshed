export type Role = "admin" | "manager" | "user";

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface JWTPayload {
  userId: string;
  role: Role;
  jti?: string;
}