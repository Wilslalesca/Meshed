import type { TeamEventFactory } from "../factories/factory";
import type { OtherEvent } from "../event";
import type { OtherEventInput } from "./inputs";

export class OtherEventFactory implements TeamEventFactory {
  private readonly input: OtherEventInput;

  constructor(input: OtherEventInput) {
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
