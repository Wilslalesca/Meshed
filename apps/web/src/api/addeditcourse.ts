export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiAddCourse() {
  const res = await fetch(`${API_BASE}/addcourse`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('failed');
  }
  console.log(res)
  return;
}

export async function apiAddCourse2() {
  const res = await fetch(`${API_BASE}/addcourse`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('failed');
  }
  console.log(res)
  return;
}