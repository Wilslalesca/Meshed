import type { TeamEventFactory } from "../factories/factory";
import type { GameEvent } from "../event";
import type { GameEventInput } from "./inputs";

export class GameEventFactory implements TeamEventFactory {
  private readonly input: GameEventInput;

  constructor(input: GameEventInput) {
    this.input = input;
  }

  createEvent(): GameEvent {
    return {
      type: "Game",
      ...this.input,
      opponent: this.input.opponent,
      homeAway: this.input.homeAway,
    };
  }
}
