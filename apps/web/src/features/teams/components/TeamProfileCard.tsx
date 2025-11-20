import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team, SportLookup, League } from "../types/teams";

interface Props {
  team: Team;
  sport: SportLookup | null;
  league: League | null;
}

export const TeamProfileCard = ({ team, sport, league }: Props) => {
  const initials = team.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
            {initials}
          </div>

          <div>
            <CardTitle>{team.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{sport?.sport_name ?? "—"}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div><span className="font-medium">Season:</span> {team.season ?? "—"}</div>
        <div><span className="font-medium">League:</span> {league?.league_name ?? "—"}</div>
        <div><span className="font-medium">Gender:</span> {team.gender ?? "—"}</div>
        <div className="pt-4 text-muted-foreground">Team bio or description coming soon.</div>
      </CardContent>
    </Card>
  );
};
