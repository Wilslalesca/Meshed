export type Role = "admin" | "manager" | "user";

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
    role: Role;
    jti?: string;
}

export interface CourseTime {
    id: string;
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
    meta?: Record<string, any>;
}

/**
 * UserCourseTime — Links any user to a course/schedule item.
 * 
 * This is the universal interface for schedule assignments, supporting
 * any user type: athletes, patients, customers, staff, etc.
 * Stored in the user_course_times table.
 *
 * @property user_id - References users(id); the person linked to this course
 * @property class_id - References course_times(id); the schedule item
 * @property meta - Optional JSONB for sector-specific data (role context, notes, overrides)
 */
export interface UserCourseTime {
    id: string;
    user_id: string;
    class_id: string;
    meta?: Record<string, any>;
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
