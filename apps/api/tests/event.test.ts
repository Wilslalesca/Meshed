import { describe, expect, test, vi } from 'vitest';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel';
import { makeHttp } from './utils/http';
import { mockDbEvent, mockFormattedEvent, mockUser } from './utils/fixtures';
import { EventEmailService } from "../src/services/eventEmailService";
import { attachUser } from "../tests/utils/auth"

vi.mock('@/models/EventModel');
vi.mock('@/services/eventEmailService');

//The purpose of this testing file is to test all EventController functions

//getAllEvents
describe('EventController.getAllEvents', () => {
  test('should return formatted events', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    const authReq = attachUser(req, mockUser)

    vi.mocked(EventModel.getAll).mockResolvedValue([mockDbEvent]);
    await EventController.getAllEvents(authReq, res);

    expect(EventModel.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([mockFormattedEvent]);
  });
});

//updateEventStatus, both approved + denied and missing status
describe('EventController.updateEventStatus', () => {
  test('should update status to approved', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    const authReq = attachUser(req, mockUser)
    authReq.params = { id: 'event-1', status: 'approved' };
    authReq.body = { comments: 'LGTM' };

    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    vi.mocked(EventEmailService.sendBookingStatusUpdateEmail).mockResolvedValue(undefined);
    
    await EventController.updateEventStatus(authReq, res);

    expect(EventModel.updateStatus).toHaveBeenCalledWith('event-1', 'approved', 'LGTM');
    expect(EventEmailService.sendBookingStatusUpdateEmail).toHaveBeenCalledWith('event-1');
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should update status to denied', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    const authReq = attachUser(req, mockUser)
    authReq.params = { id: 'event-2', status: 'denied' };
    authReq.body = { comments: 'Please fix' };

    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    //vi.mocked(EventEmailService.sendBookingStatusUpdateEmail).mockResolvedValue(undefined);
    
    await EventController.updateEventStatus(authReq, res);

    expect(EventModel.updateStatus).toHaveBeenCalledWith('event-2', 'denied', 'Please fix');
    //expect(EventEmailService.sendBookingStatusUpdateEmail).toHaveBeenCalledWith('event-2');
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should fail because no status', async () => {
    vi.clearAllMocks();
    const { req, res } = makeHttp();
    const authReq = attachUser(req, mockUser)
    authReq.params = { id: 'event-3' };
    authReq.body = { comments: 'Please fix' };
    
    await EventController.updateEventStatus(authReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Status is required" });
    expect(EventModel.updateStatus).not.toHaveBeenCalled();
  });
});

