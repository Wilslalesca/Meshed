import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { apiAddTeamEvent } from "../api/events";
import type { TeamEvent } from "../types/event";

export const useAddTeamEvent = () => {
  const { token } = useAuth();

  const addTeamEvent = async (data: TeamEvent) => {
    if (!token) return;
    await apiAddTeamEvent(data, token);
  };

  return { addTeamEvent };
};

