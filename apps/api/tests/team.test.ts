import { describe, expect, test, vi } from 'vitest';
import { TeamController } from '../src/controllers/TeamController';
import { TeamModel } from '../src/models/TeamModel';
import { makeHttp } from './utils/http';
import { mockUser, mockTeam } from './utils/fixtures';
import { attachUser } from "./utils/auth"

vi.mock('@/models/TeamModel')

describe('TeamController.getMyTeams', () => {
    test('should return formatted team(s)', async () => {
        const { req, res } = makeHttp()
        const authReq = attachUser(req, mockUser)

        vi.mocked(TeamModel.findForUser).mockResolvedValue([mockTeam])
        await TeamController.getMyTeams(authReq, res)
    
        expect(TeamModel.findForUser).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith([mockTeam])

  });
});

describe('TeamController.createTeam', () => {
    test('should create a team', async () => {
        const { req, res } = makeHttp()
        const authReq = attachUser(req, mockUser)
        authReq.body = mockTeam

        vi.mocked(TeamModel.createTeam).mockResolvedValue([mockTeam])
        await TeamController.createTeam(authReq, res)
    
        expect(TeamModel.createTeam).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(201)
  });
  test('should NOT create a team', async () => {
        const { req, res } = makeHttp()

        vi.mocked(TeamModel.createTeam).mockResolvedValue([mockTeam])
        await TeamController.createTeam(req, res)
    
        expect(TeamModel.createTeam).toHaveBeenCalledTimes(0)
        expect(res.status).toHaveBeenCalledWith(500)
  });
});