import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
<<<<<<< HEAD
import lookUpRoutes from './routes/lookup.routes';
import { testingAccountGeneration } from './scripts/seedUsers';
import { seedLeaguesAndSports } from "./scripts/seedLeagueAndSport";    
=======
import uploadRoutes from './routes/upload.routes';
import scheduleRoutes from './routes/schedule.routes';
import { testingAccountGeneration, testingAddingUserToath } from './scripts/seedUsers';
>>>>>>> 06eb613a2b1a1699311cb551344690740cc6c29a


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));


app.get("/health", (_, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
<<<<<<< HEAD
app.use('/lookups', lookUpRoutes);

=======
app.use('/upload', uploadRoutes);
app.use('/schedule', scheduleRoutes);
>>>>>>> 06eb613a2b1a1699311cb551344690740cc6c29a

app.listen(config.port, async() => {
    console.log(`API on http://localhost:${config.port}`);

    await testingAccountGeneration(); // function for calling 3 test accounts see our docs 
<<<<<<< HEAD
    await seedLeaguesAndSports(); // function for seeding leagues and sports
=======
    await testingAddingUserToath();

>>>>>>> 06eb613a2b1a1699311cb551344690740cc6c29a
});