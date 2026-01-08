import { PracticeEventFactory } from "../factories/practicefactory"
import { GameEventFactory } from "../factories/gamefactory"
import { LiftEventFactory } from "../factories/liftfactory"
import { OtherEventFactory } from "../factories/otherfactory"

export const TeamEventFactoryRegistry = {
  Practice: PracticeEventFactory,
  Game: GameEventFactory,
  Lift: LiftEventFactory,
  Other: OtherEventFactory,
} as const;
