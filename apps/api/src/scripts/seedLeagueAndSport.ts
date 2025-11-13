// apps/api/src/scripts/seedLeaguesAndSports.ts
import { pool } from "../config/db";

type SportSeed = { sport_name: string; season?: string | null; position?: string | null };
type LeagueSeed = { league_name: string };

const sports: SportSeed[] = [
  { sport_name: "Volleyball", season: null, position: null },
  { sport_name: "Basketball", season: null, position: null },
  { sport_name: "Soccer", season: null, position: null },
  { sport_name: "Hockey", season: null, position: null },
  { sport_name: "Rugby", season: null, position: null },
  { sport_name: "Track & Field", season: null, position: null },
];

const leagues: LeagueSeed[] = [
  { league_name: "AUS Womens Volleyball" },
  { league_name: "AUS Mens Volleyball" },
];

async function upsertSport(s: SportSeed): Promise<number> {
  const found = await pool.query<{ id: number }>(
    `SELECT id FROM sports_lookup
       WHERE sport_name = $1
         AND COALESCE(season,'') = COALESCE($2,'')`,
    [s.sport_name, s.season ?? null]
  );

  if (found.rows[0]) {
    console.log(
      `[sports] exists: ${s.sport_name} (${s.season ?? "N/A"}) -> id=${found.rows[0].id}`
    );
    // update position if provided
    await pool.query(
      `UPDATE sports_lookup
          SET position = COALESCE($2, position)
        WHERE id = $1`,
      [found.rows[0].id, s.position ?? null]
    );
    return found.rows[0].id;
  }

  const inserted = await pool.query<{ id: number }>(
    `INSERT INTO sports_lookup (sport_name, season, position)
       VALUES ($1, $2, $3)
       RETURNING id`,
    [s.sport_name, s.season ?? null, s.position ?? null]
  );

  console.log(
    `[sports] inserted: ${s.sport_name} (${s.season ?? "N/A"}) -> id=${inserted.rows[0].id}`
  );
  return inserted.rows[0].id;
}

async function upsertLeague(l: LeagueSeed): Promise<number> {
  const found = await pool.query<{ id: number }>(
    `SELECT id FROM league WHERE league_name = $1`,
    [l.league_name]
  );

  if (found.rows[0]) {
    console.log(`[league] exists: ${l.league_name} -> id=${found.rows[0].id}`);
    return found.rows[0].id;
  }

  const inserted = await pool.query<{ id: number }>(
    `INSERT INTO league (league_name)
       VALUES ($1)
       RETURNING id`,
    [l.league_name]
  );

  console.log(`[league] inserted: ${l.league_name} -> id=${inserted.rows[0].id}`);
  return inserted.rows[0].id;
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

// If you want to run this file directly with ts-node:
if (require.main === module) {
  seedLeaguesAndSports()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
