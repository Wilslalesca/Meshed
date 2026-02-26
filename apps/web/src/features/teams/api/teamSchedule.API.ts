export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type { CourseTimeRow, TeamEventRow } from "../types/schedule";


// get the full roster of a team
export async function apiGetRoster(teamId: string, token: string) {

  const res = await fetch(`${API_BASE}/teams/${teamId}/athletes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) return []; 

  return await res.json();
}

// get a athletes schedule 
export async function apiGetAthleteScheduleRows(athleteId: string, token: string): Promise<CourseTimeRow[]> {
  const res = await fetch(`${API_BASE}/schedule/athlete/${athleteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  

  if (!res.ok) return []; 
  
  const data = (await res.json()) as CourseTimeRow[];
  return Array.isArray(data) ? data : [];
}

// get a teams events
export async function apiGetTeamEvents(teamId: string, token: string): Promise<TeamEventRow[]> {
  const res = await fetch(`${API_BASE}/teams/${teamId}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return []; 

  const data = (await res.json()) as TeamEventRow[];
  return Array.isArray(data) ? data : [];
}



