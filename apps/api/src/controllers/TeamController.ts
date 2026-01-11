import { Request, Response } from "express";
import { TeamModel } from "../models/TeamModel";
import { TeamEventModel } from "../models/TeamEventModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { UserModel } from "../models/UserModel";
import { sendEmail } from "../services/emailService";
import { InviteModel } from "../models/InviteModel";
import crypto from "crypto";

function getUserId(req: any): string | undefined {
    return (
        req?.user?.id ??
        req?.userId ??
        req?.auth?.id ??
        req?.locals?.user?.id ??
        req?.res?.locals?.user?.id
    );
}

function isManagerOrAdmin(req: any): boolean {
    const role = req.user?.role;
    return role === "manager" || role === "admin";
}

export class TeamController {
    static async getMyTeams(req: Request, res: Response) {
        const uid = getUserId(req);
        console.log("Getting Teams" );
        console.log("User ID:", uid);


        if (!uid) return res.json([]);
        const teams = await TeamModel.findForUser(uid);
        console.log("Found Teams:", teams.length);
        res.json(teams);
    }

    static async getTeamById(req: Request, res: Response) {
        const { teamId } = req.params;
        const team = await TeamModel.getTeam(teamId);
        if (!team) return res.status(404).send("Team not found");
        res.json(team);
    }

    static async createTeam(req: Request, res: Response) {
        const { name, sport_id, season, league_id, gender } = req.body;

        if (!name || name.trim().length < 2)
            return res.status(400).send("name required");


        const team = await TeamModel.createTeam({
            name: name.trim(),
            sport_id: sport_id || null,
            season: season || null,
            league_id: league_id || null,
            gender: gender || null,
        });

        console.log("Created team:", team);

        const uid = getUserId(req);
        if (uid) {
            await TeamStaffModel.addStaff(team.id, uid, "manager", null);
        }

        res.status(201).json(team);
    }

    static async updateTeam(req: Request, res: Response) {
        const { teamId } = req.params;

        const updated = await TeamModel.updateTeam(teamId, {
            name: req.body.name,
            sport_id: req.body.sport_id || null,
            season: req.body.season || null,
            league_id: req.body.league_id || null,
            gender: req.body.gender || null,
        });

        if (!updated) return res.status(404).send("not found");
        res.json(updated);
    }

    static async deleteTeam(req: Request, res: Response) {
        await TeamModel.deleteTeam(req.params.teamId);
        res.json({ success: true });
    }

    static async getTeamAthletes(req: Request, res: Response) {
        const { teamId } = req.params;
        const athletes = await TeamRosterModel.getAthletes(teamId);
        res.json(athletes);
    }

    static async addAthleteByEmail(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { teamId } = req.params;
        const { email } = req.body;

        if (!email) return res.status(400).send("email required");

        let user = await UserModel.findByEmail(email.trim());
        let isGhost = false;

        if (!user) {
            user = await UserModel.createGhostUser(email.trim());
            isGhost = true;
        }

        await TeamRosterModel.addToTeam(teamId, user!.id, "athlete", null);
        
        const team = await TeamModel.getTeam(teamId);
        if (!team) return res.status(500).send("Team not found");

        if (isGhost) {
            const token = crypto.randomBytes(32).toString("hex");
            await InviteModel.createInvite(teamId, email, "athlete", null, token);
            await sendEmail.sendEmailInvite(email, team.name, token);

        } 
        else {
            await sendEmail.sendAddedToTeamEmail(email, team!.name, "athlete");
        }    

        return res.status(204).send();
    }

    static async removeAthlete(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { teamId, userId } = req.params;
        await TeamRosterModel.removeAthlete(teamId, userId);
        return res.json({ success: true });
    }
    static async updateAthlete(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { teamId, userId } = req.params;
        const { position, status } = req.body;

        const updated = await TeamRosterModel.updateAthlete(teamId, userId, {
            position: position ?? null,
            status: status ?? null,
        });

        if (!updated) return res.status(404).send("Athlete not found");

        return res.json(updated);
    }

    static async addEvent(req: Request, res: Response) {

        const { 
            teamId,
            type,
            startTime,
            endTime,
            startDate,
            endDate,
            reoccurring,
            selectedReoccurrType,
            dayOfWeek,
            opponent,
            homeAway,
            liftType,
            notes,
        }  = req.body;

        const team_event = await TeamEventModel.createTeamEvent({
            team_id : teamId,
            type : type,
            start_time :startTime,
            end_time :endTime,
            start_date : startDate,
            end_date :endDate,
            reoccurring : reoccurring,
            reoccurr_type :selectedReoccurrType,
            day_of_week :dayOfWeek,
            opponent :opponent,
            home_away :homeAway,
            lift_type :liftType,
            notes :notes,
        });

        console.log("Created team_event:", team_event);

        res.status(201).json(team_event);
    }

    static async getEvents(req: Request, res: Response) { 
        const { teamId } = req.params;
        const events = await TeamEventModel.getByTeamId(teamId);
        res.json(events);
    }

}
