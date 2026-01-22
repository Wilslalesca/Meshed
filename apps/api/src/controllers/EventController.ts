import { Request, Response } from "express";
import { EventModel } from "../models/EventModel";

export class EventController {

    getConflicts(){
        return
    }

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

        

        //GO in and loop through each day
        //check if any overlapping times
        //update the conflict boolean in JSON

        res.json(formattedEvents);
    }

    static async getFacilityEvents(req: Request, res: Response) { 
        const {facilityId }= req.params;
        const events = await EventModel.getForFacility(facilityId);

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

        //GO in and loop through each day
        //check if any overlapping times
        //update the conflict boolean in JSON
        
        res.json(formattedEvents);
    }

    static async getPendingFacilityEvents(req: Request, res: Response){
        const {facilityId }= req.params;
        const events = await EventModel.getAllPendingFacilityRequests(facilityId);
        const toReturn = []
        if(!events){
            return
        }else{
            events.forEach(event => {
                if(EventModel.checkConflicts(event.team_facility_id, event.start_date, event.start_time, event.end_time, event.id)){
                    toReturn.append(event);
                }
                
            });
        }
    }
}