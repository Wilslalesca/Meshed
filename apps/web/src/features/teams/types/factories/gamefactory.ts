import type { TeamEventFactory } from "./factory";
import type { GameEvent } from "../event";
import type { BaseEventInput, FullEventInput, GameEventInput } from "./inputs";

export class GameEventFactory implements TeamEventFactory {
  protected readonly input: FullEventInput;

  constructor(input: FullEventInput) {
    this.input = input;
  }

  private assertGameInput(): asserts this is { input: GameEventInput } {
    if (!this.input.opponent || !this.input.homeAway) {
      throw new Error("Invalid GameEventInput");
    }
  }

  createEvent(): GameEvent {
    this.assertGameInput();
    return {
      teamId: this.input.teamId,
      type: "Game",
      startDate: this.input.startDate,
      endDate: this.input.endDate,
      startTime: this.input.startTime,
      endTime: this.input.endTime,
      reoccurring: this.input.reoccurring,
      reoccurrType: this.input.reoccurrType,
      dayOfWeek: this.input.dayOfWeek,
      opponent: this.input.opponent!,
      homeAway: this.input.homeAway!,
    };
  }
}
