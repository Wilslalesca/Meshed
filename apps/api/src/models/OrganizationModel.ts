import { pool } from "../config/db";

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
};