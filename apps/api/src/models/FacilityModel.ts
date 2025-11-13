// apps/api/src/models/FacilityModel.ts
import { pool } from "../config/db";

export type FacilityInput = {
  name: string;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province_state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export class FacilityModel {
  static async findAll() {
    const { rows } = await pool.query(
      `SELECT id, name, city, province_state, country, phone, email, created_at
         FROM facilities
         ORDER BY name`
    );
    return rows;
  }

  static async create(input: FacilityInput) {
    const {
      name,
      address1,
      address2,
      city,
      province_state,
      postal_code,
      country,
      email,
      phone,
      notes,
    } = input;

    const { rows } = await pool.query(
      `INSERT INTO facilities (
         name,
         address1,
         address2,
         city,
         province_state,
         postal_code,
         country,
         email,
         phone,
         notes,
         created_at,
         updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
       RETURNING *`,
      [
        name,
        address1 ?? null,
        address2 ?? null,
        city ?? null,
        province_state ?? null,
        postal_code ?? null,
        country ?? null,
        email ?? null,
        phone ?? null,
        notes ?? null,
      ]
    );

    return rows[0];
  }
}
