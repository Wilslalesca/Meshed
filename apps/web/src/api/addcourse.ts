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

type ApiResponse = {
    message: string,
    success: boolean
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

export async function apiAddCourseAndAthleteCourse(parsedSchedule: unknown, athlete_id: unknown){
    console.log(parsedSchedule)
    console.log(athlete_id)
    try {
        const res = await fetch(`${API_BASE}/schedule/addcourseandathlete`, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: athlete_id,
                coursetimedata: parsedSchedule
            }),

        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Server error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error Adding Course:", err);
            return { success: false, message: err.message };
        } else {
            console.error("Unknown error Adding Course:", err);
            return { success: false, message: String(err) };
        }
    }

}

export async function apiAddAthleteCourse(courseTimeID: unknown, athlete_id: unknown): Promise<ApiResponse | undefined> {
    try{
        const response = await fetch(`${API_BASE}/schedule/athletecoursetime`,{
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
        return {success:false, message:'Error Adding AthleteCourse'}
    }
}

export function formatTimeTo12Hour(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}