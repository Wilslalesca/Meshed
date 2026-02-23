import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error("Unhandled error:", err);
    console.error(err);
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};


