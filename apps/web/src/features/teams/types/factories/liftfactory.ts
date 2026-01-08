import type { TeamEventFactory } from "../factories/factory";
import type { LiftEvent } from "../event";
import type { LiftEventInput } from "./inputs";

export class LiftEventFactory implements TeamEventFactory {
  private readonly input: LiftEventInput;

  constructor(input: LiftEventInput) {
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
