import { Request, Response } from "express";
import { EventModel } from "../models/EventModel";

export class EventController {
    static async getAllEvents(req: Request, res: Response) { 
        const events = await EventModel.getAll();
        res.json(events);
    }
}