import { describe, expect, test, vi } from 'vitest';
import { FacilityController } from '../src/controllers/FacilityController';
import { FacilityModel } from '../src/models/FacilityModel';
import { makeHttp } from './utils/http';
import { mockFacility, mockUser } from './utils/fixtures';
import { attachUser } from "./utils/auth"

vi.mock('@/models/FacilityModel')

//getAllFacilities
describe('FacilityController.list', () => {
  test('should return formatted facilities', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()
    const authReq = attachUser(req, mockUser)

    vi.mocked(FacilityModel.findAll).mockResolvedValue([mockFacility])
    await FacilityController.list(authReq, res)

    expect(FacilityModel.findAll).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith([mockFacility])
  });
});

//Add a facility
describe('FacilityController.create', () => {
  test('should add a facility', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()
    const authReq = attachUser(req, mockUser)
    authReq.body = {name:"Currie Centre"}

    vi.mocked(FacilityModel.create).mockResolvedValue(mockFacility)
    await FacilityController.create(authReq, res)

    expect(FacilityModel.create).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(mockFacility)
  });

  test('should return unauthorized', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()
    req.body = {name:"Currie Centre"}

    vi.mocked(FacilityModel.create).mockResolvedValue(mockFacility)
    await FacilityController.create(req, res)

    expect(FacilityModel.create).toHaveBeenCalledTimes(0)
    expect(res.status).toHaveBeenCalledWith(401)
  });
});