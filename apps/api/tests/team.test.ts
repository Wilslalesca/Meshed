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