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
    console.log("user added to profile: " + user.id);

    // generate a simple test schedule for this athlete
    await testingGenerateAthleteSchedule(user.id);
}

export async function testingGenerateAthleteSchedule(athleteId?: string) {
    try {
        let aid = athleteId;
        if (!aid) {
            const user = await db.findByEmail("user@email.com");
            if (!user) throw new Error("User not found for schedule generation");
            aid = user.id;
        }

        const classes = [
            { name: "Strength Training", course_code: "ST101", location: "Gym A", day_of_week: "Monday", start_time: "09:00", end_time: "10:30", term: "Fall 2025", start_date: "2025-09-01" },
            { name: "Tactics Lab", course_code: "TL202", location: "Room 204", day_of_week: "Wednesday", start_time: "14:00", end_time: "15:20", term: "Fall 2025", start_date: "2025-09-01" },
            { name: "Recovery Session", course_code: "RC301", location: "Pool", day_of_week: "Friday", start_time: "11:30", end_time: "12:45", term: "Fall 2025", start_date: "2025-09-01" },
        ];

        for (const cls of classes) {
            const res = await pool.query(
                `INSERT INTO course_times (name, course_code, location, day_of_week, start_time, end_time, term, start_date, created_at, updated_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
                 RETURNING id`,
                [cls.name, cls.course_code, cls.location, cls.day_of_week, cls.start_time, cls.end_time, cls.term, cls.start_date]
            );
            const classId = res.rows[0]?.id;
            if (classId) {
                await pool.query(
                    `INSERT INTO athlete_course_times (athlete_id, class_id, created_at, updated_at)
                     VALUES ($1, $2, NOW(), NOW())`,
                    [aid, classId]
                );
                console.log(`Linked class ${cls.name} (${classId}) to athlete ${aid}`);
            }
        }

    } catch (err) {
        console.error("Failed to generate athlete schedule:", err);
        throw err;
    }
}

if (require.main === module) {
  (async () => {
    try {
      await testingAccountGeneration();
      await testingAddingUserToath();
      console.log("Seeding complete");
      process.exit(0);
    } catch (err) {
      console.error("Seeding failed", err);
      process.exit(1);
    }
  })();
}
