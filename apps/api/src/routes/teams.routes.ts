// apps/api/src/routes/teams.routes.ts
import { Router } from "express";
import { pool } from "../config/db";

const r = Router();

function getUserId(req: any): string | undefined {
  // adjust if your auth middleware uses a specific shape
  return (
    req?.user?.id ??
    req?.userId ??
    req?.auth?.id ??
    req?.locals?.user?.id ??
    req?.res?.locals?.user?.id
  );
}

/** GET /teams/mine → teams for current user (or [] if not logged in yet) */
r.get("/mine", async (req, res) => {
  const uid = getUserId(req);

  if (!uid) {
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

/**
 * POST /teams → create a team
 * body: { name, sport_id?, season?, league_id?, gender? }
 * If authenticated, we also link the creator as 'manager'.
 */
r.post("/", async (req, res) => {
  const {
    name,
    sport_id = null,
    season = null,
    league_id = null,
    gender = null,
  } = req.body || {};

  if (!name || String(name).trim().length < 2) {
    return res.status(400).send("name required");
  }

  const normalizedGender =
    typeof gender === "string" && gender.length
      ? gender.toLowerCase()
      : null;

  if (
    normalizedGender &&
    !["male", "female", "coed"].includes(normalizedGender)
  ) {
    return res.status(400).send("invalid gender");
  }

  const insert = await pool.query(
    `INSERT INTO teams (name, sport_id, season, league_id, gender, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [name.trim(), sport_id, season, league_id, normalizedGender]
  );

  const team = insert.rows[0];

  const uid = getUserId(req);
  if (uid) {
    await pool.query(
      `INSERT INTO user_teams (user_id, team_id, role, position, status, joined_at, updated_at)
       VALUES ($1, $2, 'manager', NULL, 'active', NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [uid, team.id]
    );
  }

  return res.status(201).json(team);
});

export default r;
