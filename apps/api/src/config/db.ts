import pkg from "pg";
import { config } from "./config";
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: config.databaseUrl,
});

pool.on("connect", () => console.log("Connected to the database"));
pool.on("error", (err) => console.error("Database error:", err));