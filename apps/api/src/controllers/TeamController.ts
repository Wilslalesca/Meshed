import { Request, Response } from "express";
import { TeamModel } from "../models/TeamModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { UserModel } from "../models/UserModel";

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
        if (!uid) return res.json([]);
        const teams = await TeamModel.findForUser(uid);
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

        const uid = getUserId(req);
        if (uid) await TeamRosterModel.addToTeam(team.id, uid, "manager", null);

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

        const user = await UserModel.findByEmail(email.trim());
        if (!user) return res.status(404).send("User not found");

        await TeamRosterModel.addToTeam(teamId, user.id, "athlete", null);

        res.status(204).send();
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

    static async getStaff(req: Request, res: Response) {
        const { teamId } = req.params;
        const staff = await TeamStaffModel.getStaff(teamId);
        return res.json(staff);
    }

    static async addStaff(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { teamId } = req.params;
        const { email, role, notes } = req.body;

        if (!email) return res.status(400).send("email required");

        let user = await UserModel.findByEmail(email.trim());
        if (!user || user.id === null) {
            user = await UserModel.createGhostUser(email.trim());
        }

        if (!user || user.id == null) {
            return res.status(500).send("Unable to create or find user");
        }

        await TeamStaffModel.addStaff(teamId, user.id, role, notes);

        return res.json({ success: true });
    }

    static async updateStaff(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { staffId } = req.params;
        const updated = await TeamStaffModel.updateStaff(staffId, req.body);
        if (!updated) return res.status(404).send("not found");

        return res.json(updated);
    }

    static async deleteStaff(req: any, res: Response) {
        if (!isManagerOrAdmin(req)) return res.status(403).send("Forbidden");

        const { staffId } = req.params;

        await TeamStaffModel.removeStaff(staffId);
        return res.json({ success: true });
    }
}
