import { Request, Response } from "express";
import { EventModel } from "../models/EventModel";
import { TeamEvent } from "../types/event";

function formatEvent(event: any) {
    return {
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
        facilityNotes: event.facility_notes,
        requestedByUserId: event.requested_by_user_id,
        requestedByName: event.requested_by_name,
        requestedByEmail: event.requested_by_email,
    };
}



export class EventController {

    getConflicts(){
        return
    }

    
    static async getAllEvents(_req: Request, res: Response) { 
        const events = await EventModel.getAll();
        const formattedEvents = events.map(formatEvent);
        if(!formattedEvents) return [];

        res.json(formattedEvents);
    }

    static async getFacilityEvents(req: Request, res: Response) { 
        console.log(req.params)
        const {facilityId }= req.params;
        const events = await EventModel.getForFacility(facilityId);
        const formattedEvents = events.map(formatEvent);
        res.json(formattedEvents);
    }

    static async getConflictingFacilityEvents(req: Request, res: Response){
        const {facilityId }= req.params;
        const events = await EventModel.getAllStatusFacilityRequests(facilityId, status);
        
        if (!events || events.length === 0) return res.json([]);

        const conflictPromises = events.map(async event => {
            const conflicts = await EventModel.checkConflicts(event.team_facility_id, event.start_date, event.start_time, event.end_time, event.id);
            return conflicts ? conflicts.map(formatEvent) : [];
        });

        const conflicts = await Promise.all(conflictPromises);
        const flattenedConflicts = conflicts.flat();

        const nonDupConflicts = flattenedConflicts.filter(
            (conflict, index, self) => 
                self.findIndex((c) => c.id === conflict.id) === index
        );
        res.json(nonDupConflicts);
    }

    static async getStatusFacilityEvents(req: Request, res: Response){
        console.log(req.params)
        const {facilityId, status }= req.params;
        const events = await EventModel.getAllStatusFacilityRequests(facilityId, status);
        const formattedEvents = events.map(formatEvent);
        res.json(formattedEvents);
    }

    static async updateEventStatus(req: Request, res: Response){
        const {id, status, comments }= req.params;
        const event = await EventModel.updateStatus(id, status, comments);
        res.json(event)
    }
}