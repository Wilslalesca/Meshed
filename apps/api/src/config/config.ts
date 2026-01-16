import 'dotenv/config';

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
    gmailEmail: process.env.GMAIL_EMAIL!,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD!,
    
};

["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "DATABASE_URL", "GMAIL_EMAIL", "GMAIL_APP_PASSWORD"].forEach((key) => {
    if (!process.env[key]) {
        console.warn(`ERROR: Missing environment variable ${key}`);
        process.exit(1);
    }
});