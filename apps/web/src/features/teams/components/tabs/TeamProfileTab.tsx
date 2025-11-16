import { TeamProfileCard } from "../TeamProfileCard";
import type { Team, SportLookup, League } from "../../types/teams";

interface Props {
  team: Team;
  sport: SportLookup | null;
  league: League | null;
}

export const TeamProfileTab = ({ team, sport, league }: Props) => {
  return (
    <div className="max-w-xl">
      <TeamProfileCard team={team} sport={sport} league={league} />
    </div>
  );
};
