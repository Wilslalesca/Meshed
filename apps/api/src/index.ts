import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { loadUsers } from './db';


loadUsers();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));


app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.listen(config.port, () => {
    console.log(`API on http://localhost:${config.port}`);
});