import { useAuth } from "@/shared/hooks/useAuth";
import { apiAddTeamEvent } from "../api/events";
import type { TeamEvent } from "../types/event";

export const useAddTeamEvent = () => {
  const { token } = useAuth();

  const addTeamEvent = async (data: TeamEvent | TeamEvent[]) => {
    if (!token) return;

    const events = Array.isArray(data) ? data : [data];

    await Promise.all(
      events.map(event => apiAddTeamEvent(event, token))
    );
    
  };

  return { addTeamEvent };
};

