import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Team, SportLookup, League } from "../../types/teams";
import { Button } from "@/shared/components/ui/button";

interface Props {
  team: Team;
  sport: SportLookup | null;
  league: League | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TeamProfileTab = ({ team, sport, league, onEdit, onDelete }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{team.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {sport?.sport_name ?? "—"} • {team.gender ?? "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
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
