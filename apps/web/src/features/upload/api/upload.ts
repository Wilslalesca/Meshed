import type { UploadResponse } from "@/features/upload/types/Upload";

export const API_BASE = import.meta.env.VITE_API_BASE_URL;


export async function apiUploadCourses(fileData:FormData): Promise<UploadResponse | undefined> {
    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: fileData,
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Server error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        return { schedule: data.schedule, message: data.message, course_times:data.course_times };
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error Adding Course:", err);
            return { schedule: false, message: err.message };
        } else {
            console.error("Unknown error Adding Course:", err);
            return { schedule: false, message: String(err) };
        }
    }
}