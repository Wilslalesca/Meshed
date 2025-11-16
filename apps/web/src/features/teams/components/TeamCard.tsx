import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/utils";
import type { Team } from "../types/teams";

interface TeamCardProps {
  team: Team;
  rosterCount: number;
  onSelect: () => void;
}

export const TeamCard = ({ team, rosterCount, onSelect }: TeamCardProps) => {
  const initials = team.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer border hover:shadow-md transition-all p-0"
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {initials}
          </div>
          <CardTitle className="text-lg">{team.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="text-sm space-y-1 pt-3">
        <div>Season: {team.season ?? "—"}</div>
        <div>Gender: {team.gender ?? "—"}</div>
        <div className="text-muted-foreground">Players: {rosterCount}</div>
      </CardContent>
    </Card>
  );
};
