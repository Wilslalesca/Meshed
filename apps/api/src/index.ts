import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { testingAccountGeneration } from './scripts/seedUsers';



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));


app.get("/health", (_, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.listen(config.port, async() => {
    console.log(`API on http://localhost:${config.port}`);

    await testingAccountGeneration(); // function for calling 3 test accounts see our docs 
});