import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  roster: any[];
  onRemoved?: () => void;
  onRemoveAthlete?: (id: string) => void;
}

export const RosterCardView = ({ roster, onRemoveAthlete }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roster.map((athlete) => {
        const initials = `${athlete.first_name[0]}${athlete.last_name[0]}`.toUpperCase();

        return (
          <Card key={athlete.id} className="relative">
            <CardHeader
              className="cursor-pointer"
              onClick={() => navigate(`/athletes/${athlete.id}`)}
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 text-xl">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="text-xl">
                    {athlete.first_name} {athlete.last_name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{athlete.email}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-1 text-sm">
              <div>
                <strong>Status:</strong> {athlete.status}
              </div>
              <div>
                <strong>Joined:</strong> {athlete.joined_at}
              </div>
            </CardContent>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation(); 
                onRemoveAthlete?.(athlete.id);
              }}
            >
              <Trash size={18} className="text-red-500" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
