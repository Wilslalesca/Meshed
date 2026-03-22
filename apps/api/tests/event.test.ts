import { describe, expect, vi, test } from 'vitest';
import { Request, Response } from 'express';
import { EventController } from '../src/controllers/EventController';
import { EventModel } from '../src/models/EventModel'

vi.mock("../src/models/EventModel", () => ({
  EventModel: {
    getAll: vi.fn(),
    getForFacility: vi.fn(),
    getAllStatusFacilityRequests: vi.fn(),
    checkConflicts: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock("../src/services/eventEmailService", () => ({
  EventEmailService: {
    sendBookingStatusUpdateEmail: vi.fn(),
  },
}));

import { EventController } from "../src/controllers/EventController";
import { EventModel } from "../src/models/EventModel";
import { EventEmailService } from "../src/services/eventEmailService";

function makeReq(params: Record<string, string> = {}, body: unknown = {}): Request {
  return { params, body } as unknown as Request;
}

function makeRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const baseEvent = {
  id: "1",
  team_id: "team-1",
  team_facility_id: "facility-1",
  name: "Practice",
  type: "Practice",
  start_time: "09:00",
  end_time: "11:00",
  start_date: new Date("2026-03-12"),
  end_date: new Date("2026-03-12"),
  reoccurring: false,
  reoccurr_type: undefined,
  day_of_week: "Thursday",
  status: "approved",
  opponent: undefined,
  home_away: undefined,
  lift_type: undefined,
  notes: "Team practice",
  facility_notes: undefined,
  requested_by_user_id: undefined,
  requested_by_name: undefined,
  requested_by_email: undefined,
};

function format(event: typeof baseEvent) {
  return {
    id: event.id,
    teamId: event.team_id,
    teamFacilityId: event.team_facility_id,
    name: event.name,
    type: event.type,
    startTime: event.start_time,
    endTime: event.end_time,
    startDate: event.start_date,
    endDate: event.end_date,
    reoccurring: event.reoccurring,
    selectedReoccurrType: event.reoccurr_type,
    dayOfWeek: event.day_of_week,
    status: event.status,
    opponent: event.opponent,
    homeAway: event.home_away,
    liftType: event.lift_type,
    notes: event.notes,
    facilityNotes: event.facility_notes,
    requestedByUserId: event.requested_by_user_id,
    requestedByName: event.requested_by_name,
    requestedByEmail: event.requested_by_email,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EventController", () => {
  it("getAllEvents returns formatted events", async () => {
    vi.mocked(EventModel.getAll).mockResolvedValue([baseEvent]);

    const res = makeRes();
    await EventController.getAllEvents(
      makeReq(),
      res as unknown as Response
    );

    expect(EventModel.getAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([format(baseEvent)]);
  });

  it("getFacilityEvents fetches by facilityId and returns formatted events", async () => {
    vi.mocked(EventModel.getForFacility).mockResolvedValue([baseEvent]);

    const req = makeReq({ facilityId: "facility-1" });
    const res = makeRes();
    await EventController.getFacilityEvents(req, res as unknown as Response);

    expect(EventModel.getForFacility).toHaveBeenCalledWith("facility-1");
    expect(res.json).toHaveBeenCalledWith([format(baseEvent)]);
  });

  it("getStatusFacilityEvents fetches by facilityId + status and returns formatted events", async () => {
    vi.mocked(EventModel.getAllStatusFacilityRequests).mockResolvedValue([
      baseEvent,
    ]);

    const req = makeReq({ facilityId: "facility-1", status: "approved" });
    const res = makeRes();
    await EventController.getStatusFacilityEvents(req, res as unknown as Response);

    expect(EventModel.getAllStatusFacilityRequests).toHaveBeenCalledWith(
      "facility-1",
      "approved"
    );
    expect(res.json).toHaveBeenCalledWith([format(baseEvent)]);
  });

  it("getConflictingFacilityEvents returns [] when there are no events", async () => {
    vi.mocked(EventModel.getAllStatusFacilityRequests).mockResolvedValue([]);

    const req = makeReq({ facilityId: "facility-1", status: "pending" });
    const res = makeRes();
    await EventController.getConflictingFacilityEvents(
      req,
      res as unknown as Response
    );

    expect(EventModel.checkConflicts).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("getConflictingFacilityEvents de-dupes conflicts and formats output", async () => {
    const e1 = { ...baseEvent, id: "e1" };
    const e2 = { ...baseEvent, id: "e2" };

    const c1 = { ...baseEvent, id: "c1" };
    const c2 = { ...baseEvent, id: "c2" };
    const c3 = { ...baseEvent, id: "c3" };

    vi.mocked(EventModel.getAllStatusFacilityRequests).mockResolvedValue([e1, e2]);

    vi.mocked(EventModel.checkConflicts)
      .mockResolvedValueOnce([c1, c2])
      .mockResolvedValueOnce([c2, c3]);

    const req = makeReq({ facilityId: "facility-1", status: "pending" });
    const res = makeRes();
    await EventController.getConflictingFacilityEvents(
      req,
      res as unknown as Response
    );

    expect(EventModel.checkConflicts).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith([format(c1), format(c2), format(c3)]);
  });

  it("updateEventStatus returns 400 when status param is missing", async () => {
    const req = makeReq({ id: "event-1" }, { comments: "ok" });
    const res = makeRes();
    await EventController.updateEventStatus(req, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Status is required" });
  });

  it("updateEventStatus returns 404 when event not found", async () => {
    vi.mocked(EventModel.updateStatus).mockResolvedValue(false);

    const req = makeReq(
      { id: "event-1", status: "approved" },
      { comments: "ok" }
    );
    const res = makeRes();
    await EventController.updateEventStatus(req, res as unknown as Response);

    expect(EventModel.updateStatus).toHaveBeenCalledWith(
      "event-1",
      "approved",
      "ok"
    );
    expect(EventEmailService.sendBookingStatusUpdateEmail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
  });

  it("updateEventStatus updates status, sends email, and returns success", async () => {
    vi.mocked(EventModel.updateStatus).mockResolvedValue(true);
    vi.mocked(EventEmailService.sendBookingStatusUpdateEmail).mockResolvedValue(
      undefined
    );

    const req = makeReq(
      { id: "event-1", status: "approved" },
      { comments: "ok" }
    );
    const res = makeRes();
    await EventController.updateEventStatus(req, res as unknown as Response);

    expect(EventModel.updateStatus).toHaveBeenCalledWith(
      "event-1",
      "approved",
      "ok"
    );
    expect(EventEmailService.sendBookingStatusUpdateEmail).toHaveBeenCalledWith(
      "event-1"
    );
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});