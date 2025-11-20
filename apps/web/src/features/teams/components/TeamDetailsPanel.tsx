import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team, SportLookup, League } from "../types/teams";
import { Button } from "@/shared/components/ui/button";

interface TeamDetailsPanelProps {
  team: Team | null;
  sport: SportLookup | null;
  league: League | null;
}

export const TeamDetailsPanel = ({ team, sport, league }: TeamDetailsPanelProps) => {
  if (!team) return null;

  return (
    <Card className="w-full sticky top-6">
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{sport?.sport_name ?? "—"}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div><span className="font-medium">Season:</span> {team.season ?? "—"}</div>
        <div><span className="font-medium">League:</span> {league?.league_name ?? "—"}</div>
        <div><span className="font-medium">Gender:</span> {team.gender ?? "—"}</div>

        <div className="pt-4 flex gap-2">
          <Button>Message</Button>
          <Button variant="outline">Schedule</Button>
        </div>
      </CardContent>
    </Card>
  );
};
