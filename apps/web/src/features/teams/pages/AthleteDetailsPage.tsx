import { useParams } from "react-router-dom";
import { useAthleteById } from "../hooks/useAthleteById";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

export const AthleteDetailsPage = () => {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { athlete, loading } = useAthleteById(athleteId!);

  if (loading || !athlete) return <p className="p-6">Loading...</p>;

  const initials = `${athlete.first_name[0]}${athlete.last_name[0]}`.toUpperCase();

  return (
    <div className="p-6 space-y-6">

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 text-2xl">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-2xl">
                {athlete.first_name} {athlete.last_name}
              </CardTitle>
              <p className="text-muted-foreground">{athlete.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-sm space-y-2">
          <div><strong>Position:</strong> {athlete.position ?? "—"}</div>
          <div><strong>Status:</strong> {athlete.status}</div>
          <div><strong>Joined:</strong> {athlete.joined_at}</div>
        </CardContent>
      </Card>

    </div>
  );
};
