
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiDeleteCourseById(class_id: unknown, athlete_id:unknown): Promise<boolean>  {
    try {
        const res1 = await fetch(`${API_BASE}/athletecourse/${athlete_id}/${class_id}`, {
        method: "DELETE",
        });

        const res2 = await fetch(`${API_BASE}/course/${class_id}`, {
        method: "DELETE",
        });

        if (!res1.ok && !res2.ok) {
            throw new Error("Failed to delete course");
        }

        return true;

    } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again.");
        return false;
    }
}
/*
export async function apiDeleteCourseByName(name: unknown, athlete_id:unknown) {
    try{
        const res = await fetch(`${API_BASE}/delete/coursetime/name`, {
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
        console.error("Error Deleting Course:", err);
    }
}*/