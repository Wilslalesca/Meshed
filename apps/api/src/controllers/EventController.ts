import { Request, Response } from "express";
import { EventModel } from "../models/EventModel";

export class EventController {
    static async getAllEvents(req: Request, res: Response) { 
        const events = await EventModel.getAll();

        const formattedEvents = events.map(event => ({
            id: event.id,
            teamId: event.team_id,
            teamFacilityId: event.team_facility_id,
            name: event.name,
            type: event.type,
            startTime: event.start_time,
            endTime: event.end_time,
            startDate: event.start_date,
            endDate: event.end_date,
            reoccurring: event.reoccurring,
            selectedReoccurrType: event.reoccurr_type,
            dayOfWeek: event.day_of_week,
            status: event.status,
            opponent: event.opponent,
            homeAway: event.home_away,
            liftType: event.lift_type,
            notes: event.notes,
        }));
        
        res.json(formattedEvents);
    }
}