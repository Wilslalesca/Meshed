import 'dotenv/config';

const requiredEnv = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "DATABASE_URL"] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.warn(`ERROR: Missing environment variable ${key}`);
        process.exit(1);
    }
}

export const config = {
    port: Number(process.env.PORT ?? 4000),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    databaseUrl: process.env.DATABASE_URL!,
    accessTtl: process.env.ACCESS_TTL ?? '15m',
    refreshTtl: process.env.REFRESH_TTL ?? '7d',
    cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
    nodeEnv: process.env.NODE_ENV ?? 'development',
    // Provider-agnostic SMTP config (preferred)
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    smtpSecure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailFrom: process.env.MAIL_FROM,

    // Backwards-compat for older dev envs (deprecated)
    legacyGmailUser: process.env.GMAIL_APP_EMAIL,
    legacyGmailPass: process.env.GMAIL_APP_PASSWORD,
};