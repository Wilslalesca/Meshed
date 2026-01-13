import type { TeamEventFactory } from "../factories/factory";
import type { LiftEvent } from "../event";
import type { FullEventInput } from "./inputs";

export class LiftEventFactory implements TeamEventFactory {
  private readonly input: FullEventInput;

  constructor(input: FullEventInput) {
    this.input = input;
  }

  createEvent(): LiftEvent {
    return {
      type: "Lift",
      ...this.input,
      liftType: this.input.liftType
    };
  }
}
