// apps/web/src/screens/Teams.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

type Team = {
  id: string; // UUID from DB
  name: string;
  sport_id: string | null;
  season: string | null;
  league_id: string | null;
  gender?: "male" | "female" | "coed" | null;
};

type Sport = {
  id: string; // UUID
  sport_name: string;
  season: string | null;
  position: string | null;
};

type League = {
  id: string; // UUID
  league_name: string;
};

type AuthShape = {
  hasRole: (roles: string[]) => boolean;
  token?: string | null;
  accessToken?: string | null;
};

type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  position: string | null;
  status: string;
  joined_at: string;
};

export const Teams: React.FC = () => {
  const auth = useAuth() as AuthShape;
  const { hasRole } = auth;
  const token = auth.token ?? auth.accessToken ?? null;

  const canManage = hasRole(["manager", "admin"]);

  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<{
    name: string;
    sport_id: string;
    season: string;
    league_id: string;
    gender: string;
  }>({
    name: "",
    sport_id: "",
    season: "",
    league_id: "",
    gender: "",
  });

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [athleteError, setAthleteError] = useState<string | null>(null);
  const [addEmail, setAddEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // API helper – always send Authorization if we have a token
  const api = (path: string, init: RequestInit = {}) => {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`http://localhost:4000${path}`, {
      credentials: "include",
      ...init,
      headers,
    });
  };

  // Load my teams + lookups (resilient)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [teamsRes, sportsRes, leaguesRes] = await Promise.allSettled([
          api("/teams/mine"),
          api("/lookups/sports"),
          api("/lookups/leagues"),
        ]);

        // sports
        if (
          sportsRes.status === "fulfilled" &&
          sportsRes.value.ok &&
          (sportsRes.value.headers.get("content-type") || "").includes(
            "application/json"
          )
        ) {
          const sp: Sport[] = await sportsRes.value.json();
          if (!cancelled) setSports(sp);
        } else if (!cancelled) {
          setSports([]);
        }

        // leagues
        if (
          leaguesRes.status === "fulfilled" &&
          leaguesRes.value.ok &&
          (leaguesRes.value.headers.get("content-type") || "").includes(
            "application/json"
          )
        ) {
          const lg: League[] = await leaguesRes.value.json();
          if (!cancelled) setLeagues(lg);
        } else if (!cancelled) {
          setLeagues([]);
        }

        // teams
        if (
          teamsRes.status === "fulfilled" &&
          teamsRes.value.ok &&
          (teamsRes.value.headers.get("content-type") || "").includes(
            "application/json"
          )
        ) {
          const teams: Team[] = await teamsRes.value.json();
          if (!cancelled) {
            const list = Array.isArray(teams) ? teams : [];
            setMyTeams(list);
            if (list.length && selectedTeamId == null) {
              setSelectedTeamId(list[0].id);
            }
          }
        } else if (!cancelled) {
          setMyTeams([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load roster whenever selected team changes
  useEffect(() => {
    if (!selectedTeamId) {
      setAthletes([]);
      setAthleteError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setAthleteError(null);
      try {
        const res = await api(`/teams/${selectedTeamId}/athletes`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to load roster");
        }
        const data: Athlete[] = await res.json();
        if (!cancelled) setAthletes(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (!cancelled) {
          setAthleteError(
            err instanceof Error ? err.message : "Failed to load roster"
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedTeamId]);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      sport_id: form.sport_id || null,        // UUID string or null
      season: form.season || null,
      league_id: form.league_id || null,      // UUID string or null
      gender: (form.gender || null) as "male" | "female" | "coed" | null,
    };

    const res = await api("/teams", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text();
      alert(`Create team failed: ${msg}`);
      return;
    }

    const team: Team = await res.json();
    setMyTeams((t) => [...t, team]);
    setSelectedTeamId(team.id);
    setForm({
      name: "",
      sport_id: "",
      season: "",
      league_id: "",
      gender: "",
    });
  };

  const selectedTeam =
    selectedTeamId == null
      ? null
      : myTeams.find((t) => t.id === selectedTeamId) ?? null;

  const selectedSport =
    selectedTeam && selectedTeam.sport_id
      ? sports.find((s) => s.id === selectedTeam.sport_id) ?? null
      : null;

  const selectedLeague =
    selectedTeam && selectedTeam.league_id
      ? leagues.find((l) => l.id === selectedTeam.league_id) ?? null
      : null;

  const addAthleteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    const email = addEmail.trim();
    if (!email) {
      setAthleteError("Email is required");
      return;
    }

    setAdding(true);
    setAthleteError(null);
    try {
      const res = await api(`/teams/${selectedTeamId}/athletes/by-email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add athlete");
      }

      setAddEmail("");

      // reload roster
      const rosterRes = await api(`/teams/${selectedTeamId}/athletes`);
      if (rosterRes.ok) {
        const data: Athlete[] = await rosterRes.json();
        setAthletes(Array.isArray(data) ? data : []);
      }
    } catch (err: unknown) {
      setAthleteError(
        err instanceof Error ? err.message : "Error adding athlete"
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Teams</h1>

      {/* Team picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">My teams:</span>
        {loading && <span className="text-sm">Loading…</span>}
        {!loading &&
          (!Array.isArray(myTeams) || myTeams.length === 0) && (
            <span className="text-sm">You are not in any teams yet.</span>
          )}
        {(Array.isArray(myTeams) ? myTeams : []).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            className={`px-3 py-1 text-sm rounded-md border ${
              selectedTeamId === t.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Selected team details */}
      {selectedTeam && (
        <div className="border rounded-md p-4 text-sm space-y-1">
          <div className="font-semibold">{selectedTeam.name}</div>
          <div>Season: {selectedTeam.season ?? "—"}</div>
          <div>Sport: {selectedSport ? selectedSport.sport_name : "—"}</div>
          <div>League: {selectedLeague ? selectedLeague.league_name : "—"}</div>
          <div>
            Gender:{" "}
            {selectedTeam.gender
              ? selectedTeam.gender === "coed"
                ? "Co-ed"
                : selectedTeam.gender[0].toUpperCase() +
                  selectedTeam.gender.slice(1)
              : "—"}
          </div>
        </div>
      )}

      {/* Roster card for selected team */}
      {selectedTeam && (
        <div className="border rounded-md p-4 text-sm space-y-3">
          <h3 className="font-semibold">Roster</h3>

          {canManage && (
            <form
              onSubmit={addAthleteByEmail}
              className="flex flex-col sm:flex-row gap-2 items-start sm:items-end"
            >
              <div className="flex flex-col text-sm w-full sm:w-64">
                <span>Add athlete by email</span>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="border rounded px-2 py-1"
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="px-3 py-2 rounded bg-black text-white text-sm"
              >
                {adding ? "Adding..." : "Add"}
              </button>
            </form>
          )}

          {athleteError && (
            <p className="text-xs text-red-600">{athleteError}</p>
          )}

          {athletes.length === 0 && !athleteError && (
            <p className="text-xs text-muted-foreground">
              No athletes on this team yet.
            </p>
          )}

          {athletes.length > 0 && (
            <ul className="space-y-1">
              {athletes.map((a) => (
                <li key={a.id} className="flex justify-between gap-2">
                  <span>
                    {a.first_name} {a.last_name} ({a.email})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {a.status ?? "active"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Manager/Admin: Create Team */}
      {canManage && (
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-3">Create team</h2>
          <form
            onSubmit={createTeam}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <label className="flex flex-col text-sm">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="border rounded px-2 py-1"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span>Season</span>
              <input
                name="season"
                value={form.season}
                onChange={onChange}
                placeholder="e.g., 2025"
                className="border rounded px-2 py-1"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span>Sport</span>
              <select
                name="sport_id"
                value={form.sport_id}
                onChange={onChange}
                className="border rounded px-2 py-1"
              >
                <option value="">(none)</option>
                {(Array.isArray(sports) ? sports : []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sport_name}
                    {s.season ? ` (${s.season})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span>League</span>
              <select
                name="league_id"
                value={form.league_id}
                onChange={onChange}
                className="border rounded px-2 py-1"
              >
                <option value="">(none)</option>
                {(Array.isArray(leagues) ? leagues : []).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.league_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span>Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                required
                className="border rounded px-2 py-1"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="coed">Co-ed</option>
              </select>
            </label>

            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-3 py-2 rounded bg-black text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
