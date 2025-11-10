import { pool } from "./index";
import { AthleteProfile } from "../old/types.js";
import { da } from "zod/v4/locales";
import { data } from "react-router-dom";

export interface NewAthleteProfile {
    id: string;
    school_name?: string | null;
    year?: string | null;
    notes?: string | null;
}

export const db = {
    async create(data: NewAthleteProfile): Promise<AthleteProfile | null> {
        const res = await pool.query(
            `INSERT INTO athlete_profiles (id, school_name, year, notes) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, school_name, year, notes`,
            [
                data.id,
                data.school_name ?? null,
                data.year ?? null,
                data.notes ?? null,
            ]
        );
        if (res.rows.length === 0) {
            const existing = await this.findById(data.id);
            return existing;
        }
        return res.rows[0] || null;
    },

    async findById(id: string): Promise<AthleteProfile | null> {
        const res = await pool.query(
            `SELECT id, school_name, year, notes 
            FROM athlete_profiles 
            WHERE id = $1`,
            [id]
        );
        return res.rows[0] || null;
    },

    async all(): Promise<AthleteProfile[]> {
        const res = await pool.query(
            `SELECT id, school_name, year, notes 
            FROM athlete_profiles`
        );
        return res.rows;
    },

    async update(id: string, updates: Partial<NewAthleteProfile>) {
        const { school_name, year, notes } = updates;
        await pool.query(
            `UPDATE athlete_profiles 
            SET school_name = $1, year = $2, notes = $3, updated_at = NOW() 
            WHERE id = $4`,
            [school_name ?? null, year ?? null, notes ?? null, id]
        );
    },
};
