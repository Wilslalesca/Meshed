import 'dotenv/config';

export const config = {
    port: Number(process.env.PORT ?? 3000),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessTtl: process.env.ACCESS_TTL ?? '15m',
    refreshTtl: process.env.REFRESH_TTL ?? '7d',
    cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
    nodeEnv: process.env.NODE_ENV ?? 'development',
};

if (!config.accessSecret || !config.refreshSecret) {
    console.warn('\u26a0\ufe0f JWT secrets missing. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.');
}

