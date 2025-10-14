import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => console.log("SUCCESS: Backend connected to the database"));
pool.on("error", (err) => console.error("ERROR: Backend couldn't connect to the database", err));