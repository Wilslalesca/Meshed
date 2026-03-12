import { describe, expect, vi, test } from 'vitest';
import { Request, Response } from 'express';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel'

vi.mock('@/models/EventModel');

const mockRequest = (params = {}, body = {}): Partial<Request> => ({
  params,
  body,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

const mockDbEvent = {
  id: '1',
  team_id: 'team-1',
  team_facility_id: 'facility-1',
  name: 'Practice',
  type: 'Practice',
  start_time: '09:00',
  end_time: '11:00',
  start_date: new Date('2026-03-12'),
  end_date: new Date('2026-03-12'),
  reoccurring: false,
  reoccurr_type: undefined,
  day_of_week: 'Thursday',
  status: 'approved',
  opponent: null,
  home_away: null,
  lift_type: null,
  notes: 'Team practice',
};

const mockFormattedEvent = {
  id: '1',
  teamId: 'team-1',
  teamFacilityId: 'facility-1',
  name: 'Practice',
  type: 'Practice',
  startTime: '09:00',
  endTime: '11:00',
  startDate: new Date('2026-03-12'),
  endDate: new Date('2026-03-12'),
  reoccurring: false,
  selectedReoccurrType: undefined,
  dayOfWeek: 'Thursday',
  status: 'approved',
  opponent: null,
  homeAway: null,
  liftType: null,
  notes: 'Team practice',
};

describe('getAllEvents', () => {
    test('should return formatted events', async () => {
      // Arrange
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;
      
      vi.mocked(EventModel.getAll).mockResolvedValue([mockDbEvent]);

      // Act
      await EventController.getAllEvents(req, res);

      // Assert
      expect(EventModel.getAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([mockFormattedEvent]);
    });
});