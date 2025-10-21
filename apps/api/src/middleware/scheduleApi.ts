export interface CourseTime {
  id: string;
  name: string;
  course_code?: string;
  location?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  term?: string;
  start_date?: string;
}

const API_BASE = "http://localhost:5000/api/schedule"; // adjust to your backend URL

export async function fetchCourseTimes(): Promise<CourseTime[]> {
  const res = await fetch(`${API_BASE}/coursetime`);
  if (!res.ok) throw new Error("Failed to fetch course times");
  return res.json();
}
