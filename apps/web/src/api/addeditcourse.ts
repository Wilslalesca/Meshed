export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiAddCourse(parsedSchedule: unknown): Promise<void> {
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
    console.log(res);
    return;
}

export function formatTimeTo12Hour(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}