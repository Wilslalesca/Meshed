import { Request, Response } from "express";
import { EventModel } from "../models/EventModel";

export class EventController {

    getConflicts(){
        return
    }

    static async getAllEvents(res: Response) { 
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
        
        res.json(formattedEvents);
    }

    static async getConflictingFacilityEvents(req: Request, res: Response){
        const {facilityId }= req.params;
        const status = 'pending'
        const events = await EventModel.getAllStatusFacilityRequests(facilityId, status);
        const toReturn: Array<{
            id: string;
            teamId: string;
            teamFacilityId: string;
            name: string;
            type: string;
            startTime: string;
            endTime: string;
            startDate: Date;
            endDate: Date;
            reoccurring: boolean;
            selectedReoccurrType: string;
            dayOfWeek: string;
            status: string;
            opponent: string;
            homeAway: string;
            liftType: string;
            notes: string;
        }> = []

        if(!events){
            return
        } 
        else{
            const conflictPromises = events.map(async event => {
                const conflicts = await EventModel.checkConflicts(event.team_facility_id, event.start_date, event.start_time, event.end_time, event.id);
                if (conflicts) {
                    return conflicts.map(conflict => ({
                        id: conflict.id,
                        teamId: conflict.team_id,
                        teamFacilityId: conflict.team_facility_id,
                        name: conflict.name,
                        type: conflict.type,
                        startTime: conflict.start_time,
                        endTime: conflict.end_time,
                        startDate: conflict.start_date,
                        endDate: conflict.end_date,
                        reoccurring: conflict.reoccurring,
                        selectedReoccurrType: conflict.reoccurr_type,
                        dayOfWeek: conflict.day_of_week,
                        status: conflict.status,
                        opponent: conflict.opponent,
                        homeAway: conflict.home_away,
                        liftType: conflict.lift_type,
                        notes: conflict.notes,
                    }));
                }
                return [];
            });

            const allConflicts = await Promise.all(conflictPromises);
            const flattenedConflicts = allConflicts.flat();
            

            const uniqueConflicts = flattenedConflicts.filter((conflict, index, arr) => 
                arr.findIndex(c => c.id === conflict.id) === index
            );
            
            toReturn.push(...uniqueConflicts);
        }
        
        res.json(toReturn)
    }

    static async getStatusFacilityEvents(req: Request, res: Response){
        const {facilityId, status }= req.params;
        const events = await EventModel.getAllStatusFacilityRequests(facilityId, status);
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

    static async updateEventStatus(req: Request, res: Response){
        const {id, status }= req.params;
        const event = await EventModel.updateStatus(id, status);
        res.json(event)
    }
}