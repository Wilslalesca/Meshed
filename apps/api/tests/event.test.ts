import { describe, expect, test, vi } from 'vitest';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel';
import { makeHttp } from './utils/http';
import { mockDbEvent, mockFormattedEvent } from './utils/fixtures';

vi.mock('@/models/EventModel');


describe('EventController.getAllEvents', () => {
  test('should return formatted events', async () => {
    const { req, res } = makeHttp();

    vi.mocked(EventModel.getAll).mockResolvedValue([mockDbEvent]);
    await EventController.getAllEvents(req, res);

    expect(EventModel.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([mockFormattedEvent]);
  });

  test('change event status', async () => {
    const success_json = {
      success : true
    };

    const { req, res } = makeHttp();

    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    await EventController.updateEventStatus(req, res);

    expect(EventModel.updateStatus).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(success_json);
  });
});

