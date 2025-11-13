import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { config } from "./config/config";
import {
    testingAccountGeneration,
    testingAddingUserToath,
} from "./scripts/seedUsers";
import { seedLeaguesAndSports } from "./scripts/seedLeagueAndSport";

const port = config.port;

app.listen(port, async () => {
    console.log(`Backend running on http://localhost:${port}`);

    // test scripts
    await testingAccountGeneration();
    await testingAddingUserToath();
    await seedLeaguesAndSports();
});
