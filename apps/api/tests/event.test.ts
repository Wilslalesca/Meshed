import { describe, expect, test, vi } from 'vitest';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel';
import { makeHttp } from './utils/http';
import { mockDbEvent, mockFormattedEvent } from './utils/fixtures';
import { EventEmailService } from "../src/services/eventEmailService";

vi.mock('@/models/EventModel');


describe('EventController.getAllEvents', () => {
  test('should return formatted events', async () => {
    const { req, res } = makeHttp();

    vi.mocked(EventModel.getAll).mockResolvedValue([mockDbEvent]);
    await EventController.getAllEvents(req, res);

    expect(EventModel.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([mockFormattedEvent]);
  });
});

describe('EventController.updateEventStatus', () => {
  test('should update status to approved', async () => {
    const { req, res } = makeHttp();
    req.params = { id: 'event-1', status: 'approved' };
    req.body = { comments: 'LGTM' };

    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    vi.mocked(EventEmailService.sendBookingStatusUpdateEmail).mockResolvedValue(undefined);
    
    await EventController.updateEventStatus(req, res);

    expect(EventModel.updateStatus).toHaveBeenCalledWith('event-1', 'approved', 'LGTM');
    expect(EventEmailService.sendBookingStatusUpdateEmail).toHaveBeenCalledWith('event-1');
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

