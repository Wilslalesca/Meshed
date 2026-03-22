import { pool } from "../config/db";
import type { Role } from "../types/index";
export type OrganizationStatus = "active" | "inactive";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function buildUniqueSlug(baseName: string): Promise<string> {
  const baseSlug = slugify(baseName);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const res = await pool.query(
      `SELECT id FROM organizations WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (!res.rows[0]) {
      return slug;
    }

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}

export const OrganizationModel = {
  async create(name: string) {
    const slug = await buildUniqueSlug(name);

    const res = await pool.query(
      `INSERT INTO organizations (name, slug, plan, active, created_at, updated_at)
       VALUES ($1, $2, 'Pro', true, NOW(), NOW())
       RETURNING *`,
      [name.trim(), slug]
    );

    return res.rows[0];
  },

  async findById(id: string) {
    const res = await pool.query(`SELECT * FROM organizations WHERE id = $1 LIMIT 1`, 
      [id]
    );
    return res.rows[0] ?? null;
  },

  async findAll() {
    const res = await pool.query(`SELECT * FROM organizations ORDER BY created_at DESC`);
    return res.rows;
  },

  async update(id: string, updates: { name?: string; active?: boolean }){
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.name) {
      fields.push(`name = $${idx}`);
      values.push(updates.name.trim());
      const slug = await buildUniqueSlug(updates.name);
      fields.push(`slug = $${idx++}`);
      values.push(slug);
    }

    if (updates.active !== undefined) {
      fields.push(`active = $${idx++}`);
      values.push(updates.active);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const res = await pool.query(
      `UPDATE organizations SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );

    return res.rows[0] ?? null; 

  },

  async delete(id: string) {
    const res = await pool.query(
      `DELETE FROM organizations
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    return (res.rowCount ?? 0) > 0;
  },
  async listUsers(organizationId: string) {
    const res = await pool.query(
      `SELECT
          om.id AS membership_id,
          om.organization_id,
          om.user_id,
          om.role,
          om.status,
          om.created_at,
          om.updated_at,
          u.first_name,
          u.last_name,
          u.email,
          u.active,
          u.verified
       FROM organization_memberships om
       JOIN users u
         ON u.id = om.user_id
       WHERE om.organization_id = $1
       ORDER BY om.created_at DESC`,
      [organizationId]
    );

    return res.rows;
  },

  async findMembershipById(membershipId: string, organizationId: string) {
    const res = await pool.query(
      `SELECT *
       FROM organization_memberships
       WHERE id = $1
         AND organization_id = $2
       LIMIT 1`,
      [membershipId, organizationId]
    );

    return res.rows[0] ?? null;
  },

  async findMembershipByUserId(userId: string, organizationId: string) {
    const res = await pool.query(
      `SELECT *
       FROM organization_memberships
       WHERE user_id = $1
         AND organization_id = $2
       LIMIT 1`,
      [userId, organizationId]
    );

    return res.rows[0] ?? null;
  },

  async addUser( organizationId: string, userId: string, role: Role = "user" ) {
    const res = await pool.query(
      `INSERT INTO organization_memberships (
          organization_id,
          user_id,
          role,
          status,
          created_at,
          updated_at
       )
       VALUES ($1, $2, $3, 'active', NOW(), NOW())
       ON CONFLICT (organization_id, user_id)
       DO UPDATE SET
         role = EXCLUDED.role,
         status = 'active',
         updated_at = NOW()
       RETURNING *`,
      [organizationId, userId, role]
    );

    return res.rows[0];
  },
  async updateUserRole(membershipId: string, organizationId: string, role: Role) {
    const res = await pool.query(
      `UPDATE organization_memberships
       SET role = $1,
           updated_at = NOW()
       WHERE id = $2
         AND organization_id = $3
       RETURNING *`,
      [role, membershipId, organizationId]
    );

    return res.rows[0] ?? null;
  },

  async updateUserStatus( membershipId: string, organizationId: string, status: OrganizationStatus ) {
    const res = await pool.query(
      `UPDATE organization_memberships
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2
         AND organization_id = $3
       RETURNING *`,
      [status, membershipId, organizationId]
    );

    return res.rows[0] ?? null;
  },
  async removeUser(membershipId: string, organizationId: string) {
    const res = await pool.query(
      `DELETE FROM organization_memberships
       WHERE id = $1
         AND organization_id = $2
       RETURNING id`,
      [membershipId, organizationId]
    );

    return (res.rowCount ?? 0) > 0;
  },

};