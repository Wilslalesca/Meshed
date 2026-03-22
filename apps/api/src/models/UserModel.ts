import { pool } from "../config/db";
import { User, Role } from "../types/index";
import bcrypt from "bcryptjs";

export interface NewUserInput {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    role?: Role;
    passwordHash: string;
}

export interface UserWithMembership extends User {
    organizationId: string;
    organizationRole: Role;
    membershipStatus: string;
}

export const UserModel = {

    async findByEmail(email: string): Promise<User | null> {
        const res = await pool.query(
            `SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone, role,
              password_hash AS "passwordHash", active, verified,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM users WHERE email = $1`,
            [email]
        );
        return res.rows[0] || null;
    },

    async findById(id: string): Promise<User | null> {
        const res = await pool.query(
            `SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone, role,
              password_hash AS "passwordHash", active, verified,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM users WHERE id = $1`,
            [id]
        );
        return res.rows[0] || null;
    },
    async findByEmailWithMembership(email: string): Promise<UserWithMembership | null> {
        const res = await pool.query(
            `SELECT
            u.id, u.first_name AS "firstName", u.last_name AS "lastName", u.email,
            u.phone, u.role, u.password_hash AS "passwordHash", u.active,
            u.verified, u.created_at AS "createdAt", u.updated_at AS "updatedAt",
            om.organization_id AS "organizationId", om.role AS "organizationRole",
            om.status AS "membershipStatus" 
            FROM users u
            JOIN organization_memberships om
                ON om.user_id = u.id
            WHERE u.email = $1
                AND om.status = 'active'
            ORDER BY om.created_at ASC
            LIMIT 1`,
            [email]
        );

        return res.rows[0] || null;
    },

    async findMembershipByUserId(userId: string) {
        const res = await pool.query(
        `SELECT
            id, organization_id AS "organizationId", user_id AS "userId",
            role, status, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM organization_memberships
        WHERE user_id = $1
            AND status = 'active'
        ORDER BY created_at ASC
        LIMIT 1`,
        [userId]
        );

        return res.rows[0] || null;
    },

    async createMembership(userId: string, organizationId: string, role: Role = "user") {
        const res = await pool.query(
        `INSERT INTO organization_memberships (
            organization_id, user_id, role,
            status, created_at, updated_at
        )
        VALUES ($1, $2, $3, 'active', NOW(), NOW())
        ON CONFLICT (organization_id, user_id) DO UPDATE
        SET role = EXCLUDED.role,
            status = 'active',
            updated_at = NOW()
        RETURNING
            id,
            organization_id AS "organizationId",
            user_id AS "userId",
            role,
            status,
            created_at AS "createdAt",
            updated_at AS "updatedAt"`,
        [organizationId, userId, role]
        );

        return res.rows[0];
    },

    async insert(data: NewUserInput): Promise<User> {
        const res = await pool.query(
            `INSERT INTO users (
          first_name, last_name, email, phone, role, password_hash,
          active, verified, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, false, false, NOW(), NOW())
       RETURNING id, first_name AS "firstName", last_name AS "lastName",
                 email, phone, role, password_hash AS "passwordHash",
                 active, verified, created_at AS "createdAt", updated_at AS "updatedAt"`,
            [
                data.firstName,
                data.lastName || null,
                data.email,
                data.phone || null,
                data.role || "user",
                data.passwordHash,
            ]
        );
        return res.rows[0];
    },

    async all(): Promise<User[]> {
        const res = await pool.query(
            `SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone, role,
              password_hash AS "passwordHash", active, verified,
              created_at AS "createdAt", updated_at AS "updatedAt"
            FROM users`
        );
        return res.rows;
    },

    async updateUser(userId: string, data: Partial<User>) {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) return null;

        const setClause = fields.map((field, i) => `"${field}" = $${i + 1}`).join(", ");

        const query = `
            UPDATE users
            SET ${setClause}, updated_at = NOW()
            WHERE id = $${fields.length + 1}
            RETURNING *;
        `;

        const result = await pool.query(query, [...values, userId]);
        return result.rows[0] || null;
    },

    async createGhostUser(email: string) {
        const { rows } = await pool.query(
            `INSERT INTO users (
                email,
                first_name,
                last_name,
                password_hash,
                active,
                verified
            )
            VALUES ($1, 'Pending', 'User', '', false, false)
            ON CONFLICT (email) DO NOTHING
            RETURNING *`,
            [email]
        );

        if (rows.length === 0) {
            const existing = await pool.query(
                `SELECT * FROM users WHERE email = $1 LIMIT 1`,
                [email]
            );
            return existing.rows[0];
        }

        return rows[0];
    },

    async activateUser(userId: string) {
        await pool.query(
        `UPDATE users
        SET active = true,
            verified = true,
            updated_at = NOW()
        WHERE id = $1`,
        [userId]
        );
    },

    async setPassword(userId: string, password: string) {
        const hash = bcrypt.hashSync(password, 10);

        await pool.query(
            `UPDATE users
            SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2`,
            [hash, userId]
        );
    },
};