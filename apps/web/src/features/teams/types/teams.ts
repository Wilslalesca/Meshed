export interface Team {
  id: string;
  name: string;
  sport_id: string | null;
  league_id: string | null;
  season: string | null;
  gender: "male" | "female" | "coed" | null;
  created_at: string;
  updated_at: string;
}

/** For forms & modals */
export interface CreateTeamPayload {
  name: string;
  season: string | null;
  sport_id: string | null;
  league_id: string | null;
  gender: "male" | "female" | "coed" | null;
}

export interface UpdateTeamPayload extends Partial<CreateTeamPayload> {}

/** For sports_lookup */
export interface SportLookup {
  id: string;
  sport_name: string;
  season: string | null;
  position: string | null;
}

/** For league table */
export interface League {
  id: string;
  league_name: string;
}
