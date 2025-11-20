import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team, SportLookup, League } from "../../types/teams";

interface Props {
  team: Team;
  sport: SportLookup | null;
  league: League | null;
}

export const TeamProfileTab = ({ team, sport, league }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{team.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {sport?.sport_name ?? "—"} • {team.gender ?? "—"}
          </p>
        </div>

      </CardHeader>

      <CardContent className="text-sm space-y-3">
        <div><strong>Season:</strong> {team.season ?? "—"}</div>
        <div><strong>League:</strong> {league?.league_name ?? "—"}</div>
        <div><strong>Gender:</strong> {team.gender ?? "—"}</div>

        <div className="mt-4 text-muted-foreground">
          Team bio or description coming soon.
        </div>
      </CardContent>
    </Card>
  );
};
