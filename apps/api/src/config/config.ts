import 'dotenv/config';

const requiredEnv = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"] as const;

type RequiredEnvKey = (typeof requiredEnv)[number] | "DATABASE_URL";

const envToCheck: RequiredEnvKey[] = [...requiredEnv];

if (process.env.NODE_ENV !== "test") {
    envToCheck.push("DATABASE_URL");
}

for (const key of envToCheck) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable ${key}`);
    }
}

export const config = {
    port: Number(process.env.PORT ?? 4000),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    databaseUrl: process.env.DATABASE_URL!,
    accessTtl: process.env.ACCESS_TTL ?? '8h',
    refreshTtl: process.env.REFRESH_TTL ?? '7d',
    cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
    nodeEnv: process.env.NODE_ENV ?? 'development',

    // Provider-agnostic SMTP config
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    smtpSecure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailFrom: process.env.MAIL_FROM,

    // Convenience Gmail config (for local/dev): uses Gmail SMTP under the hood
    gmailAppEmail: process.env.GMAIL_APP_EMAIL,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
};