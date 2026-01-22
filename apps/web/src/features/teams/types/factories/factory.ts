import type { TeamEvent } from "../event";

export interface TeamEventFactory {
  createEvent(): TeamEvent;
}