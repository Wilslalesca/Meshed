import type { CourseTime } from "../types/courses";

const API_BASE = import.meta.env.VITE_API_URL + "/api/schedule";


export async function fetchCourseTimes(): Promise<CourseTime[]> {
  const res = await fetch(`${API_BASE}/coursetimes`);
  if (!res.ok) throw new Error("Failed to fetch course times");
  return res.json();
}