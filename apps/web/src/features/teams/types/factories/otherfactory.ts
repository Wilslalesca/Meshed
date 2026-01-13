import type { TeamEventFactory } from "../factories/factory";
import type { OtherEvent } from "../event";
import type { FullEventInput } from "./inputs";

export class OtherEventFactory implements TeamEventFactory {
  private readonly input: FullEventInput;

  constructor(input: FullEventInput) {
    this.input = input;
  }

  createEvent(): OtherEvent {
    return {
      type: "Other",
      ...this.input,
      notes: this.input.notes
    };
  }
}
