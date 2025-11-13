// much like seedLeagueAndSports script, this script seeds initial teams into the database
import { pool } from "../config/db";

type TeamSeed = { team_name: string; league_name: string };

const teams: TeamSeed[] = [
    { team_name: "UMA Eagles", league_name: "AUS" },
    { team_name: "UMA Hawks", league_name: "Co-Ed" },
    { team_name: "UMA Tigers", league_name: "Intramural" },
];

async function upsertTeam(t: TeamSeed): Promise<void> {
    const found = await pool.query<{ id: string }>(
        `SELECT id FROM teams
       WHERE team_name = $1`,
        [t.team_name]
    );
    if (found.rows[0]) {
        console.log(`[teams] exists: ${t.team_name}`);
        return;
    }
    await pool.query(
        `INSERT INTO teams (team_name, league_id, created_at)
     VALUES ($1, (SELECT id FROM league WHERE league_name = $2), NOW())`,
        [t.team_name, t.league_name]
    );
}

export async function seedTeams() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        for (const t of teams) {
            await upsertTeam(t);
        }

        await client.query("COMMIT");
        console.log("seedTeams complete");
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("seedTeams failed:", e);
        throw e;
    } finally {
        client.release();
    }
}