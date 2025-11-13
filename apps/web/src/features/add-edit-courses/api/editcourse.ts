import type { CourseTime } from "../types/Course";
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiEditCourse(class_id: unknown, athlete_id:unknown, course:CourseTime): Promise<boolean>  {
    try {
        const res1 = await fetch(`${API_BASE}/athletecourse/${athlete_id}/${class_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({class_id:class_id, athlete_id:athlete_id}),
        });

        const res2 = await fetch(`${API_BASE}/course/${class_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(course),
        });

        if (!res1.ok && !res2.ok) {
            throw new Error("Failed to edit course");
        }

        return true;

    } catch (err) {
        console.error("Error editing course:", err);
        return false;
    }
}