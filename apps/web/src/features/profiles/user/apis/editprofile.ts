
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiEditCourse(user_id:unknown): Promise<boolean>  {
    try{
        const res = await fetch(`${API_BASE}/users/${user_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id:user_id}),
        });
        if (!res.ok) {
            throw new Error("Failed to edit profile");
        }
        return true;
    }
    catch(err){
        return false;
    }
}