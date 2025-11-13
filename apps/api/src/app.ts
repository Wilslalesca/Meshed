import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config/config";
import routes from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(requestLogger);

app.get("/health", (_req, res) =>
    res.json({ ok: true, time: new Date().toISOString() })
);
app.use("/", routes);

// NOTE: the error handling must always be the last app.use call
app.use(errorHandler);
export default app;
