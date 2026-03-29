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
  static async findAll(organizationId: string) {
    const { rows } = await pool.query(
      `SELECT
          id, name, city, province_state, country, phone, email, created_at
       FROM facilities
       WHERE organization_id = $1
       ORDER BY name`,
      [organizationId]
    );

    return rows;
  }


  static async findById(id: string, organizationId: string) {
    const { rows } = await pool.query(
      `SELECT *
       FROM facilities
       WHERE id = $1
         AND organization_id = $2`,
      [id, organizationId]
    );

    return rows[0] ?? null;
  }

  static async create(input: FacilityInput, organizationId: string) {
    const { 
      name, address1, address2, city, province_state, postal_code, country, email, phone, notes,
    } = input;

    const { rows } = await pool.query(
      `INSERT INTO facilities (
         organization_id, name, address1, address2, city, province_state, postal_code, country, email, phone, notes, created_at, updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
       RETURNING *`,
      [
        organizationId, name, address1 ?? null, address2 ?? null, city ?? null, province_state ?? null, postal_code ?? null, country ?? null, email ?? null, phone ?? null, notes ?? null,
      ]
    );

    return rows[0];
  }
}