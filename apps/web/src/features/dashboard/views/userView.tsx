import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { QuickActions } from "../components/QuickActions";
import { StatCard } from "../components/StatCard";
import { ScheduleWidget } from "../components/ScheduleWidget";
import { FacilityWidget } from "../components/FacilityWidget";
import { ActivityFeed } from "../components/ActivityFeed";

export const UserDashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* === Stats Row === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Upcoming Classes" value="6" subtitle="+2 this week" />
        <StatCard title="Training Sessions" value="3" subtitle="+1 added" />
        <StatCard title="Available Facilities" value="5" subtitle="Open today" />
        <StatCard title="Unread Messages" value="4" subtitle="Coach updates" />
      </div>

      {/* === Quick Actions === */}
      <QuickActions />

      {/* === Middle Section: Schedule / Activity / Facilities === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Schedule Overview */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>My Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScheduleWidget />
          </CardContent>
        </Card>

        {/* Right: Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>

      {/* === Bottom Section: Facilities / Additional Info === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Facility Availability</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <FacilityWidget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              Coming soon: athlete performance metrics
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
