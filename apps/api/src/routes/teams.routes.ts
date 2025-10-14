import { Router } from "express";
import type { Pool } from "pg";

export default function makeTeamRouter(db: Pool) {
  const r = Router();

  // auth middleware assumed: req.user = { id: string, role: string }
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user?.id) return res.status(401).send("unauthorized");
    next();
  };
  const requireManager = (req: any, res: any, next: any) => {
    if (!["manager","admin"].includes(req.user?.role)) return res.status(403).send("forbidden");
    next();
  };

  // GET /teams/mine
  r.get("/mine", requireAuth, async (req: any, res) => {
    const { rows } = await db.query(
      `SELECT t.*
       FROM user_teams ut
       JOIN teams t ON t.id = ut.team_id
       WHERE ut.user_id = $1
       ORDER BY t.name`,
      [req.user.id]
    );
    res.json(rows);
  });

  // GET /lookups/sports
  r.get("/lookups/sports", requireAuth, async (_req, res) => {
    const { rows } = await db.query(
      `SELECT id, sport_name, season, position
       FROM sports_lookup
       ORDER BY sport_name`
    );
    res.json(rows);
  });

  // GET /lookups/leagues
  r.get("/lookups/leagues", requireAuth, async (_req, res) => {
    const { rows } = await db.query(`SELECT id, league_name FROM league ORDER BY league_name`);
    res.json(rows);
  });

  // POST /teams
  r.post("/", requireAuth, requireManager, async (req: any, res) => {
    const { name, sport_id, season, league_id } = req.body ?? {};
    if (!name || String(name).trim().length < 2) return res.status(400).send("name required");
    const { rows } = await db.query(
      `INSERT INTO teams (name, sport_id, season, league_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), sport_id ?? null, season ?? null, league_id ?? null]
    );
    const team = rows[0];
    // Optionally auto-link creator as manager
    await db.query(
      `INSERT INTO user_teams (user_id, team_id, role, status)
       VALUES ($1, $2, 'manager', 'active')
       ON CONFLICT DO NOTHING`,
      [req.user.id, team.id]
    );
    res.status(201).json(team);
  });

  // GET /teams/:id/events
  // Placeholder: return empty until you define a table like team_events(practice/game slots)
  r.get("/:id/events", requireAuth, async (_req, res) => {
    res.json([] as any[]);
  });

  return r;
}
