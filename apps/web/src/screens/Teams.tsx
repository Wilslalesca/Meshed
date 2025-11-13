// apps/web/src/screens/Teams.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

type Team = {
  id: string;                      // UUID from DB
  name: string;
  sport_id: number | null;
  season: string | null;
  league_id: number | null;
  gender?: "male" | "female" | "coed" | null;
};

type Sport = {
  id: number;
  sport_name: string;
  season: string | null;
  position: string | null;
};

type League = {
  id: number;
  league_name: string;
};

export const Teams: React.FC = () => {
  const { hasRole } = useAuth();
  const canManage = hasRole(["manager", "admin"]);

  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Fetch helper: don't force JSON header on GET
  const api = (path: string, init: RequestInit = {}) => {
    const hasBody = "body" in init && init.body !== undefined;
    const headers = hasBody
      ? { "Content-Type": "application/json", ...(init.headers || {}) }
      : init.headers;

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
        } else {
          if (!cancelled) setSports([]);
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
        } else {
          if (!cancelled) setLeagues([]);
        }

        // teams (may be 200 [] or not ready yet)
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
            if (list.length && selectedTeamId == null)
              setSelectedTeamId(list[0].id);
          }
        } else {
          if (!cancelled) setMyTeams([]);
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

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      sport_id: form.sport_id ? Number(form.sport_id) : null,
      season: form.season || null,
      league_id: form.league_id ? Number(form.league_id) : null,
      gender: form.gender || null,
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

  const selectedTeam = myTeams.find((t) => t.id === selectedTeamId) ?? null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Teams</h1>

      {/* Team picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">My teams:</span>
        {loading && <span className="text-sm">Loading…</span>}
        {!loading &&
          (!Array.isArray(myTeams) || myTeams.length === 0) && (
            <span className="text-sm">
              You are not in any teams yet.
            </span>
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

      {/* Selected team summary (for context) */}
      {selectedTeam && (
        <div className="border rounded-md p-4 text-sm space-y-1">
          <div className="font-semibold">{selectedTeam.name}</div>
          {selectedTeam.season && <div>Season: {selectedTeam.season}</div>}
          {selectedTeam.gender && (
            <div>
              Gender:{" "}
              {selectedTeam.gender === "coed"
                ? "Co-ed"
                : selectedTeam.gender[0].toUpperCase() +
                  selectedTeam.gender.slice(1)}
            </div>
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
