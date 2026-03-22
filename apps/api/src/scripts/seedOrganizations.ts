import { pool } from "../config/db";
import { UserModel } from "../models/UserModel";

const DEMO_ORG = {
  name: "Meshed Demo Org",
  slug: "meshed-demo-org",
  plan: "Pro",
};

type SeedMembership = {
  email: string;
  role: "admin" | "manager" | "user";
};

const memberships: SeedMembership[] = [
  { email: "admin@email.com", role: "admin" },
  { email: "manager@email.com", role: "manager" },
  { email: "user@email.com", role: "user" },
  { email: "will@email.com", role: "user" },
  { email: "fran@email.com", role: "user" },
  { email: "alex@email.com", role: "user" },
];

export async function seedDemoOrganization() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let orgId: string;

    const orgRes = await client.query(
      `SELECT id
       FROM organizations
       WHERE slug = $1
       LIMIT 1`,
      [DEMO_ORG.slug]
    );

    if (orgRes.rows[0]) {
      orgId = orgRes.rows[0].id;
      console.log(`[org] exists: ${DEMO_ORG.name}`);
    } else {
      const createdOrg = await client.query(
        `INSERT INTO organizations (name, slug, plan, active, created_at, updated_at)
         VALUES ($1, $2, $3, true, NOW(), NOW())
         RETURNING id`,
        [DEMO_ORG.name, DEMO_ORG.slug, DEMO_ORG.plan]
      );

      orgId = createdOrg.rows[0].id;
      console.log(`[org] created: ${DEMO_ORG.name}`);
    }

    for (const membership of memberships) {
      const user = await UserModel.findByEmail(membership.email);

      if (!user) {
        console.warn(`[org-membership] user missing: ${membership.email}`);
        continue;
      }

      await client.query(
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
           updated_at = NOW()`,
        [orgId, user.id, membership.role]
      );

      console.log(`[org-membership] ${membership.email} -> ${membership.role}`);
    }

    await client.query("COMMIT");
    console.log("seedDemoOrganization complete");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("seedDemoOrganization failed:", e);
    throw e;
  } finally {
    client.release();
  }
}