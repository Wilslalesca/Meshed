import { Router } from "express";
import { pool } from "../config/db";

const r = Router();

/**
 * GET /facilities – list all (admin-only)
 */
r.get("/", async (req: any, res) => {
  if (req.user?.role !== "admin") return res.status(403).send("Forbidden");

  const { rows } = await pool.query(
    `SELECT id, name, city, province_state, country, phone, email, created_at
     FROM facilities
     ORDER BY name`
  );

  res.json(rows);
});

/**
 * POST /facilities – create new
 */
r.post("/", async (req: any, res) => {
  if (req.user?.role !== "admin") return res.status(403).send("Forbidden");

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
  } = req.body;

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
      created_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      name ?? null,
      address1 ?? null,
      address2 ?? null,
      city ?? null,
      province_state ?? null,
      postal_code ?? null,
      country ?? null,
      email ?? null,
      phone ?? null,
      notes ?? null,
      req.user?.id ?? null,
    ]
  );

  res.status(201).json(rows[0]);
});

export default r;
