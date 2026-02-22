import { pool } from "../config/db";

type TeamSeed = { team_name: string; league_name: string };

const teams: TeamSeed[] = [
    { team_name: "Meshed Eagles", league_name: "AUS" },
    { team_name: "Meshed Hawks", league_name: "Co-Ed" },
    { team_name: "Meshed Tigers", league_name: "Intramural" },
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


export async function addUsersToTeams() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Add all users to the first team
        const teamRes = await client.query(`SELECT id FROM teams LIMIT 1`);
        const teamId = teamRes.rows[0].id;

        const userRes = await client.query(`SELECT id FROM users`);
        for (const row of userRes.rows) {
            const userId = row.id;
            await client.query(
                `INSERT INTO user_teams (user_id, team_id, joined_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT DO NOTHING`,
                [userId, teamId]
            );
        }

        await client.query("COMMIT");
        console.log("addUsersToTeams complete");
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("addUsersToTeams failed:", e);
        throw e;
    } finally {
        client.release();
    }
}