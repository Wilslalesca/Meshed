import { Request, Response } from "express";
import { TeamModel } from "../models/TeamModel";
import { TeamEventModel } from "../models/TeamEventModel";
import { TeamRosterModel } from "../models/TeamRosterModel";
import { TeamStaffModel } from "../models/TeamStaffModel";
import { UserModel } from "../models/UserModel";
import { sendEmail } from "../services/emailService";
import { InviteModel } from "../models/InviteModel";
import crypto from "crypto";
import * as xlsx from "xlsx";


async function isTeamManagerOrAdmin(req: Request, teamId: string): Promise<boolean> {
    const { userId } = req.params;
    if (!userId) return false;
    const user = await UserModel.findById(userId);
    if (!user) return false;

    if (user.role === "admin") return true;

    const staff = await TeamStaffModel.findStaffRecord(teamId, userId);
    return staff?.role === "manager";
}

export class TeamController {
    static async getMyTeams(req: Request, res: Response) {
        const { userId } = req.params;
        console.log("Getting Teams" );
        console.log("User ID:", userId);


        if (!userId) return res.json([]);
        const teams = await TeamModel.findForUser(userId);
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
        try {
            const { name, sport_id, season, league_id, gender } = req.body;

            if (!name || name.trim().length < 1)
                return res.status(400).send("name required");

            const team = await TeamModel.createTeam({
                name: name.trim(),
                sport_id: sport_id || null,
                season: season || null,
                league_id: league_id || null,
                gender: gender || null,
            });

            const { userId } = req.params;
            if (userId) {
                await TeamStaffModel.addStaff(team.id, userId, "manager", null);
            }

            res.status(201).json(team);
        } catch (err) {
            res.status(500).send("Failed to create team");
        }
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

    static async addAthleteByEmail(req: Request, res: Response) {
        const { teamId } = req.params;
        if (!(await isTeamManagerOrAdmin(req, teamId))) return res.status(403).send("Forbidden");
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

    static async bulkAddAthletesByCsv(req: Request, res: Response) {
        const { teamId } = req.params;
        if (!(await isTeamManagerOrAdmin(req, teamId))) return res.status(403).send("Forbidden");
        const file = req.file;

        if (!file) return res.status(400).send("CSV file required");

        const team = await TeamModel.getTeam(teamId);
        if (!team) return res.status(404).send("Team not found");

        try {
            // Determine file type by extension
            const name: string = (file.originalname ?? "").toLowerCase();
            const isCsv = name.endsWith(".csv");
            const isXlsx = name.endsWith(".xlsx") || name.endsWith(".xls");

            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const emails: string[] = [];

            if (isCsv) {
                const csvContent: string = file.buffer.toString("utf-8");
                const lines: string[] = csvContent.split(/\r?\n/).filter((line: string) => line.trim());
                for (const line of lines) {
                    const matches = line.match(emailRegex) as string[] | null;
                    if (matches) emails.push(...matches);
                }
            } else if (isXlsx) {
                const wb = xlsx.read(file.buffer, { type: "buffer" });
                const sheetNames = wb.SheetNames ?? [];
                for (const sn of sheetNames) {
                    const ws = wb.Sheets[sn];
                    if (!ws) continue;
                    const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
                    for (const row of rows) {
                        if (!Array.isArray(row)) continue;
                        for (const cell of row) {
                            if (typeof cell !== "string") continue;
                            const matches = cell.match(emailRegex) as string[] | null;
                            if (matches) emails.push(...matches);
                        }
                    }
                }
            } else {
                return res.status(400).json({ success: false, message: "Unsupported file type. Use CSV or Excel (.xlsx/.xls)." });
            }

            if (emails.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "No valid email addresses found in file" 
                });
            }

            // Remove duplicates
            const uniqueEmails = [...new Set(emails.map(e => e.trim().toLowerCase()))];

            const results = {
                success: 0,
                failed: 0,
                errors: [] as string[],
            };

            // Add each athlete
            for (const email of uniqueEmails) {
                try {
                    let user = await UserModel.findByEmail(email);
                    let isGhost = false;

                    if (!user) {
                        user = await UserModel.createGhostUser(email);
                        isGhost = true;
                    }

                    if (!user) {
                        results.failed++;
                        results.errors.push(`${email}: Failed to create user`);
                        continue;
                    }

                    await TeamRosterModel.addToTeam(teamId, user.id, "athlete", null);

                    if (isGhost) {
                        const token = crypto.randomBytes(32).toString("hex");
                        await InviteModel.createInvite(teamId, email, "athlete", null, token);
                        await sendEmail.sendEmailInvite(email, team.name, token);
                    } else {
                        await sendEmail.sendAddedToTeamEmail(email, team.name, "athlete");
                    }

                    results.success++;
                } catch (err) {
                    results.failed++;
                    results.errors.push(`${email}: ${err instanceof Error ? err.message : "Unknown error"}`);
                }
            }

            return res.json({
                success: true,
                message: `Added ${results.success} athletes. ${results.failed} failed.`,
                details: results,
            });

        } catch (err) {
            console.error("Error processing CSV:", err);
            return res.status(500).json({ 
                success: false, 
                message: err instanceof Error ? err.message : "Error processing CSV file" 
            });
        }
    }

    static async removeAthlete(req: Request, res: Response) {
        const { teamId, userId } = req.params;
        if (!(await isTeamManagerOrAdmin(req, teamId))) return res.status(403).send("Forbidden");
        await TeamRosterModel.removeAthlete(teamId, userId);
        return res.json({ success: true });
    }
    static async updateAthlete(req: Request, res: Response) {
        const { teamId, userId } = req.params;
        if (!(await isTeamManagerOrAdmin(req, teamId))) return res.status(403).send("Forbidden");
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
            teamFacilityId,
            name,
            type,
            startTime,
            endTime,
            startDate,
            endDate,
            reoccurring,
            selectedReoccurrType,
            dayOfWeek,
            status,
            opponent,
            homeAway,
            liftType,
            notes,
        }  = req.body;

        const team_event = await TeamEventModel.createTeamEvent({
            team_id : teamId,
            team_facility_id:teamFacilityId,
            name:name,
            type : type,
            start_time :startTime,
            end_time :endTime,
            start_date : startDate,
            end_date :endDate,
            reoccurring : reoccurring,
            reoccurr_type :selectedReoccurrType,
            day_of_week :dayOfWeek,
            status:status,
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
