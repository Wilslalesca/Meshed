export const API_BASE = import.meta.env.VITE_API_BASE_URL;

type CourseResponse = {
    message: string,
    course_time: {
    id: number;
    name: string,
    course_code: string,
    location: string,
    day_of_week: string,
    start_time: string,
    end_time: string,
    term: string,
    start_date: string,
    end_date: string,
    };
    success: boolean;
}

type AthleteCourseResponse = {
    message: string,
    course_time:{
        id: string,
        athlete_id: string,
        class_id: string,
    }
}

export async function apiAddCourse(parsedSchedule: unknown): Promise<CourseResponse | undefined> {
    try{
        const res = await fetch(`${API_BASE}/schedule/coursetime`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedSchedule),
        });

        if (!res.ok) {
            throw new Error('failed');
        }
        const data = await res.json();
        
        return data;
    }
    catch (err) {
        console.error("Error Adding Course:", err);
    }
}

export async function apiAddCourseAndAthleteCourse(parsedSchedule: unknown, athlete_id: unknown): Promise<CourseResponse | undefined> {
    try{
        const res = await fetch(`${API_BASE}/schedule/coursetime`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedSchedule),
        });

        if (!res.ok) {
            throw new Error('failed');
        }
        const data = await res.json();
        
        return data;
    }
    catch (err) {
        console.error("Error Adding Course:", err);
    }
}

export async function apiAddAthleteCourse(courseTimeID: unknown, athlete_id: unknown): Promise<AthleteCourseResponse | undefined> {
    try{
        const response = await fetch("http://localhost:4000/schedule/athletecoursetime",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({athlete_id: athlete_id, class_id:courseTimeID}),
        });

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error("Error Adding Athlete Schedule:", err);
    }
}

export function formatTimeTo12Hour(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}