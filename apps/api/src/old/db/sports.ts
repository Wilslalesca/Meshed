import { pool } from "./index";

export type Sport = {
  id: number;
  sport_name: string;
  season: string | null;
  position: string | null;
};

// Add a uniqueness if you haven’t already:
// ALTER TABLE sports_lookup ADD CONSTRAINT uq_sports UNIQUE (sport_name, COALESCE(season, ''));

export async function getAllSports(): Promise<Sport[]> {
  const { rows } = await pool.query<Sport>(
    `SELECT id, sport_name, season, position
     FROM sports_lookup
     ORDER BY sport_name ASC, season NULLS LAST`
  );
  return rows;
}

export async function getSportById(id: number): Promise<Sport | null> {
  const { rows } = await pool.query<Sport>(
    `SELECT id, sport_name, season, position
     FROM sports_lookup
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getSportByName(name: string, season: string | null = null): Promise<Sport | null> {
  const { rows } = await pool.query<Sport>(
    `SELECT id, sport_name, season, position
     FROM sports_lookup
     WHERE sport_name = $1 AND COALESCE(season,'') = COALESCE($2,'')`,
    [name, season]
  );
  return rows[0] ?? null;
}

/** Create if missing, otherwise return existing row id. */
export async function upsertSport(
  name: string,
  season: string | null = null,
  position: string | null = null
): Promise<number> {
  const { rows } = await pool.query<{ id: number }>(
    `
    INSERT INTO sports_lookup (sport_name, season, position)
    VALUES ($1, $2, $3)
    ON CONFLICT (sport_name, season)
    DO UPDATE SET position = EXCLUDED.position
    RETURNING id
    `,
    [name, season, position]
  );
  return rows[0].id;
}
