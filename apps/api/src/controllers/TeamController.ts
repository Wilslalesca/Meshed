// apps/api/src/controllers/TeamController.ts
import { Request, Response } from "express";
import { TeamModel } from "../models/TeamModel";
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
  /** GET /teams/mine */
  static async getMyTeams(req: Request, res: Response) {
    const uid = getUserId(req);
    if (!uid) {
      // not logged in yet – empty list so UI can still render
      return res.json([]);
    }

    const teams = await TeamModel.findForUser(uid);
    return res.json(teams);
  }

  /** POST /teams */
  static async createTeam(req: Request, res: Response) {
    const { name, sport_id, season, league_id } = req.body || {};

    if (!name || String(name).trim().length < 2) {
      return res.status(400).send("name required");
    }

    const team = await TeamModel.create({
      name: String(name).trim(),
      sport_id: sport_id || null,
      season: season || null,
      league_id: league_id || null,
    });

    const uid = getUserId(req);
    if (uid) {
      await TeamModel.addManagerToTeam(uid, team.id);
    }

    return res.status(201).json(team);
  }
    static async getTeamAthletes(req: Request, res: Response) {
    const { teamId } = req.params;
    const athletes = await TeamModel.getAthletes(teamId);
    return res.json(athletes);
  }

  /** POST /teams/:teamId/athletes { userId } */
  static async addAthleteToTeam(req: any, res: Response) {
    if (!isManagerOrAdmin(req)) {
      return res.status(403).send("Forbidden");
    }

    const { teamId } = req.params;
    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).send("userId required");
    }

    try {
      await TeamModel.addAthlete(teamId, userId);
      return res.status(204).send(); // no content, success
    } catch (err: any) {
      return res.status(400).send(err.message ?? "Could not add athlete");
    }
  }
    /** POST /teams/:teamId/athletes/by-email { email } */
  static async addAthleteByEmail(req: any, res: Response) {
    if (!isManagerOrAdmin(req)) {
      return res.status(403).send("Forbidden");
    }

    const { teamId } = req.params;
    const { email } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).send("email required");
    }

    const user = await UserModel.findByEmail(email.trim());
    if (!user) {
      return res.status(404).send("User not found");
    }

    try {
      await TeamModel.addAthlete(teamId, user.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).send(err.message ?? "Could not add athlete");
    }
  }

}
