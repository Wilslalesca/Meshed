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

export interface CourseTime {
  id: string;
  name?: string;
  course_code?: string;
  location?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  term?:string;
  start_date?: string;
  end_date?:string;
}

export interface AthleteCourseTime {
  id: string;
  athlete_id: string;
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