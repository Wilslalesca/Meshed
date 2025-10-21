// apps/web/src/screens/Teams.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CalendarTimeColumn from "./CalendarTimeColumn";

type Team = {
  id: number;
  name: string;
  sport_id: number | null;
  season: string | null;
  league_id: number | null;
};

type Sport = { id: number; sport_name: string; season: string | null; position: string | null; };
type League = { id: number; league_name: string; };

type TeamEvent = {
  id: number;
  title: string;
  dayOfWeek: number; // 0..6
  start: string;     // "HH:MM"
  end: string;       // "HH:MM"
  location?: string;
};

const startHour = 6;
const endHour = 22;

export const Teams: React.FC = () => {
  const { hasRole } = useAuth();
  const canManage = hasRole(["manager", "admin"]);

  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [events, setEvents] = useState<TeamEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<{ name: string; sport_id: string; season: string; league_id: string }>({
    name: "", sport_id: "", season: "", league_id: ""
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
          (sportsRes.value.headers.get("content-type") || "").includes("application/json")
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
          (leaguesRes.value.headers.get("content-type") || "").includes("application/json")
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
          (teamsRes.value.headers.get("content-type") || "").includes("application/json")
        ) {
          const teams: Team[] = await teamsRes.value.json();
          if (!cancelled) {
            setMyTeams(Array.isArray(teams) ? teams : []);
            if (teams.length && selectedTeamId == null) setSelectedTeamId(teams[0].id);
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

  // Load events whenever selected team changes
  useEffect(() => {
    if (!selectedTeamId) return;
    let cancelled = false;
    (async () => {
      const res = await api(`/teams/${selectedTeamId}/events`);
      if (res.ok && (res.headers.get("content-type") || "").includes("application/json")) {
        const evts: TeamEvent[] = await res.json();
        if (!cancelled) setEvents(evts);
      } else {
        if (!cancelled) setEvents([]);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedTeamId]);

  const days = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], []);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name.trim(),
      sport_id: form.sport_id ? Number(form.sport_id) : null,
      season: form.season || null,
      league_id: form.league_id ? Number(form.league_id) : null,
    };
    const res = await api("/teams", { method: "POST", body: JSON.stringify(body) });
    if (!res.ok) {
      const msg = await res.text();
      alert(`Create team failed: ${msg}`);
      return;
    }
    const team: Team = await res.json();
    setMyTeams(t => [...t, team]);
    setSelectedTeamId(team.id);
    setForm({ name: "", sport_id: "", season: "", league_id: "" });
  };

  const timeSlots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    timeSlots.push(`${h}:00`, `${h}:30`);
  }

  const eventMap = useMemo(() => {
    const map = new Map<number, TeamEvent[]>();
    for (const d of [0, 1, 2, 3, 4, 5, 6]) map.set(d, []);
    events.forEach(e => map.get(e.dayOfWeek)?.push(e));
    for (const d of [0, 1, 2, 3, 4, 5, 6]) {
      map.get(d)?.sort((a, b) => a.start.localeCompare(b.start));
    }
    return map;
  }, [events]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Teams</h1>

      {/* Team picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">My teams:</span>
        {loading && <span className="text-sm">Loading…</span>}
        {!loading && (!Array.isArray(myTeams) || myTeams.length === 0) && (
          <span className="text-sm">You are not in any teams yet.</span>
        )}
        {(Array.isArray(myTeams) ? myTeams : []).map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            className={`px-3 py-1 text-sm rounded-md border ${
              selectedTeamId === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Weekly calendar */}
      <div className="border rounded-md overflow-hidden">
        <div className="flex">
          <CalendarTimeColumn startHour={startHour} endHour={endHour} intervalMinutes={30} />
          <div className="grid grid-cols-7 flex-1">
            {days.map((d, idx) => (
              <div key={d} className="border-l">
                <div className="h-10 px-2 flex items-center font-medium">{d}</div>
                {timeSlots.map((slot, i) => (
                  <div key={i} className="h-10 border-t border-gray-200 relative">
                    {eventMap.get(idx)?.filter(e => e.start === slot).map(ev => {
                      const [sh, sm] = ev.start.split(":").map(Number);
                      const [eh, em] = ev.end.split(":").map(Number);
                      const durationMin = (eh * 60 + em) - (sh * 60 + sm);
                      const px = (durationMin / 30) * 40; // 30m == 40px
                      return (
                        <div
                          key={ev.id}
                          className="absolute left-1 right-1 top-0 rounded-md text-xs p-1 bg-blue-500 text-white shadow"
                          style={{ height: `${px - 2}px` }}
                          title={`${ev.title} ${ev.start}-${ev.end}${ev.location ? ` @ ${ev.location}` : ""}`}
                        >
                          <div className="font-semibold truncate">{ev.title}</div>
                          <div className="opacity-90">
                            {ev.start}–{ev.end}{ev.location ? ` • ${ev.location}` : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manager/Admin: Create Team */}
      {canManage && (
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-3">Create team</h2>
          <form onSubmit={createTeam} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {(Array.isArray(sports) ? sports : []).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.sport_name}{s.season ? ` (${s.season})` : ""}
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
                {(Array.isArray(leagues) ? leagues : []).map(l => (
                  <option key={l.id} value={l.id}>
                    {l.league_name}
                  </option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="px-3 py-2 rounded bg-black text-white">
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
