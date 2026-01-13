import type { TeamEventFactory } from "./factory";
import type { PracticeEvent } from "../event";
import type { FullEventInput } from "./inputs";

export class PracticeEventFactory implements TeamEventFactory {
  private readonly input: FullEventInput;

  constructor(input: FullEventInput) {
    this.input = input;
  }

  createEvent(): PracticeEvent {
    return {
      type: "Practice",
      ...this.input,
      notes: this.input.notes
    };
  }
}
