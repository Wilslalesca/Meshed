import type { CourseTime } from "../types/courses";

const API_BASE = import.meta.env.VITE_API_URL + "/api/schedule";


export async function fetchCourseTimes(): Promise<CourseTime[]> {
  const res = await fetch(`${API_BASE}/schedule/coursetimes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch course times");
  return res.json();
}

export async function fetchAthleteCourseTimes(athleteId: string): Promise<CourseTime[]> {
  const res = await fetch(`${API_BASE}/schedule/athlete/${encodeURIComponent(athleteId)}/coursetimes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch athlete course times");
  return res.json();
}

export async function fetchCoachCourseTimes(coachId: string): Promise<CourseTime[]> {
  const res = await fetch(`${API_BASE}/schedule/coach/${encodeURIComponent(coachId)}/coursetimes`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch coach course times");
  return res.json();
}