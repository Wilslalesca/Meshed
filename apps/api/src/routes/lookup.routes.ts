import { Router } from "express";
import { pool } from "../config/db";

const r = Router();

/** Public for now so the Teams page can load before login */
r.get("/sports", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, sport_name, season, position
     FROM sports_lookup
     ORDER BY sport_name, season NULLS LAST`
  );
  res.json(rows);
});

r.get("/leagues", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, league_name
     FROM league
     ORDER BY league_name`
  );
  res.json(rows);
});

export default r;
