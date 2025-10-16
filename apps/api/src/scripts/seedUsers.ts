import bcrypt from "bcryptjs";
import { pool } from "../db/index";
import { db } from '../db/users';

const seeds = [
  { first: "Admin", last: "Account", email: "admin@email.com", pass: "Admin123!", role: "admin" },
  { first: "Manager", last: "Account", email: "manager@email.com", pass: "Manager123!", role: "manager" },
  { first: "User", last: "Account", email: "user@email.com", pass: "User123!", role: "user" },
];

export async function testingAccountGeneration() {
    for (const user of seeds) {
        const hashed = await bcrypt.hash(user.pass, 10);
        await pool.query(
            `INSERT INTO users (first_name, last_name, email, role, password_hash, active, verified, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, true, true, NOW(), NOW())`,
            [user.first, user.last, user.email, user.role, hashed]
        );
        console.log(`Seeded user: ${user.email} with role ${user.role}`);
    }
}


export async function testingAddingUserToath() {
    const user = await db.findByEmail("user@email.com");
    if (!user) {
        throw new Error("User with email user@email.com not found");
    }
    await pool.query(
        `INSERT INTO athlete_profiles (id, school_name, year, notes)
                VALUES ($1, $2, $3, $4)`,
                [user.id, "UNB", "4", "N/A"]
    );
    console.log("user added to profile");
}
