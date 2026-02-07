import type { TeamEventFactory } from "./factory";
import type { GameEvent } from "../event";
import type { FullEventInput, GameEventInput } from "./inputs";

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
      type: "Game",
      ...this.input,
      opponent: this.input.opponent!,
      homeAway: this.input.homeAway!,
    };
  }
}
