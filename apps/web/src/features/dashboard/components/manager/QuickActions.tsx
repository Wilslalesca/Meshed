import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Megaphone, CalendarPlus, Users, MapPin, CheckCircle, Calendar } from "lucide-react";

export const QuickActions = () => {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();

  const actions = [
    { id: "announce", label: "Send Announcement", icon: Megaphone, path: "/announcements/new" },
    { id: "addTraining", label: "Add Training", icon: CalendarPlus, path: "/training/new" },
    { id: "manageRoster", label: "Manage Roster", icon: Users, path: "/team/roster" },
    { id: "bookFacility", label: "Book Facility", icon: MapPin, path: "/facilities" },
    { id: "teamCalendar", label: "Team Calendar", icon: Calendar, path: "/team/calendar" },
    { id: "approveSchedules", label: "Approve Schedules", icon: CheckCircle, path: "/schedule/approvals" },
    { id : "generateOptimalSchedule", label: "Generate Optimal Schedule", icon: Calendar, path: "/optimize" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
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
