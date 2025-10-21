// apps/api/src/routes/teams.routes.ts
import { Router } from "express";
import { pool } from "../db/index";

const r = Router();

/**
 * NOTE:
 * - This file is intentionally minimal so it won't collide with the rest of your API.
 * - It returns JSON for the routes your UI calls so you don't get 404 / JSON.parse errors.
 * - If your auth middleware sets req.user or res.locals.user, we'll use it.
 * - If no user is present (not logged in yet), /teams/mine will simply return [] (200),
 *   so the page can still render and your lookups will populate.
 */

function getUserId(req: any): string | undefined {
  // support either style your auth might set
  return req?.user?.id ?? req?.userId ?? req?.auth?.id ?? req?.locals?.user?.id ?? req?.res?.locals?.user?.id;
}

/** GET /teams/mine  → teams for current user (or [] if not logged in yet) */
r.get("/mine", async (req, res) => {
  const uid = getUserId(req);

  if (!uid) {
    // not authenticated yet – return an empty list but still 200 + JSON
    return res.json([]);
  }

  const { rows } = await pool.query(
    `SELECT t.*
       FROM user_teams ut
       JOIN teams t ON t.id = ut.team_id
      WHERE ut.user_id = $1
      ORDER BY t.name`,
    [uid]
  );

  return res.json(rows);
});

/** GET /teams/:id/events  → placeholder; return [] so the UI doesn't 404 */
r.get("/:id/events", async (_req, res) => {
  return res.json([]); // wire up when you add events
});

/**
 * POST /teams  → create a team so you can test the form
 * body: { name: string, sport_id?: number|null, season?: string|null, league_id?: number|null }
 * If authenticated, we also link the creator as 'manager' (best-effort).
 */
r.post("/", async (req, res) => {
  const { name, sport_id = null, season = null, league_id = null } = req.body || {};
  if (!name || String(name).trim().length < 2) {
    return res.status(400).send("name required");
  }

  const insert = await pool.query(
    `INSERT INTO teams (name, sport_id, season, league_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [name.trim(), sport_id, season, league_id]
  );
  const team = insert.rows[0];

  // best-effort: link creator if we can detect a user id
  const uid = getUserId(req);
  if (uid) {
    await pool.query(
      `INSERT INTO user_teams (user_id, team_id, role, status, joined_at, updated_at)
       VALUES ($1, $2, 'manager', 'active', NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [uid, team.id]
    );
  }

  return res.status(201).json(team);
});

export default r;
