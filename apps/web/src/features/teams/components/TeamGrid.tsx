import type { Team } from "../types/teams";
import { TeamCard } from "./TeamCard";

interface Props {
  teams: Team[];
  onSelect: (id: string) => void;
  rosterCounts: Record<string, number>;
}

export const TeamGrid = ({ teams, onSelect, rosterCounts }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          rosterCount={rosterCounts[team.id] ?? 0}
          onSelect={() => onSelect(team.id)}
        />
      ))}
    </div>
  );
};
