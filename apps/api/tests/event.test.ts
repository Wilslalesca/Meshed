import { describe, expect, test, vi } from 'vitest';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel';
import { makeHttp } from './utils/http';
import { mockDbEvent, mockFormattedEvent } from './utils/fixtures';
import { EventEmailService } from "../src/services/eventEmailService";

vi.mock('@/models/EventModel');
vi.mock('@/services/eventEmailService');

//Test all event controller functions
//getAllEvents
describe('EventController.getAllEvents', () => {
  test('should return formatted events', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();

    vi.mocked(EventModel.getAll).mockResolvedValue([mockDbEvent]);
    await EventController.getAllEvents(req, res);

    expect(EventModel.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([mockFormattedEvent]);
  });
});

//updateEventStatus, both approved + denied
describe('EventController.updateEventStatus', () => {
  test('should update status to approved', async () => {
    vi.clearAllMocks();
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

  test('should update status to denied', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    req.params = { id: 'event-2', status: 'denied' };
    req.body = { comments: 'Please fix' };

    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    vi.mocked(EventEmailService.sendBookingStatusUpdateEmail).mockResolvedValue(undefined);
    
    await EventController.updateEventStatus(req, res);

    expect(EventModel.updateStatus).toHaveBeenCalledWith('event-2', 'denied', 'Please fix');
    expect(EventEmailService.sendBookingStatusUpdateEmail).toHaveBeenCalledWith('event-2');
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should fail', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    req.params = { id: 'event-3' };
    req.body = { comments: 'Please fix' };

    vi.mocked(EventModel.updateStatus).mockResolvedValue(false);
    
    await EventController.updateEventStatus(req, res);

    expect(EventModel.updateStatus).toHaveBeenCalledWith('event-3','Please fix');
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });
});

