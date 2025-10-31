export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiAddCourse(parsedSchedule: unknown, athlete_id: unknown): Promise<void> {
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
        const courseTimeSuccess = data.success;
        const courseTimeId = data.course_time.id;

        if(courseTimeSuccess){
            await apiAddAthleteCourse(courseTimeId,  athlete_id);
        }

        return;
    }
    catch{
        console.log('Error Adding Course');
    }
}

export async function apiAddAthleteCourse(courseTimeID: unknown, athlete_id: unknown): Promise<void> {
    try{
        const response = await fetch("http://localhost:4000/schedule/athletecoursetime",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({athlete_id: athlete_id, class_id:courseTimeID}),
        });

        const data = await response.json();
    }
    catch{
        console.log('Error Adding Athlete Schedule');
    }
}

export function formatTimeTo12Hour(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}