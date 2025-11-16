import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import type { Athlete } from "../../types/roster";

interface Props {
  roster: Athlete[];
}

export const RosterCardView = ({ roster }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {roster.map((a) => {
        const initials = `${a.first_name[0]}${a.last_name[0]}`.toUpperCase();
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center font-semibold">
                  {initials}
                </div>
                <CardTitle className="text-lg">
                  {a.first_name} {a.last_name}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <div>{a.email}</div>
              <div>Status: {a.status}</div>
              <div>Position: {a.position ?? "—"}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
