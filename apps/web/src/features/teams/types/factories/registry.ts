import { PracticeEventFactory } from "../factories/practicefactory"
import { GameEventFactory } from "../factories/gamefactory"
import { LiftEventFactory } from "../factories/liftfactory"
import { OtherEventFactory } from "../factories/otherfactory"
import type { TeamEventFactory } from "./factory"
import type { TeamEventType } from "../event"

export const TeamEventFactoryRegistry : {readonly [K in TeamEventType]: new (input: any) => TeamEventFactory;
} = {
  Practice: PracticeEventFactory,
  Game: GameEventFactory,
  Lift: LiftEventFactory,
  Other: OtherEventFactory,
} as const;
