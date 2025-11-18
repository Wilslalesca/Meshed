import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Calendar, MessageCircle, Trash } from "lucide-react";
import { useUserRole } from "@/shared/hooks/useUserRole";
import type { StaffMember } from "../types/staff";

interface Props {
  staff: StaffMember[];
  onRemove?: (id: string) => void;
}

export const StaffCardView = ({ staff, onRemove }: Props) => {
  const role = useUserRole();
  const isManager = role.isManager;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {staff.map((member) => {
        const first = member.first_name ?? "";
        const last = member.last_name ?? "";
        const initials = `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "S";

        return (
          <Card key={member.id} className="relative">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 text-xl">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {first} {last}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {member.email ?? "no email"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Role:</strong> {member.role}
              </div>
              <div>
                <strong>Status:</strong> {member.status ?? "pending"}
              </div>
              <div>
                <strong>Notes:</strong> {member.notes ?? "—"}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  <Calendar size={14} className="mr-1" />
                  Schedule
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  <MessageCircle size={14} className="mr-1" />
                  Message
                </Button>
              </div>
            </CardContent>
            {isManager && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onRemove?.(member.id)}
              >
                <Trash className="text-red-500" size={18} />
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
};
