import 'dotenv/config';

const requiredEnv = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

if (process.env.NODE_ENV !== "test") {
  requiredEnv.push("DATABASE_URL", "GMAIL_APP_EMAIL", "GMAIL_APP_PASSWORD");
}

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
});



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
    gmailEmail: process.env.GMAIL_APP_EMAIL!,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD!,
    
};
