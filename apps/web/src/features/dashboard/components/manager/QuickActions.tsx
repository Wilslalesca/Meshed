import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Megaphone, CalendarPlus, Users, Calendar } from "lucide-react";

export const QuickActions = ({
  selectedTeamId,
}: {
  selectedTeamId?: string;
}) => {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();

  const teamTabPath = (tab: "profile" | "roster" | "staff" | "schedule") =>
    selectedTeamId ? `/teams/${selectedTeamId}?tab=${tab}` : "/teams";

  // updated per frans note on the expected behaviour of the addevent vs add training comment for quick links - remove comment after confirmation
  const teamModalPath = (
    tab: "profile" | "roster" | "staff" | "schedule",
    modal: "addEvent" | "announce",
  ) => (selectedTeamId ? `/teams/${selectedTeamId}?tab=${tab}&${modal}=true` : "/teams");

  const actions = [
    {
      id: "announce",
      label: "Send Announcement",
      icon: Megaphone,
      path: teamModalPath("profile", "announce"),
    },
    {
      id: "addEvent",
      label: "Add Event",
      icon: CalendarPlus,
      path: teamModalPath("schedule", "addEvent"),
    },
    {
      id: "manageRoster",
      label: "Manage Roster",
      icon: Users,
      path: teamTabPath("roster"),
    },
    {
      id: "viewSchedule",
      label: "View Schedule",
      icon: Calendar,
      path: teamTabPath("schedule"),
    },
  ];
  const handleAction = (action: string, path: string) => {
    setActive(action);
    setTimeout(() => {
      setActive(null);
      navigate(path);
    }, 600);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Tools to manage your athletes and team.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {actions.map((a) => (
            <Button
              key={a.id}
              variant="outline"
              className="flex h-24 flex-col justify-center items-center gap-1"
              onClick={() => handleAction(a.id, a.path)}
              disabled={active === a.id}
            >
              {active === a.id ? (
                <div className="h-5 w-5 animate-spin border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <a.icon className="h-5 w-5" />
              )}
              <span className="text-xs text-center">{a.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
