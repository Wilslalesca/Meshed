import { describe, expect, test, vi } from 'vitest';
import { FacilityController } from '../src/controllers/FacilityController';
import { FacilityModel } from '../src/models/FacilityModel';
import { makeHttp } from './utils/http';
import { mockFacility } from './utils/fixtures';
import { makeAuthedRequest } from "./utils/auth"

vi.mock('@/models/FacilityModel');

//getAllFacilities
describe('EventController.getAllEvents', () => {
  test('should return formatted facilities', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    const authReq = makeAuthedRequest(req)

    vi.mocked(FacilityModel.findAll).mockResolvedValue([mockFacility]);
    await FacilityController.list(authReq, res);

    expect(FacilityModel.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([mockFacility]);
  });
});