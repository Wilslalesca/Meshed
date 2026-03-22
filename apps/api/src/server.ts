import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { config } from "./config/config";
import { ensurePasswordResetCodesTable } from "./db/ensurePasswordResetCodesTable";
import {
    testingAccountGeneration,
    testingAddingUserToath,
} from "./scripts/seedUsers";
import { seedLeaguesAndSports } from "./scripts/seedLeagueAndSport";

const port = config.port;

async function start() {
    await ensurePasswordResetCodesTable();

    app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
    });

    // test scripts (non-fatal for boot)
    Promise.resolve()
        .then(async () => {
            await testingAccountGeneration();
            await testingAddingUserToath();
            await seedLeaguesAndSports();
            // await seedTeams(); // function for seeding teams
        })
        .catch((err) => console.error("Seed scripts failed:", err));
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
