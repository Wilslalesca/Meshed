import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team } from "../types/teams";
import { cn } from "@/shared/utils/utils";

interface TeamCardProps {
  team: Team;
  selected: boolean;
  rosterCount: number;
  onSelect: () => void;
}

export const TeamCard = ({ team, selected, rosterCount, onSelect }: TeamCardProps) => {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all border",
        selected ? "border-primary shadow" : "hover:shadow-sm"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg">{team.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-1">
        <div>Season: {team.season ?? "—"}</div>
        <div>Gender: {team.gender ?? "—"}</div>
        <div className="text-muted-foreground">Players: {rosterCount}</div>
      </CardContent>
    </Card>
  );
};
