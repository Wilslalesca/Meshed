import { PracticeEventFactory } from "../factories/practicefactory";
import { GameEventFactory } from "../factories/gamefactory";
import { LiftEventFactory } from "../factories/liftfactory";
import { OtherEventFactory } from "../factories/otherfactory";
import type { TeamEventFactory } from "./factory";
import type { TeamEventType } from "../event";
import type { FullEventInput } from "../factories/inputs";

export const TeamEventFactoryRegistry: {
  readonly [K in TeamEventType]: new (input: FullEventInput) => TeamEventFactory;
} = {
  Practice: PracticeEventFactory,
  Game: GameEventFactory,
  Lift: LiftEventFactory,
  Other: OtherEventFactory,
  Class: OtherEventFactory,
  "Team Event": OtherEventFactory,
} as const;

