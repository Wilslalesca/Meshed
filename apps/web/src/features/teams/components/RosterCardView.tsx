import type { Athlete } from "../types/roster";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";

export const RosterCardView = ({ roster }: { roster: Athlete[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {roster.map((athlete) => (
        <Card
          key={athlete.id}
          className="p-4 hover:shadow-md transition-all cursor-pointer"
        >
          <CardHeader>
            <CardTitle className="text-lg">
              {athlete.first_name} {athlete.last_name}
            </CardTitle>
            <p className="text-muted-foreground text-sm">{athlete.email}</p>
          </CardHeader>

          <CardContent className="text-sm space-y-1">
            <div><strong>Position:</strong> {athlete.position ?? "—"}</div>
            <div><strong>Status:</strong> {athlete.status}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
