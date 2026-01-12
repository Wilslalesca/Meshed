import type { TeamEventFactory } from "./factory";
import type { PracticeEvent } from "../event";
import type { BaseEventInput } from "./inputs";

export class PracticeEventFactory implements TeamEventFactory {
  private readonly input: BaseEventInput;

  constructor(input: BaseEventInput) {
    this.input = input;
  }

  createEvent(): PracticeEvent {
    return {
      teamId: this.input.teamId,
      type: "Practice",
      startDate: this.input.startDate,
      endDate: this.input.endDate,
      startTime: this.input.startTime,
      endTime: this.input.endTime,
      reoccurring: this.input.reoccurring,
      reoccurrType: this.input.reoccurrType,
      notes: (this.input as any).notes, // or validate if needed
    };
  }
}
