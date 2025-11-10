import { pool } from "./index";
import { CourseTime, AthleteCourseTime } from "../old/types.js";

export interface NewCourseTime {
    name?: string;
    course_code?: string;
    location?: string;
    day_of_week?: string;
    start_time?: string;
    end_time?: string;
    term?: string;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    updated_at?: string;
}

export interface NewAthleteCourseTime {
    athlete_id?: string;
    class_id: string;
    created_at?: string;
    updated_at?: string;
}

export const db = {
    async courseInsert(data: NewCourseTime, client?: any): Promise<CourseTime> {
        const c = client || pool;
        const res = await c.query(
            `INSERT INTO course_times (
          name, course_code, location, day_of_week, start_time,
          end_time, term, start_date, end_date, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *`,
            [
                data.name,
                data.course_code,
                data.location,
                data.day_of_week,
                data.start_time,
                data.end_time,
                data.term,
                data.start_date,
                data.end_date,
            ]
        );
        return res.rows[0];
    },

    async athleteCourseInsert(
        data: NewAthleteCourseTime,
        client?: any
    ): Promise<AthleteCourseTime> {
        const c = client || pool;
        const res = await c.query(
            `INSERT INTO athlete_course_times (athlete_id, class_id, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *`,
            [data.athlete_id, data.class_id]
        );
        return res.rows[0];
    },

    async addCourseAndAthlete(
        courseData: NewCourseTime,
        athleteData: NewAthleteCourseTime
    ) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const course = await this.courseInsert(courseData, client);

            athleteData.class_id = course.id;
            const athleteCourse = await this.athleteCourseInsert(
                athleteData,
                client
            );

            await client.query("COMMIT");
            return { course, athleteCourse };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async deleteCourseByID(id: string) {
        const res = await pool.query(
            `DELETE FROM course_times WHERE id = $1 RETURNING *`,
            [id]
        );
        return res.rows[0];
    },

    async updateCourse(classId: string, data: Partial<CourseTime>) {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) return null;

        const setClause = fields
            .map((field, i) => `"${field}" = $${i + 1}`)
            .join(", ");

        const query = `
      UPDATE course_times
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING *;
  `;

        const result = await pool.query(query, [...values, classId]);
        return result.rows[0] || null;
    },
};
