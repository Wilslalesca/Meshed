
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

/*export async function apiDeleteCourseById(course_id: unknown, athlete_id:unknown) {
    try{
        const res = await fetch(`${API_BASE}/schedule/delete/coursetime/id`, {
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
}

export async function apiDeleteCourseByName(name: unknown, athlete_id:unknown) {
    try{
        const res = await fetch(`${API_BASE}/schedule/delete/coursetime/name`, {
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