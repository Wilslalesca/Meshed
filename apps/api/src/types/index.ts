export type Role = "admin" | "manager" | "user";

export interface AuthUser {
    id: string;
    systemRole: Role;
    organizationId: string;
    organizationRole: Role;
}

export interface User {
    id: string;
    first_name: string;
    last_name?: string;
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
    systemRole: Role;
    organizationId: string;
    organizationRole: Role;
    jti?: string;
}

export interface CourseTime {
    id: string;
    user_id?: string;  // ? == optional since some courses may not be tied to a specific user
    name?: string;
    course_code?: string;
    location?: string;
    day_of_week?: string;
    start_time?: string;
    end_time?: string;
    term?: string;
    start_date?: string;
    end_date?: string;
    recurring?: boolean;
}

export interface UserEvent {
    id: string;
    user_id: string;
    class_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface AthleteProfile {
    id: string;
    school_name: string | null;
    year: string | null;
    notes: string | null;
    created_at?: string;
    updated_at?: string;
}


export type UserWithMembership = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: "user" | "manager" | "admin";
  passwordHash: string;
  active: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string | null;
  organizationRole: "user" | "manager" | "admin" | null;
};

export type SafeUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: "user" | "manager" | "admin";
  active: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string | null;
  organizationRole: "user" | "manager" | "admin" | null;
};