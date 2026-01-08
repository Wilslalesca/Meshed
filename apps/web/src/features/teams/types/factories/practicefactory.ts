import type { TeamEventFactory } from "../factories/factory";
import type { PracticeEvent } from "../event";
import type { PracticeEventInput } from "./inputs";

export class PracticeEventFactory implements TeamEventFactory {
  private readonly input: PracticeEventInput;

  constructor(input: PracticeEventInput) {
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
