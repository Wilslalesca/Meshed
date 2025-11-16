import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Athlete } from "../types/roster";

interface RosterCardProps {
  roster: Athlete[];
}

export const RosterCard = ({ roster }: RosterCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roster</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {roster.length === 0 && (
          <p className="text-muted-foreground">No athletes yet.</p>
        )}

        {roster.length > 0 && (
          <ul className="space-y-1">
            {roster.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>
                  {a.first_name} {a.last_name} ({a.email})
                </span>
                <span className="text-xs text-muted-foreground">{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
