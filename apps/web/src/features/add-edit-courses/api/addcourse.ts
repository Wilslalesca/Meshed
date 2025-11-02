import type { CourseResponse, ApiResponse } from '../types/Course'
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

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