// apps/api/src/scripts/seedLeaguesAndSports.ts
import { pool } from "../config/db";

type SportSeed = { sport_name: string; season?: string | null; position?: string | null };
type LeagueSeed = { league_name: string };

const sports: SportSeed[] = [
  { sport_name: "Baseball", season: null, position: null },
  { sport_name: "Basketball", season: null, position: null },
  { sport_name: "Football", season: null, position: null },
  { sport_name: "Golf", season: null, position: null },
  { sport_name: "Hockey", season: null, position: null },
  { sport_name: "Lacrosse", season: null, position: null },
  { sport_name: "Rugby", season: null, position: null },
  { sport_name: "Soccer", season: null, position: null },
  { sport_name: "Softball", season: null, position: null },
  { sport_name: "Swimming", season: null, position: null },
  { sport_name: "Tennis", season: null, position: null },
  { sport_name: "Track & Field", season: null, position: null },
  { sport_name: "Ultimate Frisbee", season: null, position: null },
  { sport_name: "Volleyball", season: null, position: null },
];

const leagues: LeagueSeed[] = [
  { league_name: "AUS" },
  { league_name: "Co-Ed" },
  { league_name: "Intramural" },
];

async function upsertSport(s: SportSeed): Promise<void> {
  const found = await pool.query<{ id: string }>(
    `SELECT id FROM sports_lookup
       WHERE sport_name = $1
         AND COALESCE(season,'') = COALESCE($2,'')`,
    [s.sport_name, s.season ?? null]
  );

  if (found.rows[0]) {
    console.log(`[sports] exists: ${s.sport_name}`);
    return;
  }

  await pool.query(
    `INSERT INTO sports_lookup (sport_name, season, position)
     VALUES ($1, $2, $3)`,
    [s.sport_name, s.season ?? null, s.position ?? null]
  );
  // dont need to show each insert - was just for initial testing
  // console.log(`[sports] inserted: ${s.sport_name}`);
}

async function upsertLeague(l: LeagueSeed): Promise<void> {
  const found = await pool.query<{ id: string }>(
    `SELECT id FROM league WHERE league_name = $1`,
    [l.league_name]
  );

  if (found.rows[0]) {
    console.log(`[league] exists: ${l.league_name}`);
    return;
  }

  await pool.query(
    `INSERT INTO league (league_name)
     VALUES ($1)`,
    [l.league_name]
  );

  // dont need to show each insert - was just for initial testing
  // console.log(`[league] inserted: ${l.league_name}`);
}

export async function seedLeaguesAndSports() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const s of sports) {
      await upsertSport(s);
    }

    for (const l of leagues) {
      await upsertLeague(l);
    }

    await client.query("COMMIT");
    console.log("seedLeaguesAndSports complete");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("seedLeaguesAndSports failed:", e);
    throw e;
  } finally {
    client.release();
  }
}